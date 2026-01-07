// src/operators/controllers/tier.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import type { TierRestrictionService } from "../services/tier-restriction.service"
import type { OperatorsService } from "../operators.service"

@ApiTags("Operator Tier")
@ApiBearerAuth("JWT-auth")
@Controller("operator/tier")
@UseGuards(JwtAuthGuard)
export class TierController {
  constructor(
    private readonly tierRestrictionService: TierRestrictionService,
    private readonly operatorsService: OperatorsService,
  ) {}

  @Get("info")
  @ApiOperation({ summary: "Get current operator tier information" })
  @ApiResponse({ status: 200, description: "Tier information retrieved successfully" })
  async getTierInfo(operatorId: number) {
    const operator = await this.operatorsService.findOne(operatorId)

    return {
      success: true,
      message: "Tier information retrieved successfully",
      data: {
        tier: operator.tier,
        trustScore: operator.trustScore,
        verificationStatus: operator.verificationStatus,
        badges: operator.badges,
        joinedAt: operator.createdAt,
      },
    }
  }

  @Get("restrictions")
  @ApiOperation({ summary: "Get current tier restrictions and limits" })
  @ApiResponse({ status: 200, description: "Tier restrictions retrieved successfully" })
  async getRestrictions(operatorId: number) {
    const usageStats = await this.tierRestrictionService.getUsageStats(operatorId)

    return {
      success: true,
      message: "Tier restrictions retrieved successfully",
      data: usageStats,
    }
  }

  @Get("comparison")
  @ApiOperation({ summary: "Compare all tier features" })
  @ApiResponse({ status: 200, description: "Tier comparison retrieved successfully" })
  async getTierComparison(operatorId: number) {
    const operator = await this.operatorsService.findOne(operatorId)

    return {
      success: true,
      message: "Tier comparison retrieved successfully",
      data: {
        currentTier: operator.tier,
        tiers: [
          {
            name: "BRONZE",
            features: {
              maxBookingsPerMonth: 10,
              maxActivePackages: 2,
              maxPilgrimsPerBooking: 20,
              requiresEscrow: true,
              escrowPercentage: 100,
              commissionRate: 15,
              internationalTravelAllowed: false,
            },
          },
          {
            name: "SILVER",
            features: {
              maxBookingsPerMonth: 50,
              maxActivePackages: 10,
              maxPilgrimsPerBooking: 100,
              requiresEscrow: false,
              escrowPercentage: 0,
              commissionRate: 10,
              internationalTravelAllowed: true,
            },
          },
          {
            name: "GOLD",
            features: {
              maxBookingsPerMonth: -1,
              maxActivePackages: -1,
              maxPilgrimsPerBooking: -1,
              requiresEscrow: false,
              escrowPercentage: 0,
              commissionRate: 7,
              internationalTravelAllowed: true,
            },
          },
        ],
      },
    }
  }

  @Get("badges")
  @ApiOperation({ summary: "Get operator badges" })
  @ApiResponse({ status: 200, description: "Badges retrieved successfully" })
  async getBadges(operatorId: number) {
    const operator = await this.operatorsService.findOne(operatorId)

    return {
      success: true,
      message: "Badges retrieved successfully",
      data: {
        badges: operator.badges || [],
      },
    }
  }
}
