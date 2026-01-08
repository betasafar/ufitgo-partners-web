import { Test, type TestingModule } from "@nestjs/testing"
import type { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { TierRestrictionService } from "./tier-restriction.service"
import { Operator, OperatorTier } from "../entities/operator.entity"
import { TierConfiguration } from "../../config/entities/tier-config.entity"
import { Package } from "../../packages/entities/package.entity"
import { Booking } from "../../bookings/entities/booking.entity"
import { jest } from "@jest/globals"

describe("TierRestrictionService", () => {
  let service: TierRestrictionService
  let operatorRepo: Repository<Operator>
  let tierConfigRepo: Repository<TierConfiguration>

  const mockOperator: Partial<Operator> = {
    id: 1,
    tier: OperatorTier.BRONZE,
    trustScore: 50,
    totalBookings: 5,
    successfulBookings: 4,
    monthlyBookingsCount: 2,
  }

  const mockTierConfig: Partial<TierConfiguration> = {
    tier: "BRONZE",
    maxBookingsPerMonth: 10,
    maxActivePackages: 3,
    maxPilgrimsPerBooking: 5,
    requiresEscrow: true,
    isActive: true,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TierRestrictionService,
        {
          provide: getRepositoryToken(Operator),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TierConfiguration),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Package),
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TierRestrictionService>(TierRestrictionService)
    operatorRepo = module.get<Repository<Operator>>(getRepositoryToken(Operator))
    tierConfigRepo = module.get<Repository<TierConfiguration>>(getRepositoryToken(TierConfiguration))
  })

  describe("canCreateBooking", () => {
    it("should allow booking when under limit", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfiguration)

      const result = await service.canCreateBooking(1)

      expect(result).toBe(true)
    })

    it("should block booking when exceeding monthly limit", async () => {
      const overLimitOperator = { ...mockOperator, monthlyBookingsCount: 10 }
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(overLimitOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfiguration)

      const result = await service.canCreateBooking(1)

      expect(result).toBe(false)
    })
  })

  describe("canCreatePackage", () => {
    it("should allow package creation when under limit", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue({
        ...mockOperator,
        activePackagesCount: 2,
      } as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfiguration)

      const result = await service.canCreatePackage(1)

      expect(result).toBe(true)
    })
  })

  describe("getUsageStats", () => {
    it("should return usage statistics", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfiguration)

      const result = await service.getUsageStats(1)

      expect(result.tier).toBe(OperatorTier.BRONZE)
      expect(result.bookings).toBeDefined()
      expect(result.packages).toBeDefined()
    })
  })
})
