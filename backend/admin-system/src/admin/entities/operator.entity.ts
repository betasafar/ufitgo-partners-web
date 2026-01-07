import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OperatorVerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('operators') // Same table name as operator app
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  cacNumber?: string;

  @Column({
    type: 'enum',
    enum: OperatorVerificationStatus,
    default: OperatorVerificationStatus.PENDING,
  })
  verificationStatus: OperatorVerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  documents?: Record<string, string>;

  @Column({ nullable: true })
  logoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
