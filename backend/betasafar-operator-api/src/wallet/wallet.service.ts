import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletTransaction, TransactionType, TransactionStatus } from './entities/wallet-transaction.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransaction)
    private transactionRepo: Repository<WalletTransaction>,
    private dataSource: DataSource,
  ) {}

  // Get current balance (sum of completed credits - debits)
  async getBalance(operatorId: number): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('COALESCE(SUM(CASE WHEN t.type = :credit AND t.status = :completed THEN t.amount ELSE 0 END), 0)', 'credits')
      .addSelect('COALESCE(SUM(CASE WHEN t.type = :debit AND t.status = :completed THEN t.amount ELSE 0 END), 0)', 'debits')
      .where('t.operatorId = :operatorId', { operatorId })
      .setParameters({
        credit: TransactionType.CREDIT,
        debit: TransactionType.DEBIT,
        completed: TransactionStatus.COMPLETED,
      })
      .getRawOne();

    return Number(result.credits) - Number(result.debits);
  }

  // Get transaction history
  async getTransactions(operatorId: number, limit = 50) {
    return this.transactionRepo.find({
      where: { operatorId },
      relations: ['booking'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Create payout request
  async requestPayout(operatorId: number, amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) {
    const balance = await this.getBalance(operatorId);

    if (amount > balance) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    if (amount < 5000) { // minimum payout
      throw new BadRequestException('Minimum payout is ₦5,000');
    }

    const transaction = this.transactionRepo.create({
      operatorId,
      amount,
      type: TransactionType.DEBIT,
      status: TransactionStatus.PENDING,
      description: 'Payout request to bank',
      metadata: { bankDetails, requestedAt: new Date() },
    });

    return this.transactionRepo.save(transaction);
  }

  // Internal: Credit wallet when payment is confirmed (call from Bookings/Payments service)
  async creditFromBooking(bookingId: number, amount: number, description: string) {
    const booking = await this.dataSource.getRepository(Booking).findOne({
      where: { id: bookingId },
      relations: ['operator'],
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const transaction = this.transactionRepo.create({
      operatorId: booking.operatorId,
      bookingId,
      amount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.COMPLETED,
      description,
    });

    return this.transactionRepo.save(transaction);
  }
}
