import { Injectable } from "@nestjs/common"
import { type Repository, Between } from "typeorm"
import { type Booking, BookingStatus } from "../bookings/entities/booking.entity"
import type { WalletTransaction } from "../wallet/entities/wallet-transaction.entity"

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly bookingRepo: Repository<Booking>,
    private readonly transactionRepo: Repository<WalletTransaction>,
  ) {}

  // Revenue summary (all time or date range)
  async getRevenue(operatorId: number, startDate?: Date, endDate?: Date) {
    const qb = this.bookingRepo
      .createQueryBuilder("b")
      .select("COALESCE(SUM(b.amountPaid), 0)", "totalCollected")
      .addSelect("COALESCE(SUM(CASE WHEN b.status = :fullyPaid THEN b.totalAmount ELSE 0 END), 0)", "totalExpected")
      .where("b.operatorId = :operatorId", { operatorId })

    if (startDate && endDate) {
      qb.andWhere("b.createdAt BETWEEN :start AND :end", { start: startDate, end: endDate })
    }

    qb.setParameter("fullyPaid", BookingStatus.FULLY_PAID)

    const result = await qb.getRawOne()

    return {
      totalCollected: Number(result.totalCollected || 0),
      totalExpected: Number(result.totalExpected || 0),
      outstanding: Number(result.totalExpected || 0) - Number(result.totalCollected || 0),
    }
  }

  // Booking statistics
  async getBookingStats(operatorId: number) {
    const result = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COUNT(*)", "total")
      .addSelect("SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END)", "pending")
      .addSelect("SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END)", "confirmed")
      .addSelect("SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END)", "cancelled")
      .where("b.operatorId = :operatorId", { operatorId })
      .getRawOne()

    return {
      totalBookings: Number(result.total || 0),
      pending: Number(result.pending || 0),
      confirmed: Number(result.confirmed || 0),
      cancelled: Number(result.cancelled || 0),
    }
  }

  // Popular / Top performing packages
  async getPopularPackages(operatorId: number, limit = 5) {
    return this.bookingRepo
      .createQueryBuilder("b")
      .select("b.packageId", "packageId")
      .addSelect("COUNT(*)", "bookingCount")
      .addSelect("SUM(b.amountPaid)", "revenue")
      .where("b.operatorId = :operatorId", { operatorId })
      .groupBy("b.packageId")
      .orderBy("bookingCount", "DESC")
      .addOrderBy("revenue", "DESC")
      .limit(limit)
      .getRawMany()
  }

  // Monthly revenue trend (last 12 months)
  async getMonthlyRevenueTrend(operatorId: number) {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)

    const data = await this.bookingRepo
      .createQueryBuilder("b")
      .select("TO_CHAR(b.createdAt, 'YYYY-MM')", "month")
      .addSelect("COALESCE(SUM(b.amountPaid), 0)", "revenue")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.createdAt >= :start", { start: twelveMonthsAgo })
      .groupBy("TO_CHAR(b.createdAt, 'YYYY-MM')")
      .orderBy("month", "ASC")
      .getRawMany()

    return data.map((row) => ({
      month: row.month,
      revenue: Number(row.revenue),
    }))
  }

  // Comprehensive dashboard stats
  async getDashboardStats(operatorId: number) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Total bookings and trend
    const [currentMonthBookings, lastMonthBookings] = await Promise.all([
      this.bookingRepo.count({
        where: { operatorId, createdAt: Between(startOfMonth, now) },
      }),
      this.bookingRepo.count({
        where: { operatorId, createdAt: Between(startOfLastMonth, endOfLastMonth) },
      }),
    ])

    const bookingsTrend =
      lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0

    // Revenue stats
    const revenueResult = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COALESCE(SUM(b.amountPaid), 0)", "total")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.createdAt >= :start", { start: startOfMonth })
      .getRawOne()

    const lastMonthRevenue = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COALESCE(SUM(b.amountPaid), 0)", "total")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.createdAt BETWEEN :start AND :end", {
        start: startOfLastMonth,
        end: endOfLastMonth,
      })
      .getRawOne()

    const currentRevenue = Number(revenueResult.total)
    const previousRevenue = Number(lastMonthRevenue.total)
    const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Active travelers (bookings with confirmed/fully_paid status)
    const activeTravelers = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COALESCE(SUM(b.numberOfPilgrims), 0)", "count")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.status IN (:...statuses)", {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.FULLY_PAID],
      })
      .getRawOne()

    // Pending payments
    const pendingPayments = await this.bookingRepo
      .createQueryBuilder("b")
      .select("COALESCE(SUM(b.totalAmount - b.amountPaid), 0)", "total")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.status != :cancelled", { cancelled: BookingStatus.CANCELLED })
      .getRawOne()

    return {
      totalBookings: currentMonthBookings,
      bookingsTrend: Math.round(bookingsTrend * 10) / 10,
      revenue: currentRevenue,
      revenueTrend: Math.round(revenueTrend * 10) / 10,
      activeTravelers: Number(activeTravelers.count),
      pendingPayments: Number(pendingPayments.total),
    }
  }

  // Revenue flow with different time periods
  async getRevenueFlow(
    operatorId: number,
    period: "daily" | "weekly" | "monthly",
    startDate?: string,
    endDate?: string,
  ) {
    const end = endDate ? new Date(endDate) : new Date()
    let start: Date

    switch (period) {
      case "daily":
        start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "weekly":
        start = startDate ? new Date(startDate) : new Date(end.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
      default:
        start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 11, 1)
    }

    let dateFormat: string
    switch (period) {
      case "daily":
        dateFormat = "YYYY-MM-DD"
        break
      case "weekly":
        dateFormat = 'YYYY-"W"IW'
        break
      case "monthly":
      default:
        dateFormat = "YYYY-MM"
    }

    const data = await this.bookingRepo
      .createQueryBuilder("b")
      .select(`TO_CHAR(b.createdAt, '${dateFormat}')`, "period")
      .addSelect("COALESCE(SUM(b.amountPaid), 0)", "revenue")
      .addSelect("COUNT(*)", "bookings")
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.createdAt BETWEEN :start AND :end", { start, end })
      .groupBy("period")
      .orderBy("period", "ASC")
      .getRawMany()

    return data.map((row) => ({
      period: row.period,
      revenue: Number(row.revenue),
      bookings: Number(row.bookings),
    }))
  }

  // Export report functionality
  async exportReport(
    operatorId: number,
    type: "revenue" | "bookings" | "payments",
    format: "csv" | "pdf",
    startDate?: string,
    endDate?: string,
  ) {
    // For now, return metadata and data structure
    // Actual file generation would be done on frontend or with a library like pdfmake
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), 0, 1)

    let data: any[]

    switch (type) {
      case "revenue":
        data = await this.getRevenueReportData(operatorId, start, end)
        break
      case "bookings":
        data = await this.getBookingsReportData(operatorId, start, end)
        break
      case "payments":
        data = await this.getPaymentsReportData(operatorId, start, end)
        break
    }

    return {
      type,
      format,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      recordCount: data.length,
      data,
      generatedAt: new Date().toISOString(),
    }
  }

  private async getRevenueReportData(operatorId: number, start: Date, end: Date) {
    return this.bookingRepo
      .createQueryBuilder("b")
      .select([
        "TO_CHAR(b.createdAt, 'YYYY-MM-DD') as date",
        "b.id as bookingId",
        "b.pilgrimName as travelerName",
        "b.totalAmount as amount",
        "b.amountPaid as paid",
        "b.status",
      ])
      .where("b.operatorId = :operatorId", { operatorId })
      .andWhere("b.createdAt BETWEEN :start AND :end", { start, end })
      .orderBy("b.createdAt", "DESC")
      .getRawMany()
  }

  private async getBookingsReportData(operatorId: number, start: Date, end: Date) {
    return this.bookingRepo.find({
      where: {
        operatorId,
        createdAt: Between(start, end),
      },
      relations: ["package"],
      order: { createdAt: "DESC" },
    })
  }

  private async getPaymentsReportData(operatorId: number, start: Date, end: Date) {
    return this.transactionRepo.find({
      where: {
        operatorId,
        createdAt: Between(start, end),
      },
      relations: ["booking"],
      order: { createdAt: "DESC" },
    })
  }
}
