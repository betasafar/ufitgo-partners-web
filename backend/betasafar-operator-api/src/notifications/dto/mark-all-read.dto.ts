// src/notifications/dto/mark-all-read.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MarkAllReadDto {
  @ApiProperty({ description: 'Operator ID', example: 1 })
  @IsInt()
  @Min(1)
  operatorId: number;
}