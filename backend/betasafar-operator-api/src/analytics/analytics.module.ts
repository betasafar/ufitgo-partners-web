import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AnalyticsController } from "./analytics.controller"
import { AnalyticsService } from "./analytics.service"
import { Booking } from "../bookings/entities/booking.entity"
import { WalletTransaction } from "../wallet/entities/wallet-transaction.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Booking, WalletTransaction])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
