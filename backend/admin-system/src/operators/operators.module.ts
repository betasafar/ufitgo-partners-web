import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Operator } from "../admin/entities/operator.entity"
import { OperatorDocument } from "./entities/operator-document.entity"
import { OperatorBadge } from "./entities/operator-badge.entity"
import { TierConfiguration } from "./entities/tier-config.entity"
import { OperatorsVerificationController } from "./operators-verification.controller"
import { OperatorsVerificationService } from "./operators-verification.service"
import { TierConfigController } from "./tier-config.controller"
import { TierConfigService } from "./tier-config.service"

@Module({
  imports: [TypeOrmModule.forFeature([Operator, OperatorDocument, OperatorBadge, TierConfiguration])],
  controllers: [OperatorsVerificationController, TierConfigController],
  providers: [OperatorsVerificationService, TierConfigService],
  exports: [OperatorsVerificationService, TierConfigService],
})
export class OperatorsModule {}
