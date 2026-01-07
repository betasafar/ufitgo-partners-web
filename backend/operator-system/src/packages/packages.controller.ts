// src/packages/packages.controller.ts

import { Controller, Get, Post, Put, Delete, UseInterceptors, Param, Body, UploadedFiles } from "@nestjs/common"
import {  PackagesService,  CreatePackageDto, UpdatePackageDto } from "./packages.service"
import { FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger"
import { PackageDto } from "../common/dto/package.dto"
import { PackageStatus } from "./entities/package.entity"
import { AggregatePerformanceResponseDto } from './dto/performance.dto';


@ApiTags("Operator Packages")
@ApiBearerAuth("JWT-auth")
@Controller("operator/packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}


  @Get("performance")
  @ApiOperation({ summary: "Get aggregate performance metrics for all operator packages" })
  @ApiResponse({ 
    status: 200, 
    description: "Aggregate performance metrics returned",
    type: AggregatePerformanceResponseDto,
  })
  async getPerformance() {
    const operator = { id: 1 }
    return this.packagesService.getAggregatePerformance(operator.id)
  }

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiOperation({ summary: "Create a new package with images" })
  @ApiResponse({ status: 201, description: "Package created successfully", type: PackageDto })
  async create(@Body() dto: CreatePackageDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.packagesService.create(operator.id, dto, files)
  }

  @Get()
  @ApiOperation({ summary: "Get all packages belonging to the operator" })
  @ApiResponse({ status: 200, description: "List of operator packages", type: [PackageDto] })
  async findAll() {
    const operator = { id: 1 }
    return this.packagesService.findAllForOperator(operator.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed information about a specific package" })
  @ApiResponse({ status: 200, description: "Package details with itinerary and images", type: PackageDto })
  @ApiResponse({ status: 404, description: "Package not found or access denied" })
  async findOne(@Param("id") id: string) {
    const operator = { id: 1 }
    return this.packagesService.findOne(Number(id), operator.id)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an existing package" })
  @ApiBody({ type: UpdatePackageDto })
  @ApiResponse({ status: 200, description: "Package updated successfully" })
  async update(@Param("id") id: string, @Body() dto: UpdatePackageDto) {
    const operator = { id: 1 }
    return this.packagesService.update(Number(id), operator.id, dto)
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Toggle package status" })
  @ApiBody({
    schema: { type: "object", properties: { status: { type: "string", enum: Object.values(PackageStatus) } } },
  })
  @ApiResponse({ status: 200, description: "Package status updated" })
  async toggleStatus(@Param("id") id: string, @Body("status") status: PackageStatus) {
    const operator = { id: 1 }
    return this.packagesService.toggleStatus(Number(id), operator.id, status)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a package" })
  @ApiResponse({ status: 200, description: "Package deleted successfully" })
  async delete(@Param("id") id: string) {
    const operator = { id: 1 }
    return this.packagesService.delete(Number(id), operator.id)
  }

  @Get(":id/bookings")
  @ApiOperation({ summary: "Get all bookings for a specific package" })
  @ApiResponse({ status: 200, description: "Package bookings returned" })
  async getPackageBookings(@Param("id") id: string) {
    const operator = { id: 1 }
    return this.packagesService.getBookingsForPackage(Number(id), operator.id)
  }

  @Get(":id/performance")
  @ApiOperation({ summary: "Get performance metrics for a package" })
  @ApiResponse({ status: 200, description: "Package performance metrics returned" })
  async getPackagePerformance(@Param("id") id: string) {
    const operator = { id: 1 }
    return this.packagesService.getPackagePerformance(Number(id), operator.id)
  }

  @Get(":id/availability")
  @ApiOperation({ summary: "Get package availability and slot information" })
  @ApiResponse({ status: 200, description: "Package availability returned" })
  @ApiResponse({ status: 404, description: "Package not found" })
  async getPackageAvailability(@Param("id") id: string) {
    const operator = { id: 1 }
    return this.packagesService.getPackageAvailability(Number(id), operator.id)
  }
}
