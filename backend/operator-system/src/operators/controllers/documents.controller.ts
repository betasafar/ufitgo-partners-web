// src/operators/controllers/documents.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
} from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import type { VerificationService } from "../services/verification.service"
import type { Express } from "express"

@ApiTags("Operator Documents")
@ApiBearerAuth("JWT-auth")
@Controller("operator/documents")
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("upload")
  @ApiOperation({ summary: "Upload verification documents" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Documents uploaded successfully" })
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadDocuments(
    operatorId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('documentType') documentType: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files uploaded")
    }

    const uploadedDocs = []
    for (const file of files) {
      const doc = await this.verificationService.uploadDocument(operatorId, documentType, file.path || file.filename, {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      })
      uploadedDocs.push(doc)
    }

    return {
      success: true,
      message: "Documents uploaded successfully",
      data: uploadedDocs,
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all operator documents" })
  @ApiResponse({ status: 200, description: "Documents retrieved successfully" })
  async getDocuments(operatorId: number) {
    const documents = await this.verificationService.getDocuments(operatorId)

    return {
      success: true,
      message: "Documents retrieved successfully",
      data: documents,
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific document details" })
  @ApiResponse({ status: 200, description: "Document retrieved successfully" })
  async getDocument(operatorId: number, @Param("id", ParseIntPipe) documentId: number) {
    const documents = await this.verificationService.getDocuments(operatorId)
    const document = documents.find((d) => d.id === documentId)

    if (!document) {
      throw new BadRequestException("Document not found or access denied")
    }

    return {
      success: true,
      message: "Document retrieved successfully",
      data: document,
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a document" })
  @ApiResponse({ status: 200, description: "Document deleted successfully" })
  async deleteDocument(operatorId: number, @Param("id", ParseIntPipe) documentId: number) {
    const documents = await this.verificationService.getDocuments(operatorId)
    const document = documents.find((d) => d.id === documentId)

    if (!document) {
      throw new BadRequestException("Document not found or access denied")
    }

    if (document.status === "pending") {
      throw new BadRequestException("Cannot delete documents under review")
    }

    return {
      success: true,
      message: "Document deleted successfully",
    }
  }

  @Get("verification-status")
  @ApiOperation({ summary: "Get overall verification status" })
  @ApiResponse({ status: 200, description: "Verification status retrieved successfully" })
  async getVerificationStatus(operatorId: number) {
    const documents = await this.verificationService.getDocuments(operatorId)
    const badges = await this.verificationService.getBadges(operatorId)

    const requiredDocs = ["business_license", "cac_certificate"]
    const uploadedTypes = documents.map((d) => d.type)
    const approvedTypes = documents.filter((d) => d.status === "approved").map((d) => d.type)

    const status = {
      documentsUploaded: documents.length,
      documentsApproved: documents.filter((d) => d.status === "approved").length,
      documentsPending: documents.filter((d) => d.status === "pending").length,
      documentsRejected: documents.filter((d) => d.status === "rejected").length,
      requiredDocuments: requiredDocs,
      missingDocuments: requiredDocs.filter((type) => !uploadedTypes.includes(type)),
      isFullyVerified: requiredDocs.every((type) => approvedTypes.includes(type)),
      badges: badges.length,
    }

    return {
      success: true,
      message: "Verification status retrieved successfully",
      data: status,
    }
  }
}
