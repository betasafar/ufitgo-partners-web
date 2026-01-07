// betasafar-operator-nestjs/src/common/dto/wallet-transaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class WalletTransactionDto {
  @ApiProperty({ example: 78 })
  id: number;

  @ApiProperty({ example: 500000 })
  amount: number;

  @ApiProperty({ example: 'credit', enum: ['credit', 'debit', 'refund'] })
  type: string;

  @ApiProperty({ example: 'completed', enum: ['pending', 'completed', 'failed'] })
  status: string;

  @ApiProperty({ example: 'Payment for booking #456' })
  description?: string;

  @ApiProperty({ example: '2026-01-20T14:22:00.000Z' })
  createdAt: Date;
}
