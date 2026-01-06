// src/packages/packages.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseInterceptors } from "@nestjs/common"
import { type PackagesService, type CreatePackageDto, UpdatePackageDto } from "./packages.service"
import { FilesInterceptor } from "@nestjs/platform-express"
import type { Express } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger"
import { PackageDto } from "../common/dto/package.dto"
import { PackageStatus } from "./entities/package.entity"

@ApiTags("Operator Packages")
@ApiBearerAuth("JWT-auth")
@Controller("operator/packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiOperation({ summary: "Create a new package with images" })
  @ApiResponse({ status: 201, description: "Package created successfully", type: PackageDto })
  async create(
    dto: CreatePackageDto,
    files: Array<Express.Multer.File>,
    @Param("operatorId", ParseIntPipe) operatorId: number,
  ) {
    return this.packagesService.create(operatorId, dto, files)
  }

  @Get()
  @ApiOperation({ summary: "Get all packages belonging to the operator" })
  @ApiResponse({ status: 200, description: "List of operator packages", type: [PackageDto] })
  async findAll(@Param("operatorId", ParseIntPipe) operatorId: number) {
    return this.packagesService.findAllForOperator(operatorId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed information about a specific package" })
  @ApiResponse({ status: 200, description: "Package details with itinerary and images", type: PackageDto })
  @ApiResponse({ status: 404, description: "Package not found or access denied" })
  async findOne(@Param("id", ParseIntPipe) id: number, @Param("operatorId", ParseIntPipe) operatorId: number) {
    return this.packagesService.findOne(id, operatorId)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an existing package" })
  @ApiBody({ type: UpdatePackageDto })
  @ApiResponse({ status: 200, description: "Package updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Param("operatorId", ParseIntPipe) operatorId: number,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.packagesService.update(id, operatorId, dto)
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Toggle package status" })
  @ApiBody({
    schema: { type: "object", properties: { status: { type: "string", enum: Object.values(PackageStatus) } } },
  })
  @ApiResponse({ status: 200, description: "Package status updated" })
  async toggleStatus(
    @Param("id", ParseIntPipe) id: number,
    @Param("operatorId", ParseIntPipe) operatorId: number,
    @Body("status") status: PackageStatus,
  ) {
    return this.packagesService.toggleStatus(id, operatorId, status)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a package" })
  @ApiResponse({ status: 200, description: "Package deleted successfully" })
  async delete(@Param("id", ParseIntPipe) id: number, @Param("operatorId", ParseIntPipe) operatorId: number) {
    return this.packagesService.delete(id, operatorId)
  }

  @Get(":id/bookings")
  @ApiOperation({ summary: "Get all bookings for a specific package" })
  @ApiResponse({ status: 200, description: "Package bookings returned" })
  async getPackageBookings(
    @Param("id", ParseIntPipe) id: number,
    @Param("operatorId", ParseIntPipe) operatorId: number,
  ) {
    return this.packagesService.getBookingsForPackage(id, operatorId)
  }

  @Get(":id/performance")
  @ApiOperation({ summary: "Get performance metrics for a package" })
  @ApiResponse({ status: 200, description: "Package performance metrics returned" })
  async getPackagePerformance(
    @Param("id", ParseIntPipe) id: number,
    @Param("operatorId", ParseIntPipe) operatorId: number,
  ) {
    return this.packagesService.getPackagePerformance(id, operatorId)
  }
}
