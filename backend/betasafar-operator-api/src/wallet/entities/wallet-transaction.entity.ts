import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Operator } from '../../operators/entities/operator.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum TransactionType {
  CREDIT = 'credit',     // Payment received from pilgrim
  DEBIT = 'debit',       // Payout to operator
  REFUND = 'refund',     // Refund to pilgrim
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // e.g., paystack ref, payout bank info

  @ManyToOne(() => Operator, (operator) => operator.walletTransactions)
  operator: Operator;

  @Column()
  operatorId: number;

  @ManyToOne(() => Booking, { nullable: true })
  booking?: Booking;

  @Column({ nullable: true })
  bookingId?: number;

  @CreateDateColumn()
  createdAt: Date;
}
