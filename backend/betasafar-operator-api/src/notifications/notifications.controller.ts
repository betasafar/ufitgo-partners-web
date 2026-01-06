// src/notifications/notifications.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';

import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { MarkAllReadDto } from './dto/mark-all-read.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Operator Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('operator/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for the operator' })
  @ApiQuery({
    name: 'unread',
    required: false,
    type: String,
    description: 'Set to "true" to get only unread notifications',
    example: 'true',
  })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async getNotifications(
    @CurrentOperator('id') operatorId: number,
    @Query() query: GetNotificationsQueryDto,
  ) {
    const unreadOnly = query.unread === 'true';
    return this.notificationsService.findAllForOperator(operatorId, unreadOnly);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found or not owned' })
  async markAsRead(
    @CurrentOperator('id') operatorId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(id, operatorId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiBody({ type: MarkAllReadDto })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Body() dto: MarkAllReadDto) {
    // Optional: add auth guard to ensure dto.operatorId matches current user
    return this.notificationsService.markAllAsRead(dto.operatorId);
  }

  @Post('broadcast')
  @ApiOperation({
    summary: 'Broadcast a notification to all pilgrims booked in a package',
    description: 'Only the operator who owns the package can broadcast',
  })
  @ApiBody({ type: BroadcastNotificationDto })
  @ApiResponse({ status: 201, description: 'Broadcast sent successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to broadcast for this package' })
  async broadcast(
    @CurrentOperator('id') operatorId: number,
    @Body() dto: BroadcastNotificationDto,
  ) {
    return this.notificationsService.broadcastToPackage(
      operatorId,
      dto.packageId,
      dto.title,
      dto.message,

      // packageId: number, message: string, title = 'Package Update'
    );
  }
}