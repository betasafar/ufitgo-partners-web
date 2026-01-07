// src/operators/controllers/metrics.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import type { TierRestrictionService } from "../services/tier-restriction.service"
import type { OperatorsService } from "../operators.service"

@ApiTags("Operator Metrics")
@ApiBearerAuth("JWT-auth")
@Controller("operator/metrics")
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(
    private readonly tierRestrictionService: TierRestrictionService,
    private readonly operatorsService: OperatorsService,
  ) {}

  @Get("trust-score")
  @ApiOperation({ summary: "Get current trust score and breakdown" })
  @ApiResponse({ status: 200, description: "Trust score retrieved successfully" })
  async getTrustScore(operatorId: number) {
    const operator = await this.operatorsService.findOne(operatorId)

    return {
      success: true,
      message: "Trust score retrieved successfully",
      data: {
        currentScore: operator.trustScore || 0,
        maxScore: 100,
        breakdown: {
          verificationStatus: operator.verificationStatus === "approved" ? 30 : 0,
          successfulBookings: Math.min(operator.successfulBookings || 0, 40),
          customerRatings: 20,
          onTimePerformance: 10,
        },
        tier: operator.tier,
      },
    }
  }

  @Get("performance")
  @ApiOperation({ summary: "Get performance metrics" })
  @ApiResponse({ status: 200, description: "Performance metrics retrieved successfully" })
  async getPerformance(operatorId: number) {
    const usageStats = await this.tierRestrictionService.getUsageStats(operatorId)
    const operator = await this.operatorsService.findOne(operatorId)

    return {
      success: true,
      message: "Performance metrics retrieved successfully",
      data: {
        totalBookings: operator.successfulBookings || 0,
        currentMonthBookings: usageStats.bookings.used,
        activePackages: usageStats.packages.used,
        trustScore: operator.trustScore || 0,
        tier: operator.tier,
        verificationStatus: operator.verificationStatus,
      },
    }
  }

  @Get("upgrade-progress")
  @ApiOperation({ summary: "Get progress towards next tier" })
  @ApiResponse({ status: 200, description: "Upgrade progress retrieved successfully" })
  async getUpgradeProgress(operatorId: number) {
    const operator = await this.operatorsService.findOne(operatorId)

    const progress = {
      currentTier: operator.tier,
      nextTier: operator.tier === "BRONZE" ? "SILVER" : operator.tier === "SILVER" ? "GOLD" : null,
      requirements:
        operator.tier === "BRONZE"
          ? {
              trustScoreRequired: 70,
              currentTrustScore: operator.trustScore || 0,
              successfulBookingsRequired: 10,
              currentSuccessfulBookings: operator.successfulBookings || 0,
              documentsRequired: ["business_license", "cac_certificate"],
              documentsApproved: operator.verificationStatus === "approved",
            }
          : operator.tier === "SILVER"
            ? {
                trustScoreRequired: 85,
                currentTrustScore: operator.trustScore || 0,
                successfulBookingsRequired: 50,
                currentSuccessfulBookings: operator.successfulBookings || 0,
              }
            : null,
    }

    return {
      success: true,
      message: "Upgrade progress retrieved successfully",
      data: progress,
    }
  }
}
