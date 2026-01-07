// src/admin/admin.controller.ts
import { Controller, Get, Patch, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
export class AdminController {
  constructor(private service: AdminService) {}



  @Get('operators/pending')
  @ApiOperation({ summary: 'Get list of operators pending verification' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async pendingOperators() {
    const operators = await this.service.getPendingOperators();
    return {
      success: true,
      message: 'Pending operators fetched successfully',
      data: operators,
    };
  }

  @Patch('operators/:id/verification/:status')
  @ApiOperation({ summary: 'approved | rejected | under_review an operator verification' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async updateVerification(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: 'approved' | 'rejected' | 'under_review',
  ) {
    try {
      const operator = await this.service.updateVerificationStatus(id, status);
      const action = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'set to review';
      return {
        success: true,
        message: `Operator verification ${action} successfully`,
        data: operator,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to update verification status',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('payouts/pending')
  @ApiOperation({ summary: 'Get list of pending payout requests' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async pendingPayouts() {
    const payouts = await this.service.getPendingPayouts();
    return {
      success: true,
      message: 'Pending payouts fetched successfully',
      data: payouts,
    };
  }

  @Patch('payouts/:id/approve')
  @ApiOperation({ summary: 'Approve a pending payout request' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async approvePayout(@Param('id', ParseIntPipe) id: number) {
    try {
      const payout = await this.service.approvePayout(id);
      return {
        success: true,
        message: 'Payout approved and processed successfully',
        data: payout,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to approve payout',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform overview statistics' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async stats() {
    const stats = await this.service.getStats();
    return {
      success: true,
      message: 'Platform statistics fetched successfully',
      data: stats,
    };
  }
}
