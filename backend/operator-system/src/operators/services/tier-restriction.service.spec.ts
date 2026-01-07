import { Test, type TestingModule } from "@nestjs/testing"
import type { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { TierRestrictionService } from "./tier-restriction.service"
import { Operator } from "../entities/operator.entity"
import { TierConfig } from "../../config/entities/tier-config.entity"
import { jest } from "@jest/globals"

describe("TierRestrictionService", () => {
  let service: TierRestrictionService
  let operatorRepo: Repository<Operator>
  let tierConfigRepo: Repository<TierConfig>

  const mockOperator: Partial<Operator> = {
    id: 1,
    tier: "bronze",
    trustScore: 50,
    totalBookings: 5,
    successfulBookings: 4,
    monthlyBookingsCount: 2,
  }

  const mockTierConfig: Partial<TierConfig> = {
    tier: "bronze",
    maxBookingsPerMonth: 10,
    maxActivePackages: 3,
    maxPilgrimsPerBooking: 5,
    requiresEscrow: true,
    internationalTravelAllowed: false,
    enabled: true,
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
          provide: getRepositoryToken(TierConfig),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TierRestrictionService>(TierRestrictionService)
    operatorRepo = module.get<Repository<Operator>>(getRepositoryToken(Operator))
    tierConfigRepo = module.get<Repository<TierConfig>>(getRepositoryToken(TierConfig))
  })

  describe("canCreateBooking", () => {
    it("should allow booking when under limit", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.canCreateBooking(1, 3)

      expect(result.allowed).toBe(true)
      expect(result.requiresEscrow).toBe(true)
    })

    it("should block booking when exceeding monthly limit", async () => {
      const overLimitOperator = { ...mockOperator, monthlyBookingsCount: 10 }
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(overLimitOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.canCreateBooking(1, 3)

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain("monthly booking limit")
    })

    it("should block booking when exceeding pilgrims per booking", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.canCreateBooking(1, 10)

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain("pilgrims per booking")
    })
  })

  describe("canCreatePackage", () => {
    it("should allow package creation when under limit", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue({
        ...mockOperator,
        activePackagesCount: 2,
      } as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.canCreatePackage(1, "umrah")

      expect(result.allowed).toBe(true)
    })

    it("should block international package for bronze tier", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.canCreatePackage(1, "hajj")

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain("international travel")
    })
  })

  describe("getRestrictions", () => {
    it("should return tier restrictions", async () => {
      jest.spyOn(operatorRepo, "findOne").mockResolvedValue(mockOperator as Operator)
      jest.spyOn(tierConfigRepo, "findOne").mockResolvedValue(mockTierConfig as TierConfig)

      const result = await service.getRestrictions(1)

      expect(result.tier).toBe("bronze")
      expect(result.limits.maxBookingsPerMonth).toBe(10)
      expect(result.usage.bookingsThisMonth).toBe(2)
    })
  })
})
