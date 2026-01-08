import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { Operator } from "./operator.entity"

@Entity("operator_badges")
export class OperatorBadge {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100 })
  badgeType: string

  @Column({ type: "varchar", length: 255 })
  title: string

  @Column({ type: "text" })
  description: string

  @Column({ type: "varchar", length: 50, nullable: true })
  icon?: string

  @ManyToOne(
    () => Operator,
    (operator) => operator.badges,
  )
  operator: Operator

  @Column()
  operatorId: number

  @CreateDateColumn()
  awardedAt: Date
}
