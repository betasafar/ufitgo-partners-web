import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Operator } from "./operator.entity"

export enum DocumentType {
  CAC = "cac",
  LICENSE = "license",
  INSURANCE = "insurance",
  TAX = "tax",
  BANK_STATEMENT = "bank_statement",
  ID_CARD = "id_card",
  OTHER = "other",
}

export enum DocumentStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("operator_documents")
export class OperatorDocument {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "enum",
    enum: DocumentType,
  })
  type: DocumentType

  @Column({ type: "varchar", length: 255 })
  filename: string

  @Column({ type: "varchar", length: 500 })
  url: string

  @Column({
    type: "enum",
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus

  @Column({ type: "text", nullable: true })
  rejectionReason?: string

  @Column({ type: "int", nullable: true })
  reviewedBy?: number

  @Column({ type: "timestamp", nullable: true })
  reviewedAt?: Date

  @ManyToOne(
    () => Operator,
    (operator) => operator.tierDocuments,
  )
  operator: Operator

  @Column()
  operatorId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
