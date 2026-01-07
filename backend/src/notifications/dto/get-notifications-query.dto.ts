// src/notifications/dto/get-notifications-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBooleanString } from 'class-validator';

export class GetNotificationsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter to show only unread notifications',
    example: 'true',
    default: 'false',
  })
  @IsOptional()
  @IsBooleanString()
  unread?: string;
}
