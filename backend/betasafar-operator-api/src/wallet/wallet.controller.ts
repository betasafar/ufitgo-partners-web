import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletTransactionDto } from '../common/dto/wallet-transaction.dto';

@ApiTags('Operator Wallet')
@ApiBearerAuth('JWT-auth')
@Controller('operator/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet balance and recent transactions' })
  @ApiResponse({ status: 200, description: 'Balance and transaction list' })
  async getWallet(@CurrentOperator() operator: { id: number }) {
    const balance = await this.walletService.getBalance(operator.id);
    const transactions = await this.walletService.getTransactions(operator.id, 20);

    return {
      balance,
      availableBalance: balance,
      transactions,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get full transaction history' })
  @ApiResponse({ status: 200, type: [WalletTransactionDto] })
  async getTransactions(@CurrentOperator() operator: { id: number }) {
    return this.walletService.getTransactions(operator.id);
  }

  @Post('payout')
  @ApiOperation({ summary: 'Request payout to bank' })
  @ApiResponse({ status: 201, description: 'Payout request submitted' })
  async requestPayout(
    @CurrentOperator() operator: { id: number },
    @Body() dto: any,
  ) {
    return this.walletService.requestPayout(operator.id, dto.amount, dto.bankDetails);
  }
}
