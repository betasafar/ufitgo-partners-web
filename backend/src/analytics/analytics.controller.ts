import { Controller, Get, BadRequestException, Query } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"

@ApiTags("Operator Reports & Analytics")
@ApiBearerAuth("JWT-auth")
@Controller("operator/reports")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("revenue")
  @ApiOperation({ summary: "Get revenue analytics for the operator" })
  @ApiQuery({ name: "start", type: String, required: false })
  @ApiQuery({ name: "end", type: String, required: false })
  async getRevenue(
    @Query("start") startDate?: string,
    @Query("end") endDate?: string,
  ) {
    const operator = { id: 1 }

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
  async getBookingStats() {
    const operator = { id: 1 }
    return this.analyticsService.getBookingStats(operator.id)
  }

  @Get("popular-packages")
  @ApiQuery({ name: "limit", required: false })
  async getPopularPackages(@Query("limit") limit?: string) {
    const operator = { id: 1 }
    const parsed = limit ? parseInt(limit, 10) : 5
    return this.analyticsService.getPopularPackages(operator.id, parsed)
  }

  @Get("monthly-trend")
  async getMonthlyRevenueTrend() {
    const operator = { id: 1 }
    return this.analyticsService.getMonthlyRevenueTrend(operator.id)
  }

  @Get("dashboard-stats")
  async getDashboardStats() {
    const operator = { id: 1 }
    return this.analyticsService.getDashboardStats(operator.id)
  }

  @Get("revenue-flow")
  @ApiOperation({ summary: "Get revenue flow over time" })
  @ApiQuery({ name: "period", enum: ["daily", "weekly", "monthly"], required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  async getRevenueFlow(
    @Query("period") period?: "daily" | "weekly" | "monthly",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const operator = { id: 1 }
    return this.analyticsService.getRevenueFlow(
      operator.id,
      period || "monthly",
      startDate,
      endDate,
    )
  }

  @Get("export")
  async exportReport(
    @Query("type") type: any,
    @Query("format") format: "csv" | "pdf",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("visaStatus") visaStatus?: string,
    @Query("group") group?: string,
    @Query("includePhotos") includePhotos?: string,
  ) {
    const operator = { id: 1 }

    return this.analyticsService.exportReport(operator.id, type, format, startDate, endDate, {
      visaStatus,
      group,
      includePhotos: includePhotos === "true",
    })
  }
}
