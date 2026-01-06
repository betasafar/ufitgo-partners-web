// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(createData: {
    operatorId: number;
    title: string;
    message: string;
    type?: NotificationType;  // ← Change to enum type
    data?: Record<string, any>;
  }) {
    const notification = this.notificationRepo.create({
      operatorId: createData.operatorId,
      title: createData.title,
      message: createData.message,
      type: createData.type || NotificationType.SYSTEM,  // ← Use enum value
      data: createData.data,
      isRead: false,
    });

    return this.notificationRepo.save(notification);
  }

  async findAllForOperator(operatorId: number, unreadOnly = false) {
    const qb = this.notificationRepo.createQueryBuilder('n')
      .where('n.operatorId = :operatorId', { operatorId })
      .orderBy('n.createdAt', 'DESC');

    if (unreadOnly) {
      qb.andWhere('n.isRead = false');
    }

    return qb.getMany();
  }

  async markAsRead(id: number, operatorId: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id, operatorId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(operatorId: number) {
    await this.notificationRepo.update(
      { operatorId, isRead: false },
      { isRead: true },
    );
    return { message: 'All notifications marked as read' };
  }

  async broadcastToPackage(
    operatorId: number,
    packageId: number,
    title: string,
    message: string,
  ) {
    // TODO: Implement real broadcast logic + package ownership check
    // Example: verify operator owns the package before broadcasting

    // Placeholder response
    return { 
      message: 'Broadcast feature coming soon',
      packageId,
      title,
      recipientCount: 0 // placeholder
    };
  };
}
