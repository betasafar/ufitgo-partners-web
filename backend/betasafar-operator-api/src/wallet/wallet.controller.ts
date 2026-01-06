import { Controller, Get, Post, Body, Query, ParseIntPipe } from "@nestjs/common"
import type { WalletService } from "./wallet.service"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { WalletTransactionDto } from "../common/dto/wallet-transaction.dto"

@ApiTags("Operator Wallet")
@ApiBearerAuth("JWT-auth")
@Controller("operator/wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  async getWallet(operator: { id: number }) {
    const balance = await this.walletService.getBalance(operator.id)
    const transactions = await this.walletService.getTransactions(operator.id, 20)

    return {
      balance,
      availableBalance: balance,
      transactions,
    }
  }

  @Get("transactions")
  @ApiOperation({ summary: "Get full transaction history" })
  @ApiResponse({ status: 200, type: [WalletTransactionDto] })
  async getTransactions(operator: { id: number }) {
    return this.walletService.getTransactions(operator.id)
  }

  @Post("payout")
  @ApiOperation({ summary: "Request payout to bank" })
  @ApiResponse({ status: 201, description: "Payout request submitted" })
  async requestPayout(operator: { id: number }, @Body() dto: any) {
    return this.walletService.requestPayout(operator.id, dto.amount, dto.bankDetails)
  }

  @Get("payment-stats")
  @ApiOperation({ summary: "Get payment statistics" })
  @ApiResponse({ status: 200, description: "Payment statistics returned" })
  async getPaymentStats(operator: { id: number }) {
    return this.walletService.getPaymentStats(operator.id)
  }

  @Get("transactions/filtered")
  @ApiOperation({ summary: "Get filtered transaction history" })
  @ApiQuery({ name: "limit", type: Number, required: false, example: 50 })
  @ApiQuery({ name: "type", enum: ["credit", "debit"], required: false })
  @ApiQuery({ name: "status", enum: ["pending", "completed", "failed"], required: false })
  @ApiQuery({ name: "startDate", type: String, required: false })
  @ApiQuery({ name: "endDate", type: String, required: false })
  @ApiResponse({ status: 200, type: [WalletTransactionDto] })
  async getFilteredTransactions(
    operator: { id: number },
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 50,
    @Query("type") type?: "credit" | "debit",
    @Query("status") status?: "pending" | "completed" | "failed",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.walletService.getTransactionsFiltered(operator.id, limit, type, status, startDate, endDate)
  }
}
