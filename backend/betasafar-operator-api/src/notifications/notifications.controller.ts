// src/notifications/notifications.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from "@nestjs/common"
import type { NotificationsService } from "./notifications.service"
import type { GetNotificationsQueryDto } from "./dto/get-notifications-query.dto"
import { MarkAllReadDto } from "./dto/mark-all-read.dto"
import { BroadcastNotificationDto } from "./dto/broadcast-notification.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from "@nestjs/swagger"

@ApiTags("Operator Notifications")
@ApiBearerAuth("JWT-auth")
@Controller("operator/notifications")
export class NotificationsController {
  private readonly operatorId: number

  constructor(private readonly notificationsService: NotificationsService) {
    // Assuming CurrentOperator decorator is used to inject operatorId
    // For demonstration, let's assume operatorId is set to 1
    this.operatorId = 1
  }

  @Get()
  @ApiOperation({ summary: "Get notifications for the operator" })
  @ApiResponse({ status: 200, description: "List of notifications" })
  async getNotifications(
    @Query() query: GetNotificationsQueryDto,
  ) {
    const unreadOnly = query.unread === "true"
    return this.notificationsService.findAllForOperator(this.operatorId, unreadOnly)
  }

  @Post(":id/read")
  @ApiOperation({ summary: "Mark a single notification as read" })
  @ApiResponse({ status: 200, description: "Notification marked as read" })
  @ApiResponse({ status: 404, description: "Notification not found or not owned" })
  async markAsRead(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(id, this.operatorId)
  }

  @Post("read-all")
  @ApiOperation({ summary: "Mark all notifications as read" })
  @ApiBody({ type: MarkAllReadDto })
  @ApiResponse({ status: 200, description: "All notifications marked as read" })
  async markAllAsRead(@Body() dto: MarkAllReadDto) {
    return this.notificationsService.markAllAsRead(dto.operatorId)
  }

  @Post("broadcast")
  @ApiOperation({
    summary: "Broadcast a notification to all pilgrims booked in a package",
    description: "Only the operator who owns the package can broadcast",
  })
  @ApiBody({ type: BroadcastNotificationDto })
  @ApiResponse({ status: 201, description: "Broadcast sent successfully" })
  @ApiResponse({ status: 403, description: "Not authorized to broadcast for this package" })
  async broadcast(
    @Body() dto: BroadcastNotificationDto,
  ) {
    return this.notificationsService.broadcastToPackage(this.operatorId, dto.packageId, dto.title, dto.message)
  }

  @Get("communications-history")
  @ApiOperation({ summary: "Get communications history with filtering" })
  @ApiQuery({ name: "channel", enum: ["email", "sms", "whatsapp", "push"], required: false })
  @ApiQuery({ name: "status", enum: ["sent", "delivered", "failed", "read"], required: false })
  @ApiQuery({ name: "startDate", type: String, required: false })
  @ApiQuery({ name: "endDate", type: String, required: false })
  @ApiResponse({ status: 200, description: "Communications history returned" })
  async getCommunicationsHistory(
    @Query("channel") channel?: "email" | "sms" | "whatsapp" | "push",
    @Query("status") status?: "sent" | "delivered" | "failed" | "read",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.notificationsService.getCommunicationsHistory(this.operatorId, channel, status, startDate, endDate)
  }

  @Post("send")
  @ApiOperation({ summary: "Send communication to travelers" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        recipientId: { type: "number", nullable: true },
        recipientType: { type: "string", enum: ["individual", "package", "all"] },
        packageId: { type: "number", nullable: true },
        channel: { type: "string", enum: ["email", "sms", "whatsapp", "push"] },
        subject: { type: "string" },
        message: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Communication sent successfully" })
  async sendCommunication(
    @Body()
    payload: {
      recipientId?: number
      recipientType: "individual" | "package" | "all"
      packageId?: number
      channel: "email" | "sms" | "whatsapp" | "push"
      subject: string
      message: string
    },
  ) {
    return this.notificationsService.sendCommunication(this.operatorId, payload)
  }
}
