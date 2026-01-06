import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Operator } from '../../operators/entities/operator.entity';

export enum NotificationType {
  BOOKING_NEW = 'booking_new',
  BOOKING_UPDATE = 'booking_update',
  PAYMENT_RECEIVED = 'payment_received',
  VERIFICATION_UPDATE = 'verification_update',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({ default: false }) 
  isRead: boolean;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>; // e.g., { bookingId: 123 }

  @ManyToOne(() => Operator, (operator) => operator.notifications)
  operator: Operator;

  @Column()
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;
}
