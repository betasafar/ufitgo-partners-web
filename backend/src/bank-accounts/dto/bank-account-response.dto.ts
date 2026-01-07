// src/bank-accounts/dto/bank-account-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BankAccountResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty()
  bankCode: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  verifiedAt: Date | null;

  @ApiProperty()
  operatorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
