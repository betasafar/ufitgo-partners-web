// src/bank-accounts/bank-account.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';
import { AddBankAccountDto } from './dto/add-bank-account.dto';
import { BankAccountResponseDto } from './dto/bank-account-response.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Operator Bank Account')
@ApiBearerAuth('JWT-auth')
@Controller('operator/bank-account')
export class BankAccountController {
  constructor(private readonly service: BankAccountService) {}

  @Post()
  @ApiOperation({ summary: 'Add and verify bank account for operator payouts' })
  @ApiBody({
    type: AddBankAccountDto,
    examples: {
      nigeria: {
        summary: 'Nigerian Bank Account (GTBank)',
        value: {
          bankName: 'Guaranty Trust Bank',
          accountName: 'Elite Hajj Travels Ltd',
          accountNumber: '0123456789',
          bankCode: '058', // GTBank code
        },
      },
      international: {
        summary: 'International Bank (IBAN)',
        value: {
          bankName: 'HSBC UK',
          accountName: 'Elite Hajj Travels Ltd',
          iban: 'GB29NWBK60161331926819',
          swiftCode: 'HBUKGB4B',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Bank account added and verified successfully',
    type: BankAccountResponseDto,
    example: {
      success: true,
      message: 'Bank account verified and saved successfully',
      data: {
        id: 1,
        bankName: 'Guaranty Trust Bank',
        accountName: 'Elite Hajj Travels Ltd',
        accountNumber: '0123456789',
        bankCode: '058',
        isVerified: true,
        createdAt: '2026-01-06T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input or account already exists' })
  @ApiResponse({ status: 422, description: 'Bank verification failed' })
  async addAndVerify(
    @CurrentOperator() operator: { id: number },
    @Body() dto: AddBankAccountDto,
  ) {
    return this.service.addAndVerify(operator.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get operator\'s verified bank account' })
  @ApiResponse({
    status: 200,
    description: 'Verified bank account returned',
    type: BankAccountResponseDto,
    example: {
      success: true,
      message: 'Verified bank account retrieved',
      data: {
        id: 1,
        bankName: 'Guaranty Trust Bank',
        accountName: 'Elite Hajj Travels Ltd',
        accountNumber: '0123456789',
        bankCode: '058',
        isVerified: true,
        createdAt: '2026-01-06T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No verified bank account found' })
  async get(@CurrentOperator() operator: { id: number }) {
    return this.service.getVerifiedAccount(operator.id);
  }
}