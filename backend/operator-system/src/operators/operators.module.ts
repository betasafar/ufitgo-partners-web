// src/operators/operators.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ScheduleModule } from "@nestjs/schedule"
import { Operator } from "./entities/operator.entity"
import { OperatorDocument } from "./entities/operator-document.entity"
import { OperatorBadge } from "./entities/operator-badge.entity"
import { TierConfiguration } from "../config/entities/tier-config.entity"
import { Booking } from "../bookings/entities/booking.entity"
import { OperatorsService } from "./operators.service"
import { TierRestrictionService } from "./services/tier-restriction.service"
import { VerificationService } from "./services/verification.service"
import { TierAutomationService } from "./services/tier-automation.service"
import { TierController } from "./controllers/tier.controller"
import { DocumentsController } from "./controllers/documents.controller"
import { MetricsController } from "./controllers/metrics.controller"
import { TierRestrictionGuard } from "./guards/tier-restriction.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, OperatorDocument, OperatorBadge, TierConfiguration, Booking]),
    ScheduleModule.forRoot(), // Added schedule module for cron jobs
  ],
  controllers: [TierController, DocumentsController, MetricsController],
  providers: [
    OperatorsService,
    TierRestrictionService,
    VerificationService,
    TierAutomationService, // Added automation service for tier upgrades
    TierRestrictionGuard,
  ],
  exports: [OperatorsService, TierRestrictionService, VerificationService, TierRestrictionGuard],
})
export class OperatorsModule {}
