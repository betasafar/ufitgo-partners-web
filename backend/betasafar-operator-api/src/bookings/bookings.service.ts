// src/bookings/bookings.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Booking, BookingStatus } from "./entities/booking.entity"
import type { EmailService } from "../common/email/email.service"
import type { ApproveBookingDto } from "./dto/approve-booking.dto"
import type { RejectBookingDto } from "./dto/reject-booking.dto"
import type { RefundBookingDto } from "./dto/refund-booking.dto"

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingRepo: Repository<Booking>,
    private readonly emailService: EmailService,
  ) {}

  async findAllForOperator(operatorId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { operatorId },
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: number, operatorId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`)
    }

    return booking
  }

  async adjustPayment(
    id: number,
    operatorId: number,
    updateData: {
      amountPaid?: number
      status?: BookingStatus
      paymentDetails?: Record<string, any>
    },
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`)
    }

    const previousStatus = booking.status

    if (updateData.amountPaid !== undefined) {
      booking.amountPaid = updateData.amountPaid
    }

    if (updateData.status) {
      if (updateData.status === BookingStatus.FULLY_PAID && Number(booking.amountPaid) < Number(booking.totalAmount)) {
        throw new BadRequestException("Cannot mark as fully paid: amount paid is less than total amount")
      }
      booking.status = updateData.status
    }

    if (updateData.paymentDetails) {
      booking.paymentDetails = {
        ...booking.paymentDetails,
        ...updateData.paymentDetails,
      }
    }

    const updatedBooking = await this.bookingRepo.save(booking)

    if (
      (previousStatus !== BookingStatus.CONFIRMED && updatedBooking.status === BookingStatus.CONFIRMED) ||
      (previousStatus !== BookingStatus.FULLY_PAID && updatedBooking.status === BookingStatus.FULLY_PAID)
    ) {
      if (updatedBooking.operator?.email) {
        await this.emailService.sendNewBookingEmail(updatedBooking.operator.email, {
          companyName: updatedBooking.operator.companyName || "Valued Operator",
          bookingId: updatedBooking.id,
          pilgrimName: updatedBooking.pilgrimName || "Pilgrim",
          packageTitle: updatedBooking.package?.title || "Hajj/Umrah Package",
          numberOfPilgrims: updatedBooking.numberOfPilgrims,
          totalAmount: updatedBooking.totalAmount,
        })
      }
    }

    return updatedBooking
  }

  async findByPackage(packageId: number, operatorId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { packageId, operatorId },
      order: { createdAt: "DESC" },
    })
  }

  async getStats(operatorId: number) {
    const result = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COUNT(*)", "total")
      .addSelect("SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END)", "pending")
      .addSelect("SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END)", "confirmed")
      .addSelect("SUM(b.amountPaid)", "revenueCollected")
      .where("b.operatorId = :operatorId", { operatorId })
      .getRawOne()

    return {
      totalBookings: Number(result.total || 0),
      pendingBookings: Number(result.pending || 0),
      confirmedBookings: Number(result.confirmed || 0),
      revenueCollected: Number(result.revenueCollected || 0),
    }
  }

  async getUrgentTasks(operatorId: number) {
    const tasks: Array<{
      id: string
      title: string
      description: string
      count: number
      priority: string
      action: string
    }> = []

    const pendingCount = await this.bookingRepo.count({
      where: { operatorId, status: BookingStatus.PENDING },
    })

    if (pendingCount > 0) {
      tasks.push({
        id: "pending-bookings",
        title: "Pending Bookings",
        description: `${pendingCount} booking${pendingCount > 1 ? "s" : ""} awaiting confirmation`,
        count: pendingCount,
        priority: "high",
        action: "/dashboard/applicants?status=pending",
      })
    }

    const incompletePayments = await this.bookingRepo.count({
      where: { operatorId, status: BookingStatus.DEPOSIT_PAID },
    })

    if (incompletePayments > 0) {
      tasks.push({
        id: "incomplete-payments",
        title: "Incomplete Payments",
        description: `${incompletePayments} booking${incompletePayments > 1 ? "s" : ""} with pending balance`,
        count: incompletePayments,
        priority: "medium",
        action: "/dashboard/payments?status=partial",
      })
    }

    const weekFromNow = new Date()
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    const upcomingDepartures = await this.bookingRepo
      .createQueryBuilder("b")
      .leftJoinAndSelect("b.package", "p")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.status IN (:...statuses)", {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.FULLY_PAID],
      })
      .andWhere("p.departureDate <= :weekFromNow", { weekFromNow })
      .andWhere("p.departureDate >= :now", { now: new Date() })
      .getCount()

    if (upcomingDepartures > 0) {
      tasks.push({
        id: "upcoming-departures",
        title: "Upcoming Departures",
        description: `${upcomingDepartures} departure${upcomingDepartures > 1 ? "s" : ""} in the next 7 days`,
        count: upcomingDepartures,
        priority: "high",
        action: "/dashboard/packages",
      })
    }

    return { tasks, totalUrgent: tasks.filter((t) => t.priority === "high").length }
  }

  async getRecentTravelers(operatorId: number, limit = 5) {
    return this.bookingRepo.find({
      where: { operatorId },
      relations: ["package"],
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async findOneDetailed(id: number, operatorId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`)
    }

    const paymentProgress = (Number(booking.amountPaid) / Number(booking.totalAmount)) * 100

    const relatedBookings = await this.bookingRepo.count({
      where: { packageId: booking.packageId, operatorId },
    })

    return {
      ...booking,
      paymentProgress: Math.round(paymentProgress),
      remainingBalance: Number(booking.totalAmount) - Number(booking.amountPaid),
      relatedBookingsCount: relatedBookings - 1,
    }
  }

  async approveBooking(id: number, operatorId: number, dto: ApproveBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`)
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(`Booking is not in pending status`)
    }

    booking.status = BookingStatus.CONFIRMED

    if (dto.notes) {
      booking.paymentDetails = {
        ...booking.paymentDetails,
        approvalNotes: dto.notes,
        approvedAt: new Date().toISOString(),
      }
    }

    const updatedBooking = await this.bookingRepo.save(booking)

    if (updatedBooking.operator?.email) {
      await this.emailService.sendNewBookingEmail(updatedBooking.operator.email, {
        companyName: updatedBooking.operator.companyName || "Valued Operator",
        bookingId: updatedBooking.id,
        pilgrimName: updatedBooking.pilgrimName || "Pilgrim",
        packageTitle: updatedBooking.package?.title || "Travel Package",
        numberOfPilgrims: updatedBooking.numberOfPilgrims,
        totalAmount: updatedBooking.totalAmount,
      })
    }

    return updatedBooking
  }

  async rejectBooking(id: number, operatorId: number, dto: RejectBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`)
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(`Booking is already cancelled`)
    }

    booking.status = BookingStatus.CANCELLED
    booking.paymentDetails = {
      ...booking.paymentDetails,
      rejectionReason: dto.reason,
      rejectedAt: new Date().toISOString(),
    }

    const updatedBooking = await this.bookingRepo.save(booking)

    if (updatedBooking.operator?.email) {
      // You can add a sendBookingRejectionEmail method to email service
    }

    return updatedBooking
  }

  async processRefund(id: number, operatorId: number, dto: RefundBookingDto) {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ["operator", "package"],
    })

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`)
    }

    if (dto.amount > Number(booking.amountPaid)) {
      throw new BadRequestException(`Refund amount cannot exceed amount paid (${booking.amountPaid})`)
    }

    const newAmountPaid = Number(booking.amountPaid) - dto.amount

    booking.amountPaid = newAmountPaid

    if (newAmountPaid === 0) {
      booking.status = BookingStatus.CANCELLED
    } else if (newAmountPaid < Number(booking.totalAmount)) {
      booking.status = BookingStatus.DEPOSIT_PAID
    }

    booking.paymentDetails = {
      ...booking.paymentDetails,
      refunds: [
        ...(booking.paymentDetails?.refunds || []),
        {
          amount: dto.amount,
          reason: dto.reason,
          method: dto.method,
          processedAt: new Date().toISOString(),
        },
      ],
    }

    const updatedBooking = await this.bookingRepo.save(booking)

    return {
      success: true,
      message: `Refund of ${dto.amount} processed successfully`,
      booking: updatedBooking,
      refundAmount: dto.amount,
      remainingBalance: Number(updatedBooking.totalAmount) - Number(updatedBooking.amountPaid),
    }
  }
}
