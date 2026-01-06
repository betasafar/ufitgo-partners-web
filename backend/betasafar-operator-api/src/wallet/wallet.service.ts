import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { WalletTransaction, TransactionType, TransactionStatus } from "./entities/wallet-transaction.entity"
import { Booking } from "../bookings/entities/booking.entity"

@Injectable()
export class WalletService {
  private transactionRepo: Repository<WalletTransaction>
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
    this.transactionRepo = dataSource.getRepository(WalletTransaction)
  }

  // Get current balance (sum of completed credits - debits)
  async getBalance(operatorId: number): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder("t")
      .select(
        "COALESCE(SUM(CASE WHEN t.type = :credit AND t.status = :completed THEN t.amount ELSE 0 END), 0)",
        "credits",
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN t.type = :debit AND t.status = :completed THEN t.amount ELSE 0 END), 0)",
        "debits",
      )
      .where("t.operatorId = :operatorId", { operatorId })
      .setParameters({
        credit: TransactionType.CREDIT,
        debit: TransactionType.DEBIT,
        completed: TransactionStatus.COMPLETED,
      })
      .getRawOne()

    return Number(result.credits) - Number(result.debits)
  }

  // Get transaction history
  async getTransactions(operatorId: number, limit = 50) {
    return this.transactionRepo.find({
      where: { operatorId },
      relations: ["booking"],
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  // Create payout request
  async requestPayout(
    operatorId: number,
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName: string },
  ) {
    const balance = await this.getBalance(operatorId)

    if (amount > balance) {
      throw new BadRequestException("Insufficient wallet balance")
    }

    if (amount < 5000) {
      // minimum payout
      throw new BadRequestException("Minimum payout is ₦5,000")
    }

    const transaction = this.transactionRepo.create({
      operatorId,
      amount,
      type: TransactionType.DEBIT,
      status: TransactionStatus.PENDING,
      description: "Payout request to bank",
      metadata: { bankDetails, requestedAt: new Date() },
    })

    return this.transactionRepo.save(transaction)
  }

  // Internal: Credit wallet when payment is confirmed (call from Bookings/Payments service)
  async creditFromBooking(bookingId: number, amount: number, description: string) {
    const booking = await this.dataSource.getRepository(Booking).findOne({
      where: { id: bookingId },
      relations: ["operator"],
    })

    if (!booking) throw new NotFoundException("Booking not found")

    const transaction = this.transactionRepo.create({
      operatorId: booking.operatorId,
      bookingId,
      amount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.COMPLETED,
      description,
    })

    return this.transactionRepo.save(transaction)
  }

  async getPaymentStats(operatorId: number) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total collected this month
    const monthlyCollected = await this.transactionRepo
      .createQueryBuilder("t")
      .select("COALESCE(SUM(t.amount), 0)", "total")
      .where("t.operatorId = :operatorId", { operatorId })
      .andWhere("t.type = :credit", { credit: TransactionType.CREDIT })
      .andWhere("t.status = :completed", { completed: TransactionStatus.COMPLETED })
      .andWhere("t.createdAt >= :start", { start: startOfMonth })
      .getRawOne()

    // Pending withdrawals
    const pendingWithdrawals = await this.transactionRepo
      .createQueryBuilder("t")
      .select("COALESCE(SUM(t.amount), 0)", "total")
      .where("t.operatorId = :operatorId", { operatorId })
      .andWhere("t.type = :debit", { debit: TransactionType.DEBIT })
      .andWhere("t.status = :pending", { pending: TransactionStatus.PENDING })
      .getRawOne()

    // Total transactions count
    const totalTransactions = await this.transactionRepo.count({
      where: { operatorId },
    })

    // Average transaction value
    const avgTransaction = await this.transactionRepo
      .createQueryBuilder("t")
      .select("COALESCE(AVG(t.amount), 0)", "average")
      .where("t.operatorId = :operatorId", { operatorId })
      .andWhere("t.type = :credit", { credit: TransactionType.CREDIT })
      .andWhere("t.status = :completed", { completed: TransactionStatus.COMPLETED })
      .getRawOne()

    return {
      monthlyCollected: Number(monthlyCollected.total),
      pendingWithdrawals: Number(pendingWithdrawals.total),
      totalTransactions,
      averageTransaction: Math.round(Number(avgTransaction.average)),
    }
  }

  async getTransactionsFiltered(
    operatorId: number,
    limit: number,
    type?: "credit" | "debit",
    status?: "pending" | "completed" | "failed",
    startDate?: string,
    endDate?: string,
  ) {
    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .where("t.operatorId = :operatorId", { operatorId })
      .leftJoinAndSelect("t.booking", "booking")
      .orderBy("t.createdAt", "DESC")
      .take(limit)

    if (type) {
      qb.andWhere("t.type = :type", { type: type.toUpperCase() })
    }

    if (status) {
      qb.andWhere("t.status = :status", { status: status.toUpperCase() })
    }

    if (startDate) {
      qb.andWhere("t.createdAt >= :startDate", { startDate: new Date(startDate) })
    }

    if (endDate) {
      qb.andWhere("t.createdAt <= :endDate", { endDate: new Date(endDate) })
    }

    return qb.getMany()
  }
}
