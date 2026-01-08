import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import  { Repository } from "typeorm"
import { DocumentStatus, DocumentType,  OperatorDocument } from "../entities/operator-document.entity"
// import { DocumentType, DocumentStatus } from "../entities/operator-document.entity"

import type { OperatorBadge } from "../entities/operator-badge.entity"
import { OperatorTier, OperatorVerificationStatus, type Operator } from "../entities/operator.entity"

@Injectable()
export class VerificationService {
  private readonly documentRepo: Repository<OperatorDocument>
  private readonly badgeRepo: Repository<OperatorBadge>
  private readonly operatorRepo: Repository<Operator>

  constructor(
    documentRepo: Repository<OperatorDocument>,
    badgeRepo: Repository<OperatorBadge>,
    operatorRepo: Repository<Operator>,
  ) {
    this.documentRepo = documentRepo
    this.badgeRepo = badgeRepo
    this.operatorRepo = operatorRepo
  }

  async uploadDocument(operatorId: number, type: string, url: string, metadata?: any) {
    const existingDoc = await this.documentRepo.findOne({
      where: { operatorId, type: DocumentType[type.toUpperCase() as keyof typeof DocumentType], status: DocumentStatus.PENDING },
    })

    if (existingDoc) {
      throw new BadRequestException(`A ${type} document is already pending verification`)
    }


    const document = this.documentRepo.create({
      operatorId,
      type: DocumentType[type.toUpperCase() as keyof typeof DocumentType],
      filename: url.split("/").pop() || "unknown",
      url,
      status: DocumentStatus.PENDING,
      metadata: metadata || {},
    })

    return this.documentRepo.save(document)
  }

 

  async getDocuments(operatorId: number) {
  return this.documentRepo.find({
    where: { operatorId },
    order: { createdAt: "DESC" },
  })
}


  async verifyDocument(documentId: number, adminNotes?: string) {
    const document = await this.documentRepo.findOne({ where: { id: documentId } })
    if (!document) {
      throw new NotFoundException("Document not found")
    }

    document.status = DocumentStatus.APPROVED
    document.verifiedAt = new Date()
    document.adminNotes = adminNotes
    await this.documentRepo.save(document)

    await this.checkAndUpdateVerificationStatus(document.operatorId)

    return document
  }

  async rejectDocument(documentId: number, reason: string) {
    const document = await this.documentRepo.findOne({ where: { id: documentId } })
    if (!document) {
      throw new NotFoundException("Document not found")
    }

    document.status = DocumentStatus.REJECTED
    document.verifiedAt = new Date()
    document.adminNotes = reason
    return this.documentRepo.save(document)
  }

  private async checkAndUpdateVerificationStatus(operatorId: number) {
    const requiredDocs = ["business_license", "cac_certificate"]
    const approvedDocs = await this.documentRepo.find({
      where: { operatorId, status: DocumentStatus.APPROVED },
    })

    const approvedTypes = approvedDocs.map((d) => d.type)
    const allRequiredApproved = requiredDocs.every((type) => approvedTypes.includes(DocumentType[type.toUpperCase() as keyof typeof DocumentType]))

    if (allRequiredApproved) {
      await this.operatorRepo.update({ id: operatorId }, { verificationStatus: OperatorVerificationStatus.APPROVED , tier: OperatorTier.SILVER })

      await this.awardBadge(operatorId, "verified", "Verified Operator", "Successfully completed verification")
    }
  }

  async awardBadge(operatorId: number, badgeType: string, title: string, description: string) {
    const existing = await this.badgeRepo.findOne({
      where: { operatorId, badgeType },
    })

    if (existing) {
      return existing
    }

    const badge = this.badgeRepo.create({
      operatorId,
      badgeType,
      title,
      description,
      awardedAt: new Date(),
    })

    return this.badgeRepo.save(badge)
  }

  async getBadges(operatorId: number) {
    return this.badgeRepo.find({
      where: { operatorId },
      order: { awardedAt: "DESC" },
    })
  }
}
