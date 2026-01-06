// src/bookings/bookings.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { EmailService } from "../common/email/email.service"
import type { Repository } from "typeorm"
import { type Booking, BookingStatus } from "./entities/booking.entity"

@Injectable()
export class BookingsService {
  private readonly bookingRepo: Repository<Booking>
  private emailService: EmailService

  constructor(bookingRepo: Repository<Booking>, emailService: EmailService) {
    this.bookingRepo = bookingRepo
    this.emailService = emailService
  }

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
    // Load booking with operator relation because we need email/companyName for notification
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

    // Send email only when status changes to confirmed or fully_paid
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

    // 1. Pending bookings awaiting confirmation
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

    // 2. Incomplete payments (deposit paid but not fully paid)
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

    // 3. Bookings with departure in next 7 days
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

    // Calculate payment progress
    const paymentProgress = (Number(booking.amountPaid) / Number(booking.totalAmount)) * 100

    // Get related bookings from same package
    const relatedBookings = await this.bookingRepo.count({
      where: { packageId: booking.packageId, operatorId },
    })

    return {
      ...booking,
      paymentProgress: Math.round(paymentProgress),
      remainingBalance: Number(booking.totalAmount) - Number(booking.amountPaid),
      relatedBookingsCount: relatedBookings - 1, // exclude current booking
    }
  }
}
