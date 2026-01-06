// src/bookings/bookings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from '../common/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private emailService: EmailService,
  ) {}

  async findAllForOperator(operatorId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { operatorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, operatorId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ['operator', 'package'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found or access denied`);
    }

    return booking;
  }

  async adjustPayment(
    id: number,
    operatorId: number,
    updateData: {
      amountPaid?: number;
      status?: BookingStatus;
      paymentDetails?: Record<string, any>;
    },
  ): Promise<Booking> {
    // Load booking with operator relation because we need email/companyName for notification
    const booking = await this.bookingRepo.findOne({
      where: { id, operatorId },
      relations: ['operator', 'package'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const previousStatus = booking.status;

    if (updateData.amountPaid !== undefined) {
      booking.amountPaid = updateData.amountPaid;
    }

    if (updateData.status) {
      if (
        updateData.status === BookingStatus.FULLY_PAID &&
        Number(booking.amountPaid) < Number(booking.totalAmount)
      ) {
        throw new BadRequestException(
          'Cannot mark as fully paid: amount paid is less than total amount',
        );
      }
      booking.status = updateData.status;
    }

    if (updateData.paymentDetails) {
      booking.paymentDetails = {
        ...booking.paymentDetails,
        ...updateData.paymentDetails,
      };
    }

    const updatedBooking = await this.bookingRepo.save(booking);

    // Send email only when status changes to confirmed or fully_paid
    if (
      (previousStatus !== BookingStatus.CONFIRMED && updatedBooking.status === BookingStatus.CONFIRMED) ||
      (previousStatus !== BookingStatus.FULLY_PAID && updatedBooking.status === BookingStatus.FULLY_PAID)
    ) {
      if (updatedBooking.operator?.email) {
        await this.emailService.sendNewBookingEmail(updatedBooking.operator.email, {
          companyName: updatedBooking.operator.companyName || 'Valued Operator',
          bookingId: updatedBooking.id,
          pilgrimName: updatedBooking.pilgrimName || 'Pilgrim',
          packageTitle: updatedBooking.package?.title || 'Hajj/Umrah Package',
          numberOfPilgrims: updatedBooking.numberOfPilgrims,
          totalAmount: updatedBooking.totalAmount,
        });
      }
    }

    return updatedBooking;
  }

  async findByPackage(packageId: number, operatorId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { packageId, operatorId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(operatorId: number) {
    const result = await this.bookingRepo
      .createQueryBuilder('b')
      .select('COUNT(*)', 'total')
      .addSelect("SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END)", 'pending')
      .addSelect("SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END)", 'confirmed')
      .addSelect('SUM(b.amountPaid)', 'revenueCollected')
      .where('b.operatorId = :operatorId', { operatorId })
      .getRawOne();

    return {
      totalBookings: Number(result.total || 0),
      pendingBookings: Number(result.pending || 0),
      confirmedBookings: Number(result.confirmed || 0),
      revenueCollected: Number(result.revenueCollected || 0),
    };
  }
}