// src/admin/dto/payout-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OperatorSummary {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: 'Elite Hajj Travels Ltd' })
  companyName: string;

  @ApiProperty({ example: 'info@elitehajj.com' })
  email: string;
}

export class PayoutRequestDto {
  @ApiProperty({ example: 45 })
  id: number;

  @ApiProperty({ example: 500000 })
  amount: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 'Payout request to bank', required: false })
  description?: string;

  @ApiProperty({ type: OperatorSummary })
  operator: OperatorSummary;

  @ApiProperty({ example: '2026-01-20T14:22:00.000Z' })
  createdAt: Date;
}