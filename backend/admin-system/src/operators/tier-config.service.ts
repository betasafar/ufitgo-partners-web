import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { TierConfiguration } from "./entities/tier-config.entity"

@Injectable()
export class TierConfigService {
  private readonly configRepo: Repository<TierConfiguration>

  constructor(configRepo: Repository<TierConfiguration>) {
    this.configRepo = configRepo
  }

  async getAllConfigs() {
    return this.configRepo.find({ order: { tier: "ASC" } })
  }

  async updateConfig(tier: string, updates: Partial<TierConfiguration>) {
    let config = await this.configRepo.findOne({ where: { tier } })

    if (!config) {
      config = this.configRepo.create({ tier, ...updates })
    } else {
      Object.assign(config, updates)
    }

    config.updatedAt = new Date()
    return this.configRepo.save(config)
  }

  async updateFeatureFlags(flags: Record<string, boolean>) {
    const configs = await this.configRepo.find()

    for (const config of configs) {
      Object.assign(config, flags)
      await this.configRepo.save(config)
    }

    return { success: true, updated: configs.length }
  }

  async getAuditLog() {
    return this.configRepo.find({
      order: { updatedAt: "DESC" },
      take: 50,
    })
  }
}
