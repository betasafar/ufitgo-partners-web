import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import type { Repository } from "typeorm"
import type { Operator } from "../entities/operator.entity"
import type { Booking } from "../../bookings/entities/booking.entity"
import type { OperatorBadge } from "../entities/operator-badge.entity"

@Injectable()
export class TierAutomationService {
  private readonly logger = new Logger(TierAutomationService.name)

  constructor(
    private readonly operatorRepo: Repository<Operator>,
    private readonly bookingRepo: Repository<Booking>,
    private readonly badgeRepo: Repository<OperatorBadge>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async evaluateTierUpgrades() {
    this.logger.log("Starting daily tier upgrade evaluation")

    const operators = await this.operatorRepo.find({
      where: { verificationStatus: "approved" },
    })

    for (const operator of operators) {
      await this.evaluateOperatorTierUpgrade(operator)
    }

    this.logger.log(`Evaluated ${operators.length} operators for tier upgrades`)
  }

  private async evaluateOperatorTierUpgrade(operator: Operator) {
    const bookings = await this.bookingRepo.find({
      where: { operatorId: operator.id, status: "confirmed" },
    })

    const completedBookings = bookings.length
    const trustScore = operator.trustScore || 50
    const currentTier = operator.tier || "bronze"

    if (currentTier === "bronze" && completedBookings >= 10 && trustScore > 70) {
      operator.tier = "silver"
      await this.operatorRepo.save(operator)
      await this.awardBadge(operator.id, "silver_partner", "Silver Partner", "Automatic upgrade")
      this.logger.log(`Upgraded operator ${operator.id} to SILVER`)
    }

    if (currentTier === "silver" && completedBookings >= 50 && trustScore > 85) {
      operator.tier = "gold"
      await this.operatorRepo.save(operator)
      await this.awardBadge(operator.id, "gold_partner", "Gold Partner", "Automatic upgrade")
      this.logger.log(`Upgraded operator ${operator.id} to GOLD`)
    }

    if (currentTier === "gold" && completedBookings >= 200 && trustScore > 95) {
      operator.tier = "platinum"
      await this.operatorRepo.save(operator)
      await this.awardBadge(operator.id, "platinum_elite", "Platinum Elite", "Automatic upgrade")
      this.logger.log(`Upgraded operator ${operator.id} to PLATINUM`)
    }
  }

  @Cron("0 */6 * * *")
  async updateTrustScores() {
    this.logger.log("Starting trust score recalculation")

    const operators = await this.operatorRepo.find()

    for (const operator of operators) {
      const trustScore = await this.calculateTrustScore(operator.id)
      operator.trustScore = trustScore
      await this.operatorRepo.save(operator)
    }

    this.logger.log(`Updated trust scores for ${operators.length} operators`)
  }

  private async calculateTrustScore(operatorId: number): Promise<number> {
    const bookings = await this.bookingRepo.find({
      where: { operatorId },
    })

    const totalBookings = bookings.length
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
    const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length

    let score = 50 // Base score

    score += Math.min(confirmedBookings * 2, 30)

    score -= Math.min(cancelledBookings * 5, 20)

    if (totalBookings > 0) {
      const completionRate = confirmedBookings / totalBookings
      if (completionRate > 0.9) score += 10
      if (completionRate > 0.95) score += 10
    }

    return Math.max(0, Math.min(100, score))
  }

  @Cron("0 0 1 * *")
  async resetMonthlyLimits() {
    this.logger.log("Resetting monthly booking limits")
    // Monthly limits are enforced per-request, no reset needed
    this.logger.log("Monthly limits reset complete")
  }

  private async awardBadge(operatorId: number, type: string, name: string, reason: string) {
    const existing = await this.badgeRepo.findOne({
      where: { operatorId, badgeType: type },
    })

    if (!existing) {
      const badge = this.badgeRepo.create({
        operatorId,
        badgeType: type,
        displayName: name,
        description: reason,
        awardedAt: new Date(),
      })
      await this.badgeRepo.save(badge)
    }
  }
}
