// src/operators/guards/tier-restriction.guard.ts
import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import type { TierRestrictionService } from "../services/tier-restriction.service"
import type { OperatorsService } from "../operators.service"

@Injectable()
export class TierRestrictionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tierRestrictionService: TierRestrictionService,
    private readonly operatorsService: OperatorsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const operatorId = request.user?.sub

    if (!operatorId) {
      throw new ForbiddenException("Operator not authenticated")
    }

    const operator = await this.operatorsService.findById(operatorId)
    const restrictionType = this.reflector.get<string>("tierRestriction", context.getHandler())

    // Check booking restrictions
    if (restrictionType === "CREATE_BOOKING") {
      const canCreate = await this.tierRestrictionService.canCreateBooking(operator.id)
      if (!canCreate) {
        throw new ForbiddenException(
          `Tier ${operator.tier} has reached the maximum booking limit for this month. Upgrade to increase your limits.`,
        )
      }
    }

    // Check package restrictions
    if (restrictionType === "CREATE_PACKAGE") {
      const canCreate = await this.tierRestrictionService.canCreatePackage(operator.id)
      if (!canCreate) {
        throw new ForbiddenException(
          `Tier ${operator.tier} has reached the maximum active package limit. Upgrade to create more packages.`,
        )
      }
    }

    return true
  }
}
