import { Controller, Get, Param, Patch, Post, Body, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"
import type { OperatorsVerificationService } from "./operators-verification.service"

@Controller("admin/operators")
@UseGuards(JwtAuthGuard)
export class OperatorsVerificationController {
  constructor(private readonly verificationService: OperatorsVerificationService) {}

  @Get("verification/pending")
  async getPendingVerifications() {
    return this.verificationService.getPendingVerifications()
  }

  @Get(":id/documents")
  async getOperatorDocuments(@Param("id") operatorId: string) {
    return this.verificationService.getOperatorDocuments(Number(operatorId))
  }

  @Patch(":id/documents/:docId/verify")
  async verifyDocument(
    @Param("id") operatorId: string,
    @Param("docId") docId: string,
    @Body("status") status: "verified" | "rejected",
    @Body("rejectionReason") rejectionReason?: string,
  ) {
    return this.verificationService.verifyDocument(Number(operatorId), Number(docId), status, rejectionReason)
  }

  @Patch(":id/verification/:status")
  async updateVerificationStatus(
    @Param("id") operatorId: string,
    @Param("status") status: "approved" | "rejected" | "under_review",
  ) {
    return this.verificationService.updateVerificationStatus(Number(operatorId), status)
  }

  @Post(":id/tier-upgrade")
  async upgradeTier(
    @Param("id") operatorId: string,
    @Body("targetTier") targetTier: "bronze" | "silver" | "gold" | "platinum",
    @Body("reason") reason: string,
  ) {
    return this.verificationService.upgradeTier(Number(operatorId), targetTier, reason)
  }
}
