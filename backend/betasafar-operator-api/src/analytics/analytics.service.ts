import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  // Revenue summary (all time or date range)
  async getRevenue(operatorId: number, startDate?: Date, endDate?: Date) {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .select('COALESCE(SUM(b.amountPaid), 0)', 'totalCollected')
      .addSelect('COALESCE(SUM(CASE WHEN b.status = :fullyPaid THEN b.totalAmount ELSE 0 END), 0)', 'totalExpected')
      .where('b.operatorId = :operatorId', { operatorId });

    if (startDate && endDate) {
      qb.andWhere('b.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
    }

    qb.setParameter('fullyPaid', BookingStatus.FULLY_PAID);

    const result = await qb.getRawOne();

    return {
      totalCollected: Number(result.totalCollected || 0),
      totalExpected: Number(result.totalExpected || 0),
      outstanding: Number(result.totalExpected || 0) - Number(result.totalCollected || 0),
    };
  }

  // Booking statistics
  async getBookingStats(operatorId: number) {
    const result = await this.bookingRepo
      .createQueryBuilder('b')
      .select('COUNT(*)', 'total')
      .addSelect("SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END)", 'pending')
      .addSelect("SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END)", 'confirmed')
      .addSelect("SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END)", 'cancelled')
      .where('b.operatorId = :operatorId', { operatorId })
      .getRawOne();

    return {
      totalBookings: Number(result.total || 0),
      pending: Number(result.pending || 0),
      confirmed: Number(result.confirmed || 0),
      cancelled: Number(result.cancelled || 0),
    };
  }

  // Popular / Top performing packages
  async getPopularPackages(operatorId: number, limit = 5) {
    return this.bookingRepo
      .createQueryBuilder('b')
      .select('b.packageId', 'packageId')
      .addSelect('COUNT(*)', 'bookingCount')
      .addSelect('SUM(b.amountPaid)', 'revenue')
      .where('b.operatorId = :operatorId', { operatorId })
      .groupBy('b.packageId')
      .orderBy('bookingCount', 'DESC')
      .addOrderBy('revenue', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  // Monthly revenue trend (last 12 months)
  async getMonthlyRevenueTrend(operatorId: number) {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

    const data = await this.bookingRepo
      .createQueryBuilder('b')
      .select("TO_CHAR(b.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COALESCE(SUM(b.amountPaid), 0)', 'revenue')
      .where('b.operatorId = :operatorId', { operatorId })
      .andWhere('b.createdAt >= :start', { start: twelveMonthsAgo })
      .groupBy("TO_CHAR(b.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return data.map(row => ({
      month: row.month,
      revenue: Number(row.revenue),
    }));
  }
}
