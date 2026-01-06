// src/reports/analytics.controller.ts (or wherever it is)
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,  // ← Add this
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Operator Reports & Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('operator/reports')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics for the operator' })
  @ApiQuery({ name: 'start', type: String, required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'end', type: String, required: false, example: '2026-01-31' })
  @ApiResponse({ status: 200, description: 'Revenue data returned' })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getRevenue(
    @CurrentOperator() operator: { id: number },
    @Query('start') startDate?: string,
    @Query('end') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    if (startDate && isNaN(start!.getTime())) {
      throw new BadRequestException('Invalid start date format. Use YYYY-MM-DD');
    }
    if (endDate && isNaN(end!.getTime())) {
      throw new BadRequestException('Invalid end date format. Use YYYY-MM-DD');
    }

    return this.analyticsService.getRevenue(operator.id, start, end);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get booking statistics for the operator' })
  @ApiQuery({ name: 'operatorId', type: Number, description: 'Operator ID' })
  @ApiResponse({ status: 200, description: 'Booking stats returned' })
  async getBookingStats(@CurrentOperator() operator: { id: number }) {
    return this.analyticsService.getBookingStats(operator.id);
  }

  @Get('popular-packages')
  @ApiOperation({ summary: 'Get most popular packages for the operator' })
  @ApiQuery({ name: 'operatorId', type: Number, description: 'Operator ID' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of packages to return (1-20)',
    example: 5,
  })
  @ApiResponse({ status: 200, description: 'Popular packages returned' })
  async getPopularPackages(
    @CurrentOperator() operator: { id: number },
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 5,
  ) {
    return this.analyticsService.getPopularPackages(operator.id, limit);
  }

  @Get('monthly-trend')
  @ApiOperation({ summary: 'Get monthly revenue trend for the operator' })
  @ApiQuery({ name: 'operatorId', type: Number, description: 'Operator ID' })
  @ApiResponse({ status: 200, description: 'Monthly trend data returned' })
  async getMonthlyRevenueTrend(@CurrentOperator() operator: { id: number }) {
    return this.analyticsService.getMonthlyRevenueTrend(operator.id);
  }
}