// src/packages/packages.service.ts
import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Package, type PackageType, PackageStatus } from "./entities/package.entity"
import type { CloudinaryService } from "../common/cloudinary/cloudinary.service"
import type { Express } from "express"

export class CreatePackageDto {
  title: string
  description: string
  type: PackageType
  duration: number
  capacity: number
  price: number
  departureDate: string
  returnDate: string
  images?: string[]
}

export class UpdatePackageDto {
  title?: string
  description?: string
  type?: PackageType
  duration?: number
  capacity?: number
  price?: number
  departureDate?: string
  returnDate?: string
  images?: string[]
  status?: PackageStatus
}

@Injectable()
export class PackagesService {
  constructor(
    private packageRepo: Repository<Package>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(operatorId: number, dto: CreatePackageDto, files?: Array<Express.Multer.File>) {
    let imageUrls: string[] = dto.images || []

    // Upload images if provided
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => this.cloudinaryService.uploadFile(file))
      const results = await Promise.all(uploadPromises)
      imageUrls = results.map((result) => result.secure_url)
    }

    const pkg = this.packageRepo.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      duration: dto.duration,
      capacity: dto.capacity,
      price: dto.price,
      departureDate: new Date(dto.departureDate),
      returnDate: new Date(dto.returnDate),
      images: imageUrls,
      operatorId,
      status: PackageStatus.DRAFT,
      booked: 0,
    })

    return this.packageRepo.save(pkg)
  }

  async findAllForOperator(operatorId: number) {
    return this.packageRepo.find({
      where: { operatorId },
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: number, operatorId: number) {
    const pkg = await this.packageRepo.findOne({
      where: { id, operatorId },
      relations: ["bookings"],
    })

    if (!pkg) {
      throw new NotFoundException("Package not found or access denied")
    }

    return pkg
  }

  async update(id: number, operatorId: number, dto: Partial<UpdatePackageDto>) {
    const pkg = await this.findOne(id, operatorId)

    if (dto.title !== undefined) pkg.title = dto.title
    if (dto.description !== undefined) pkg.description = dto.description
    if (dto.type !== undefined) pkg.type = dto.type
    if (dto.duration !== undefined) pkg.duration = dto.duration
    if (dto.capacity !== undefined) pkg.capacity = dto.capacity
    if (dto.price !== undefined) pkg.price = dto.price
    if (dto.departureDate !== undefined) pkg.departureDate = new Date(dto.departureDate)
    if (dto.returnDate !== undefined) pkg.returnDate = new Date(dto.returnDate)
    if (dto.images !== undefined) pkg.images = dto.images
    if (dto.status !== undefined) pkg.status = dto.status

    return this.packageRepo.save(pkg)
  }

  async toggleStatus(id: number, operatorId: number, status: PackageStatus) {
    const pkg = await this.findOne(id, operatorId)
    pkg.status = status
    return this.packageRepo.save(pkg)
  }

  async delete(id: number, operatorId: number) {
    const pkg = await this.findOne(id, operatorId)
    await this.packageRepo.remove(pkg)
    return { message: "Package deleted successfully" }
  }

  async getBookingsForPackage(packageId: number, operatorId: number) {
    const pkg = await this.findOne(packageId, operatorId)
    return pkg.bookings || []
  }

  async getPackagePerformance(packageId: number, operatorId: number) {
    const pkg = await this.packageRepo.findOne({
      where: { id: packageId, operatorId },
      relations: ["bookings"],
    })

    if (!pkg) {
      throw new NotFoundException("Package not found or access denied")
    }

    const totalBookings = pkg.bookings?.length || 0
    const confirmedBookings =
      pkg.bookings?.filter((b) => b.status === "confirmed" || b.status === "fully_paid").length || 0

    const totalRevenue = pkg.bookings?.reduce((sum, b) => sum + Number(b.amountPaid), 0) || 0

    const occupancyRate = pkg.capacity > 0 ? (pkg.booked / pkg.capacity) * 100 : 0

    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return {
      packageId: pkg.id,
      packageTitle: pkg.title,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      availableSlots: pkg.capacity - pkg.booked,
      averageBookingValue: Math.round(averageBookingValue),
      status: pkg.status,
    }
  }
}
