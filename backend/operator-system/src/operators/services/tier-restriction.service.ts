import { Injectable, BadRequestException } from "@nestjs/common"
import  { Repository } from "typeorm"
import  { Operator } from "../entities/operator.entity"
import  { Package, PackageStatus } from "../../packages/entities/package.entity"
import  { Booking } from "../../bookings/entities/booking.entity"
import  { TierConfig } from "../../config/entities/tier-config.entity"

@Injectable()
export class TierRestrictionService {
  constructor(
    private readonly operatorRepo: Repository<Operator>,
    private readonly packageRepo: Repository<Package>,
    private readonly bookingRepo: Repository<Booking>,
    private readonly tierConfigRepo: Repository<TierConfig>,
  ) {}

  async getTierConfig(tier: string): Promise<TierConfig> {
    const config = await this.tierConfigRepo.findOne({ where: { tier, isActive: true } })
    if (!config) {
      throw new BadRequestException(`No active configuration found for tier ${tier}`)
    }
    return config
  }

  // Add these methods to TierRestrictionService

  async canCreateBooking(operatorId: number): Promise<boolean> {
    try {
      await this.checkBookingLimit(operatorId);
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return false;
      }
      throw error; // re-throw unexpected errors
    }
  }

  async canCreatePackage(operatorId: number): Promise<boolean> {
    try {
      await this.checkPackageLimit(operatorId);
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return false;
      }
      throw error;
    }
  }

  async canAddPilgrims(operatorId: number, pilgrimCount: number): Promise<boolean> {
    try {
      await this.checkPilgrimLimit(operatorId, pilgrimCount);
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return false;
      }
      throw error;
    }
  }

  async checkBookingLimit(operatorId: number): Promise<void> {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
    if (!operator) {
      throw new BadRequestException("Operator not found")
    }

    const config = await this.getTierConfig(operator.tier)

    if (config.maxBookingsPerMonth === -1) {
      return
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const bookingsThisMonth = await this.bookingRepo.count({
      where: {
        operatorId,
        createdAt: startOfMonth as any,
      },
    })

    if (bookingsThisMonth >= config.maxBookingsPerMonth) {
      throw new BadRequestException(
        `Booking limit reached for ${operator.tier} tier (${config.maxBookingsPerMonth} per month). Upgrade to increase limit.`,
      )
    }
  }

  async checkPackageLimit(operatorId: number): Promise<void> {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
    if (!operator) {
      throw new BadRequestException("Operator not found")
    }

    const config = await this.getTierConfig(operator.tier)

    if (config.maxActivePackages === -1) {
      return
    }

    const activePackages = await this.packageRepo.count({
      where: { operatorId, status: PackageStatus.ACTIVE },
    })

    if (activePackages >= config.maxActivePackages) {
      throw new BadRequestException(
        `Package limit reached for ${operator.tier} tier (${config.maxActivePackages} active packages). Upgrade to add more.`,
      )
    }
  }

  async checkPilgrimLimit(operatorId: number, pilgrimCount: number): Promise<void> {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
    if (!operator) {
      throw new BadRequestException("Operator not found")
    }

    const config = await this.getTierConfig(operator.tier)

    if (config.maxPilgrimsPerBooking === -1) {
      return
    }

    if (pilgrimCount > config.maxPilgrimsPerBooking) {
      throw new BadRequestException(
        `Pilgrim limit exceeded for ${operator.tier} tier (max ${config.maxPilgrimsPerBooking} per booking). Upgrade for larger groups.`,
      )
    }
  }

  async requiresEscrow(operatorId: number): Promise<boolean> {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
    if (!operator) {
      return true
    }

    const config = await this.getTierConfig(operator.tier)
    return config.requiresEscrow
  }

  async getUsageStats(operatorId: number) {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
    if (!operator) {
      throw new BadRequestException("Operator not found")
    }

    const config = await this.getTierConfig(operator.tier)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const bookingsThisMonth = await this.bookingRepo.count({
      where: {
        operatorId,
        createdAt: startOfMonth as any,
      },
    })

    const activePackages = await this.packageRepo.count({
      where: { operatorId, status: PackageStatus.ACTIVE },
    })

    return {
      tier: operator.tier,
      bookings: {
        used: bookingsThisMonth,
        limit: config.maxBookingsPerMonth,
        percentage: config.maxBookingsPerMonth === -1 ? 0 : (bookingsThisMonth / config.maxBookingsPerMonth) * 100,
      },
      packages: {
        used: activePackages,
        limit: config.maxActivePackages,
        percentage: config.maxActivePackages === -1 ? 0 : (activePackages / config.maxActivePackages) * 100,
      },
      features: {
        escrowRequired: config.requiresEscrow,
        maxPilgrimsPerBooking: config.maxPilgrimsPerBooking,
      },
    }
  }
}
