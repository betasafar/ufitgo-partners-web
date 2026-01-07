import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Package } from "../../packages/entities/package.entity"
import { Booking } from "../../bookings/entities/booking.entity"
import { BankAccount } from "../../bank-accounts/entities/bank-account.entity"
import { Notification } from "../../notifications/entities/notification.entity"
import { WalletTransaction } from "../../wallet/entities/wallet-transaction.entity"
import { OperatorDocument } from "./operator-document.entity"
import { OperatorBadge } from "./operator-badge.entity"

export enum OperatorVerificationStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum OperatorTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
}

@Entity("operators")
export class Operator {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column()
  companyName: string

  @Column({ nullable: true })
  cacNumber?: string

  @Column()
  passwordHash: string

  @Column({ name: "logoUrl", nullable: true })
  logoUrl?: string

  @Column({
    type: "enum",
    enum: OperatorVerificationStatus,
    default: OperatorVerificationStatus.PENDING,
  })
  verificationStatus: OperatorVerificationStatus

  @Column({ type: "jsonb", nullable: true })
  documents?: Record<string, string>

  @Column({
    type: "enum",
    enum: OperatorTier,
    default: OperatorTier.BRONZE,
  })
  tier: OperatorTier

  @Column({ type: "int", default: 50 })
  trustScore: number

  @Column({ type: "int", default: 0 })
  totalBookings: number

  @Column({ type: "int", default: 0 })
  successfulBookings: number

  @Column({ type: "int", default: 0 })
  cancelledBookings: number

  @Column({ type: "int", default: 0 })
  monthlyBookingsCount: number

  @Column({ type: "int", default: 0 })
  activePackagesCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @OneToMany(
    () => Package,
    (pkg) => pkg.operator,
  )
  packages?: Package[]

  @OneToMany(
    () => Booking,
    (booking) => booking.operator,
  )
  bookings?: Booking[]

  @OneToMany(
    () => BankAccount,
    (bankAccount) => bankAccount.operator,
  )
  bankAccounts?: BankAccount[]

  @OneToMany(
    () => Notification,
    (notification) => notification.operator,
  )
  notifications?: Notification[]

  @OneToMany(
    () => WalletTransaction,
    (tx) => tx.operator,
  )
  walletTransactions?: WalletTransaction[]

  @OneToMany(
    () => OperatorDocument,
    (doc) => doc.operator,
  )
  tierDocuments?: OperatorDocument[]

  @OneToMany(
    () => OperatorBadge,
    (badge) => badge.operator,
  )
  badges?: OperatorBadge[]
}
