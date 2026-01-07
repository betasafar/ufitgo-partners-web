import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Operator } from "../../admin/entities/operator.entity"

@Entity("operator_badges")
export class OperatorBadge {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  operatorId: number

  @Column()
  badgeType: string

  @Column()
  displayName: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  icon: string

  @CreateDateColumn()
  awardedAt: Date

  @ManyToOne(() => Operator, { onDelete: "CASCADE" })
  @JoinColumn({ name: "operatorId" })
  operator: Operator
}
