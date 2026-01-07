import { Test, type TestingModule } from "@nestjs/testing"
import type { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { VerificationService } from "./verification.service"
import { OperatorDocument } from "../entities/operator-document.entity"
import { OperatorBadge } from "../entities/operator-badge.entity"
import { Operator } from "../entities/operator.entity"
import { NotFoundException } from "@nestjs/common"
import { jest } from "@jest/globals"

describe("VerificationService", () => {
  let service: VerificationService
  let documentRepo: Repository<OperatorDocument>
  let badgeRepo: Repository<OperatorBadge>
  let operatorRepo: Repository<Operator>

  const mockDocument: Partial<OperatorDocument> = {
    id: 1,
    operatorId: 1,
    documentType: "business_license",
    fileUrl: "https://example.com/doc.pdf",
    verificationStatus: "pending",
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: getRepositoryToken(OperatorDocument),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OperatorBadge),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Operator),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<VerificationService>(VerificationService)
    documentRepo = module.get<Repository<OperatorDocument>>(getRepositoryToken(OperatorDocument))
    badgeRepo = module.get<Repository<OperatorBadge>>(getRepositoryToken(OperatorBadge))
    operatorRepo = module.get<Repository<Operator>>(getRepositoryToken(Operator))
  })

  describe("uploadDocument", () => {
    it("should create and save a new document", async () => {
      const mockCreatedDoc = { ...mockDocument, id: 1 }
      jest.spyOn(documentRepo, "create").mockReturnValue(mockCreatedDoc as OperatorDocument)
      jest.spyOn(documentRepo, "save").mockResolvedValue(mockCreatedDoc as OperatorDocument)

      const result = await service.uploadDocument(1, "business_license", "https://example.com/doc.pdf")

      expect(documentRepo.create).toHaveBeenCalledWith({
        operatorId: 1,
        documentType: "business_license",
        fileUrl: "https://example.com/doc.pdf",
        verificationStatus: "pending",
      })
      expect(result).toEqual(mockCreatedDoc)
    })
  })

  describe("getDocuments", () => {
    it("should return all documents for operator", async () => {
      const mockDocs = [mockDocument]
      jest.spyOn(documentRepo, "find").mockResolvedValue(mockDocs as OperatorDocument[])

      const result = await service.getDocuments(1)

      expect(result).toEqual(mockDocs)
    })
  })

  describe("deleteDocument", () => {
    it("should throw NotFoundException if document not found", async () => {
      jest.spyOn(documentRepo, "findOne").mockResolvedValue(null)

      await expect(service.deleteDocument(999, 1)).rejects.toThrow(NotFoundException)
    })

    it("should delete document if found", async () => {
      jest.spyOn(documentRepo, "findOne").mockResolvedValue(mockDocument as OperatorDocument)
      jest.spyOn(documentRepo, "remove").mockResolvedValue(mockDocument as OperatorDocument)

      const result = await service.deleteDocument(1, 1)

      expect(result.message).toContain("deleted successfully")
    })
  })

  describe("awardBadge", () => {
    it("should create and save a new badge", async () => {
      const mockBadge = { id: 1, operatorId: 1, badgeType: "verified", awardedAt: new Date() }
      jest.spyOn(badgeRepo, "create").mockReturnValue(mockBadge as OperatorBadge)
      jest.spyOn(badgeRepo, "save").mockResolvedValue(mockBadge as OperatorBadge)

      const result = await service.awardBadge(1, "verified")

      expect(result).toEqual(mockBadge)
    })
  })
})
