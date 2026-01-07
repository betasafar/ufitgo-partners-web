import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("tier_configurations")
export class TierConfiguration {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  tier: string

  @Column({ default: 0 })
  maxActivePackages: number

  @Column({ default: 0 })
  maxBookingsPerMonth: number

  @Column({ default: 0 })
  maxPilgrimsPerBooking: number

  @Column({ default: false })
  requiresEscrow: boolean

  @Column({ default: false })
  internationalTravelAllowed: boolean

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  escrowPercentage: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
