import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Operator } from "../admin/entities/operator.entity"
import type { OperatorDocument } from "./entities/operator-document.entity"
import type { OperatorBadge } from "./entities/operator-badge.entity"

@Injectable()
export class OperatorsVerificationService {
  constructor(
    private readonly operatorRepo: Repository<Operator>,
    private readonly documentRepo: Repository<OperatorDocument>,
    private readonly badgeRepo: Repository<OperatorBadge>,
  ) {}

  async getPendingVerifications() {
    const operators = await this.operatorRepo.find({
      where: { verificationStatus: "pending" as any },
      relations: ["documents"],
      order: { createdAt: "DESC" },
    })

    return operators.map((op) => ({
      id: op.id,
      companyName: op.companyName,
      email: op.email,
      tier: op.tier || "bronze",
      verificationStatus: op.verificationStatus,
      documentsCount: op.documents?.length || 0,
      createdAt: op.createdAt,
    }))
  }

  async getOperatorDocuments(operatorId: number) {
    const documents = await this.documentRepo.find({
      where: { operatorId },
      order: { uploadedAt: "DESC" },
    })

    if (!documents.length) {
      throw new NotFoundException("No documents found for this operator")
    }

    return documents
  }

  async verifyDocument(operatorId: number, docId: number, status: "verified" | "rejected", rejectionReason?: string) {
    const document = await this.documentRepo.findOne({
      where: { id: docId, operatorId },
    })

    if (!document) {
      throw new NotFoundException("Document not found")
    }

    document.verificationStatus = status
    document.verifiedAt = new Date()

    if (status === "rejected" && rejectionReason) {
      document.rejectionReason = rejectionReason
    }

    await this.documentRepo.save(document)

    const allDocuments = await this.documentRepo.find({ where: { operatorId } })
    const allVerified = allDocuments.every((doc) => doc.verificationStatus === "verified")

    if (allVerified) {
      const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })
      if (operator && operator.verificationStatus === "pending") {
        operator.verificationStatus = "approved" as any
        await this.operatorRepo.save(operator)
      }
    }

    return document
  }

  async updateVerificationStatus(operatorId: number, status: "approved" | "rejected" | "under_review") {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })

    if (!operator) {
      throw new NotFoundException("Operator not found")
    }

    operator.verificationStatus = status as any
    await this.operatorRepo.save(operator)

    if (status === "approved") {
      const existingBadge = await this.badgeRepo.findOne({
        where: { operatorId, badgeType: "verified_operator" },
      })

      if (!existingBadge) {
        const badge = this.badgeRepo.create({
          operatorId,
          badgeType: "verified_operator",
          displayName: "Verified Operator",
          description: "Official verified operator status",
          icon: "shield-check",
          awardedAt: new Date(),
        })
        await this.badgeRepo.save(badge)
      }
    }

    return operator
  }

  async upgradeTier(operatorId: number, targetTier: "bronze" | "silver" | "gold" | "platinum", reason: string) {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } })

    if (!operator) {
      throw new NotFoundException("Operator not found")
    }

    const previousTier = operator.tier || "bronze"
    operator.tier = targetTier
    await this.operatorRepo.save(operator)

    const tierBadges = {
      silver: { type: "silver_partner", name: "Silver Partner", icon: "star" },
      gold: { type: "gold_partner", name: "Gold Partner", icon: "crown" },
      platinum: { type: "platinum_elite", name: "Platinum Elite", icon: "gem" },
    }

    if (targetTier !== "bronze" && tierBadges[targetTier]) {
      const badge = tierBadges[targetTier]
      const existingBadge = await this.badgeRepo.findOne({
        where: { operatorId, badgeType: badge.type },
      })

      if (!existingBadge) {
        await this.badgeRepo.save(
          this.badgeRepo.create({
            operatorId,
            badgeType: badge.type,
            displayName: badge.name,
            description: `Upgraded to ${targetTier} tier: ${reason}`,
            icon: badge.icon,
            awardedAt: new Date(),
          }),
        )
      }
    }

    return {
      operator,
      previousTier,
      newTier: targetTier,
      reason,
    }
  }
}
