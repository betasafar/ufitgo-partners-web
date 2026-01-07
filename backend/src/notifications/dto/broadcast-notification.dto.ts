// src/notifications/dto/broadcast-notification.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Length } from 'class-validator';

export class BroadcastNotificationDto {
  @ApiProperty({ description: 'Package ID to broadcast to all booked pilgrims', example: 5 })
  @IsInt()
  @Min(1)
  packageId: number;

  @ApiProperty({ description: 'Notification title', example: 'Important Update' })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({ description: 'Notification message body', example: 'Your departure date has changed...' })
  @IsString()
  @Length(5, 1000)
  message: string;
}
