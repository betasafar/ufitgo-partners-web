// src/operators/entities/operator.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { BankAccount } from '../../bank-accounts/entities/bank-account.entity';
import { Notification } from '../../notifications/entities/notification.entity'; // ← ADD THIS
import { WalletTransaction } from '../../wallet/entities/wallet-transaction.entity'; // ← ADD THIS

export enum OperatorVerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  cacNumber?: string;

 @Column()
  passwordHash: string; // → becomes password_hash

  @Column({ name: 'logoUrl', nullable: true  })
  logoUrl?: string; // → stays logoUrl if you used name

  @Column({
    type: 'enum',
    enum: OperatorVerificationStatus,
    default: OperatorVerificationStatus.PENDING,
  })
  verificationStatus: OperatorVerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  documents?: Record<string, string>;



  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Package, (pkg) => pkg.operator)
  packages?: Package[];

  @OneToMany(() => Booking, (booking) => booking.operator)
  bookings?: Booking[];

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.operator)
  bankAccounts?: BankAccount[];

  // ← ADD THIS RELATION
  @OneToMany(() => Notification, (notification) => notification.operator)
  notifications?: Notification[];

  // ← ADD THIS RELATION
  @OneToMany(() => WalletTransaction, (tx) => tx.operator)
  walletTransactions?: WalletTransaction[];
}
