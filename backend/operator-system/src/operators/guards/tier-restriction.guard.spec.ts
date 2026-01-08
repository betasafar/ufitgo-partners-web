import { Test, type TestingModule } from "@nestjs/testing"
import { type ExecutionContext, BadRequestException } from "@nestjs/common"
import { TierRestrictionGuard } from "./tier-restriction.guard"
import { TierRestrictionService } from "../services/tier-restriction.service"
import { jest } from "@jest/globals"

describe("TierRestrictionGuard", () => {
  let guard: TierRestrictionGuard
  let tierRestrictionService: TierRestrictionService

  const mockTierRestrictionService = {
    canCreateBooking: jest.fn<() => Promise<{ allowed: boolean; reason?: string }>>(),
    canCreatePackage: jest.fn<() => Promise<{ allowed: boolean; reason?: string }>>(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TierRestrictionGuard,
        {
          provide: TierRestrictionService,
          useValue: mockTierRestrictionService,
        },
      ],
    }).compile()

    guard = module.get<TierRestrictionGuard>(TierRestrictionGuard)
    tierRestrictionService = module.get<TierRestrictionService>(TierRestrictionService)
  })

  it("should allow request when tier check passes", async () => {
    mockTierRestrictionService.canCreateBooking.mockResolvedValue({ allowed: true })

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: 1 },
          body: { numberOfPilgrims: 3 },
          route: { path: "/operator/bookings" },
        }),
      }),
    } as ExecutionContext

    const result = await guard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it("should throw BadRequestException when tier check fails", async () => {
    mockTierRestrictionService.canCreateBooking.mockResolvedValue({
      allowed: false,
      reason: "Monthly booking limit exceeded",
    })

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: 1 },
          body: { numberOfPilgrims: 3 },
          route: { path: "/operator/bookings" },
        }),
      }),
    } as ExecutionContext

    await expect(guard.canActivate(mockContext)).rejects.toThrow(BadRequestException)
  })
})
