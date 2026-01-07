import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Operator } from '../../operators/entities/operator.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankCode: string;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  recipientCode?: string;

  @ManyToOne(() => Operator, (operator) => operator.bankAccounts)
  operator: Operator;

  @Column()
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
