// src/notifications/notifications.service.ts
import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Notification, NotificationType } from "./entities/notification.entity"

@Injectable()
export class NotificationsService {
  constructor(private notificationRepo: Repository<Notification>) {}

  async create(createData: {
    operatorId: number
    title: string
    message: string
    type?: NotificationType // ← Change to enum type
    data?: Record<string, any>
  }) {
    const notification = this.notificationRepo.create({
      operatorId: createData.operatorId,
      title: createData.title,
      message: createData.message,
      type: createData.type || NotificationType.SYSTEM, // ← Use enum value
      data: createData.data,
      isRead: false,
    })

    return this.notificationRepo.save(notification)
  }

  async findAllForOperator(operatorId: number, unreadOnly = false) {
    const qb = this.notificationRepo
      .createQueryBuilder("n")
      .where("n.operatorId = :operatorId", { operatorId })
      .orderBy("n.createdAt", "DESC")

    if (unreadOnly) {
      qb.andWhere("n.isRead = false")
    }

    return qb.getMany()
  }

  async markAsRead(id: number, operatorId: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id, operatorId },
    })

    if (!notification) {
      throw new Error("Notification not found")
    }

    notification.isRead = true
    return this.notificationRepo.save(notification)
  }

  async markAllAsRead(operatorId: number) {
    await this.notificationRepo.update({ operatorId, isRead: false }, { isRead: true })
    return { message: "All notifications marked as read" }
  }

  async broadcastToPackage(operatorId: number, packageId: number, title: string, message: string) {
    // TODO: Implement real broadcast logic + package ownership check
    // Example: verify operator owns the package before broadcasting

    // Placeholder response
    return {
      message: "Broadcast feature coming soon",
      packageId,
      title,
      recipientCount: 0, // placeholder
    }
  }

  async getCommunicationsHistory(
    operatorId: number,
    channel?: "email" | "sms" | "whatsapp" | "push",
    status?: "sent" | "delivered" | "failed" | "read",
    startDate?: string,
    endDate?: string,
  ) {
    const qb = this.notificationRepo
      .createQueryBuilder("n")
      .where("n.operatorId = :operatorId", { operatorId })
      .orderBy("n.createdAt", "DESC")

    // Filter by channel if provided (stored in metadata)
    if (channel) {
      qb.andWhere("n.data->>'channel' = :channel", { channel })
    }

    // Filter by status
    if (status) {
      if (status === "read") {
        qb.andWhere("n.isRead = true")
      } else {
        qb.andWhere("n.data->>'status' = :status", { status })
      }
    }

    // Date range filters
    if (startDate) {
      qb.andWhere("n.createdAt >= :startDate", { startDate: new Date(startDate) })
    }

    if (endDate) {
      qb.andWhere("n.createdAt <= :endDate", { endDate: new Date(endDate) })
    }

    const notifications = await qb.getMany()

    // Get summary stats
    const totalSent = notifications.length
    const delivered = notifications.filter((n) => n.data?.status === "delivered").length
    const failed = notifications.filter((n) => n.data?.status === "failed").length
    const readCount = notifications.filter((n) => n.isRead).length

    return {
      notifications,
      stats: {
        totalSent,
        delivered,
        failed,
        read: readCount,
        deliveryRate: totalSent > 0 ? ((delivered / totalSent) * 100).toFixed(1) : "0",
      },
    }
  }

  async sendCommunication(
    operatorId: number,
    payload: {
      recipientId?: number
      recipientType: "individual" | "package" | "all"
      packageId?: number
      channel: "email" | "sms" | "whatsapp" | "push"
      subject: string
      message: string
    },
  ) {
    // Create notification record
    const notification = await this.create({
      operatorId,
      title: payload.subject,
      message: payload.message,
      type: NotificationType.SYSTEM,
      data: {
        channel: payload.channel,
        recipientType: payload.recipientType,
        recipientId: payload.recipientId,
        packageId: payload.packageId,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
    })

    // In a real implementation, integrate with email/SMS/WhatsApp services
    // For now, just return success with mock delivery data
    let recipientCount = 0

    switch (payload.recipientType) {
      case "individual":
        recipientCount = 1
        break
      case "package":
        // Count bookings for the package
        recipientCount = 10 // Mock value
        break
      case "all":
        // Count all active travelers
        recipientCount = 50 // Mock value
        break
    }

    return {
      success: true,
      notificationId: notification.id,
      channel: payload.channel,
      recipientCount,
      status: "sent",
      message: `Communication sent successfully via ${payload.channel} to ${recipientCount} recipient(s)`,
    }
  }
}
