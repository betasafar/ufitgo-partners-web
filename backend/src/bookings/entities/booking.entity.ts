// src/bookings/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Operator } from '../../operators/entities/operator.entity'; // ← Add this import

export enum BookingStatus {
  PENDING = 'pending',
  DEPOSIT_PAID = 'deposit_paid',
  FULLY_PAID = 'fully_paid',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  pilgrimName: string;

  @Column({ type: 'varchar', length: 100 })
  pilgrimPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pilgrimEmail?: string;

  @Column({ type: 'int' })
  numberOfPilgrims: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amountPaid: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'jsonb', nullable: true })
  paymentDetails?: Record<string, any>;

  // Relations
  @ManyToOne(() => Package, (pkg) => pkg.bookings)
  package?: Package;

  @Column({ type: 'int' })
  packageId: number;

  @ManyToOne(() => Operator, (operator) => operator.bookings) // ← Add this line
  operator?: Operator;

  @Column({ type: 'int' })
  operatorId: number;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
