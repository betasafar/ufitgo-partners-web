// src/packages/entities/package.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Operator } from "../../operators/entities/operator.entity"
import { Booking } from "../../bookings/entities/booking.entity"

export enum PackageType {
  HAJJ = "hajj",
  UMRAH = "umrah",
  TOUR = "tour",
  LEISURE = "leisure",
}

export enum PackageStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

@Entity("packages")
export class Package {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  title: string

  @Column({ type: "text" })
  description: string

  @Column({
    type: "enum",
    enum: PackageType,
    default: PackageType.UMRAH,
  })
  type: PackageType

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number

  @Column({ type: "int" })
  duration: number // in days

  @Column({ type: "int" })
  capacity: number

  @Column({ type: "int", default: 0 })
  booked: number

  @Column({
    type: "enum",
    enum: PackageStatus,
    default: PackageStatus.ACTIVE,
  })
  status: PackageStatus

  @Column({ type: "jsonb", nullable: true })
  inclusions?: string[]

  @Column({ type: "jsonb", nullable: true })
  images?: string[]

  @Column({ type: "date", nullable: true })
  departureDate?: Date

  @Column({ type: "date", nullable: true })
  returnDate?: Date

  @ManyToOne(
    () => Operator,
    (operator) => operator.packages,
  )
  operator: Operator

  @Column()
  operatorId: number

  @OneToMany(
    () => Booking,
    (booking) => booking.package,
  )
  bookings: Booking[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
