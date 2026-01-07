// src/bank-accounts/dto/add-bank-account.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class AddBankAccountDto {
  @ApiProperty({
    description: 'Bank account number (IBAN or local format)',
    example: 'SA4410000001234567890123',
  })
  @IsString()
  @Length(10, 34)  // IBAN length is 15-34 chars, local can be shorter
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Account number must contain only uppercase letters and numbers',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Bank code (e.g., SWIFT/BIC or Saudi bank short code like SABB, ALRAJHI)',
    example: 'ALRAJHI',
  })
  @IsString()
  @Length(3, 12)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Bank code must be uppercase letters and numbers only',
  })
  bankCode: string;
}
