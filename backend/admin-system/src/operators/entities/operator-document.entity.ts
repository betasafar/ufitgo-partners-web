import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Operator } from "../../admin/entities/operator.entity"

@Entity("operator_documents")
export class OperatorDocument {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  operatorId: number

  @Column()
  documentType: string

  @Column()
  fileUrl: string

  @Column({ nullable: true })
  fileName: string

  @Column({ nullable: true })
  fileSize: number

  @Column({ default: "pending" })
  verificationStatus: string

  @Column({ nullable: true })
  rejectionReason: string

  @CreateDateColumn()
  uploadedAt: Date

  @Column({ nullable: true })
  verifiedAt: Date

  @ManyToOne(() => Operator, { onDelete: "CASCADE" })
  @JoinColumn({ name: "operatorId" })
  operator: Operator
}
