import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("tier_configurations")
export class TierConfiguration {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 50, unique: true })
  tier: string

  @Column({ type: "int" })
  maxBookingsPerMonth: number

  @Column({ type: "int" })
  maxActivePackages: number

  @Column({ type: "int" })
  maxPilgrimsPerBooking: number

  @Column({ type: "boolean", default: false })
  requiresEscrow: boolean

  @Column({ type: "boolean", default: false })
  canCustomizePackages: boolean

  @Column({ type: "boolean", default: false })
  prioritySupport: boolean

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
