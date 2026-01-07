import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Operator } from "./entities/operator.entity"

@Injectable()
export class OperatorsService {
  constructor(private readonly operatorRepo: Repository<Operator>) {}

  async findOne(id: number): Promise<Operator> {
    const operator = await this.operatorRepo.findOne({ where: { id } })
    if (!operator) {
      throw new NotFoundException(`Operator with ID ${id} not found`)
    }
    return operator
  }

  async findByEmail(email: string): Promise<Operator | null> {
    return this.operatorRepo.findOne({ where: { email } })
  }

  async updateTier(id: number, tier: string): Promise<Operator> {
    const operator = await this.findOne(id)
    operator.tier = tier
    return this.operatorRepo.save(operator)
  }

  async updateTrustScore(id: number, score: number): Promise<Operator> {
    const operator = await this.findOne(id)
    operator.trustScore = score
    return this.operatorRepo.save(operator)
  }

  async incrementSuccessfulBookings(id: number): Promise<void> {
    await this.operatorRepo.increment({ id }, "successfulBookings", 1)
  }

  async getTierInfo(id: number) {
    const operator = await this.findOne(id)
    return {
      tier: operator.tier,
      trustScore: operator.trustScore,
      verificationStatus: operator.verificationStatus,
      badges: operator.badges || [],
      tierUpgradeEligible: operator.trustScore >= 80 && operator.successfulBookings >= 10,
    }
  }
}
