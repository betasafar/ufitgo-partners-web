import { Controller, Get, Patch, Post, Body, Param, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"
import type { TierConfigService } from "./tier-config.service"

@Controller("admin/tier-config")
@UseGuards(JwtAuthGuard)
export class TierConfigController {
  constructor(private readonly configService: TierConfigService) {}

  @Get()
  async getAllConfigs() {
    return this.configService.getAllConfigs()
  }

  @Patch(":tier")
  async updateConfig(@Param("tier") tier: string, @Body() updates: any) {
    return this.configService.updateConfig(tier, updates)
  }

  @Post("feature-flags")
  async updateFeatureFlags(@Body() flags: Record<string, boolean>) {
    return this.configService.updateFeatureFlags(flags)
  }

  @Get("audit-log")
  async getAuditLog() {
    return this.configService.getAuditLog()
  }
}
