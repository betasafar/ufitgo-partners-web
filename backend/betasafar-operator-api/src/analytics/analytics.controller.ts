// src/reports/analytics.controller.ts (or wherever it is)
import { Controller, Get, Query, ParseIntPipe, BadRequestException } from "@nestjs/common"
import type { AnalyticsService } from "./analytics.service"
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"

@ApiTags("Operator Reports & Analytics")
@ApiBearerAuth("JWT-auth")
@Controller("operator/reports")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("revenue")
  @ApiOperation({ summary: "Get revenue analytics for the operator" })
  @ApiQuery({ name: "start", type: String, required: false, example: "2026-01-01" })
  @ApiQuery({ name: "end", type: String, required: false, example: "2026-01-31" })
  @ApiResponse({ status: 200, description: "Revenue data returned" })
  @ApiResponse({ status: 400, description: "Invalid date format" })
  async getRevenue(operator: { id: number }, @Query("start") startDate?: string, @Query("end") endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined

    if (startDate && isNaN(start!.getTime())) {
      throw new BadRequestException("Invalid start date format. Use YYYY-MM-DD")
    }
    if (endDate && isNaN(end!.getTime())) {
      throw new BadRequestException("Invalid end date format. Use YYYY-MM-DD")
    }

    return this.analyticsService.getRevenue(operator.id, start, end)
  }

  @Get("bookings")
  @ApiOperation({ summary: "Get booking statistics for the operator" })
  @ApiResponse({ status: 200, description: "Booking stats returned" })
  async getBookingStats(operator: { id: number }) {
    return this.analyticsService.getBookingStats(operator.id)
  }

  @Get("popular-packages")
  @ApiOperation({ summary: "Get most popular packages for the operator" })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Number of packages to return (1-20)",
    example: 5,
  })
  @ApiResponse({ status: 200, description: "Popular packages returned" })
  async getPopularPackages(operator: { id: number }, @Query("limit", new ParseIntPipe({ optional: true })) limit = 5) {
    return this.analyticsService.getPopularPackages(operator.id, limit)
  }

  @Get("monthly-trend")
  @ApiOperation({ summary: "Get monthly revenue trend for the operator" })
  @ApiResponse({ status: 200, description: "Monthly trend data returned" })
  async getMonthlyRevenueTrend(operator: { id: number }) {
    return this.analyticsService.getMonthlyRevenueTrend(operator.id)
  }

  @Get("dashboard-stats")
  @ApiOperation({ summary: "Get comprehensive dashboard statistics" })
  @ApiResponse({ status: 200, description: "Dashboard stats returned" })
  async getDashboardStats(operator: { id: number }) {
    return this.analyticsService.getDashboardStats(operator.id)
  }

  @Get("revenue-flow")
  @ApiOperation({ summary: "Get revenue flow over time" })
  @ApiQuery({ name: "period", enum: ["daily", "weekly", "monthly"], required: false })
  @ApiQuery({ name: "startDate", type: String, required: false })
  @ApiQuery({ name: "endDate", type: String, required: false })
  @ApiResponse({ status: 200, description: "Revenue flow data returned" })
  async getRevenueFlow(
    operator: { id: number },
    @Query("period") period: "daily" | "weekly" | "monthly" = "monthly",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.analyticsService.getRevenueFlow(operator.id, period, startDate, endDate)
  }

  @Get("export")
  @ApiOperation({ summary: "Export reports in CSV or PDF format" })
  @ApiQuery({ name: "type", enum: ["revenue", "bookings", "payments"], required: true })
  @ApiQuery({ name: "format", enum: ["csv", "pdf"], required: true })
  @ApiQuery({ name: "startDate", type: String, required: false })
  @ApiQuery({ name: "endDate", type: String, required: false })
  @ApiResponse({ status: 200, description: "Report data returned" })
  async exportReport(
    operator: { id: number },
    @Query("type") type: "revenue" | "bookings" | "payments",
    @Query("format") format: "csv" | "pdf",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.analyticsService.exportReport(operator.id, type, format, startDate, endDate)
  }
}
