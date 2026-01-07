// src/packages/packages.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package, PackageStatus, PackageType } from './entities/package.entity'
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'
import { BookingStatus } from '../bookings/entities/booking.entity'; // Assuming you have this
import {
  PackagePerformanceMetricDto,
  AggregatePerformanceResponseDto,
} from './dto/performance.dto';

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
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
    private readonly cloudinaryService: CloudinaryService,
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

  async getAllPackagesPerformance(operatorId: number) {
    // Fetch all packages with their bookings in one query
    const packages = await this.packageRepo.find({
      where: { operatorId },
      relations: ["bookings"],
      order: { createdAt: "DESC" },
    })

    if (packages.length === 0) {
      return {
        operatorId,
        totalPackages: 0,
        activePackages: 0,
        draftPackages: 0,
        totalCapacity: 0,
        totalBookedSlots: 0,
        overallOccupancyRate: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        averagePackagePrice: 0,
        topPerformingPackages: [],
        summaryDate: new Date().toISOString(),
      }
    }

    let totalCapacity = 0
    let totalBookedSlots = 0
    let totalBookings = 0
    let confirmedBookings = 0
    let pendingBookings = 0
    let cancelledBookings = 0
    let totalRevenue = 0
    let totalPriceSum = 0

    const packagePerformances = packages.map((pkg) => {
      const bookings = pkg.bookings || []

      const pkgConfirmed = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "fully_paid"
      ).length

      const pkgPending = bookings.filter((b) => b.status === "pending").length
      const pkgCancelled = bookings.filter((b) => b.status === "cancelled").length // adjust if different

      const pkgRevenue = bookings.reduce((sum, b) => sum + Number(b.amountPaid || 0), 0)

      const occupancy = pkg.capacity > 0 ? (pkg.booked / pkg.capacity) * 100 : 0

      totalCapacity += pkg.capacity
      totalBookedSlots += pkg.booked
      totalBookings += bookings.length
      confirmedBookings += pkgConfirmed
      pendingBookings += pkgPending
      cancelledBookings += pkgCancelled
      totalRevenue += pkgRevenue
      totalPriceSum += pkg.price

      return {
        packageId: pkg.id,
        title: pkg.title,
        status: pkg.status,
        price: pkg.price,
        capacity: pkg.capacity,
        booked: pkg.booked,
        available: pkg.capacity - pkg.booked,
        occupancyRate: Number(occupancy.toFixed(1)),
        totalBookings: bookings.length,
        confirmedBookings: pkgConfirmed,
        revenue: Number(pkgRevenue.toFixed(2)),
      }
    })

    const activePackages = packages.filter((p) => p.status === PackageStatus.ACTIVE).length
    const draftPackages = packages.filter((p) => p.status === PackageStatus.DRAFT).length

    const overallOccupancyRate =
      totalCapacity > 0 ? Number(((totalBookedSlots / totalCapacity) * 100).toFixed(1)) : 0

    const averagePackagePrice = Number((totalPriceSum / packages.length).toFixed(2))

    // Top 5 performing packages by revenue
    const topPerformingPackages = packagePerformances
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return {
      operatorId,
      summaryDate: new Date().toISOString(),
      totalPackages: packages.length,
      activePackages,
      draftPackages,
      totalCapacity,
      totalBookedSlots,
      availableSlots: totalCapacity - totalBookedSlots,
      overallOccupancyRate,
      totalBookings,
      bookingsByStatus: {
        confirmed: confirmedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
      },
      cancellationRate:
        totalBookings > 0 ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1)) : 0,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      averageRevenuePerPackage:
        packages.length > 0 ? Number((totalRevenue / packages.length).toFixed(2)) : 0,
      averagePackagePrice,
      averageBookingValue: totalBookings > 0 ? Number((totalRevenue / totalBookings).toFixed(2)) : 0,
      topPerformingPackages,
    }
  }

  async getPackagePerformance(packageId: number, operatorId: number) {
  const pkg = await this.packageRepo.findOne({
    where: { id: packageId, operatorId },
    relations: ["bookings"],
  });

  if (!pkg) {
    throw new NotFoundException("Package not found or access denied");
  }

  const bookings = pkg.bookings || [];

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.FULLY_PAID
  ).length;

  const pendingBookings = bookings.filter((b) => b.status === BookingStatus.PENDING).length;

  const cancelledBookings = bookings.filter((b) => b.status === BookingStatus.CANCELLED).length; // Adjust status name if different

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.amountPaid || 0), 0);

  const occupancyRate = pkg.capacity > 0 ? (pkg.booked / pkg.capacity) * 100 : 0;

  const availableSlots = pkg.capacity - pkg.booked;

  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const revenuePerSlot = pkg.capacity > 0 ? totalRevenue / pkg.capacity : 0;

  const projectedRevenue = pkg.price * pkg.capacity; // If sold out at full price

  const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

  return {
    packageId: pkg.id,
    packageTitle: pkg.title,
    price: pkg.price,
    capacity: pkg.capacity,
    bookedSlots: pkg.booked,
    availableSlots,
    occupancyRate: Number(occupancyRate.toFixed(1)),
    totalBookings,
    bookingsByStatus: {
      pending: pendingBookings,
      confirmed: confirmedBookings,
      cancelled: cancelledBookings,
    },
    cancellationRate: Number(cancellationRate.toFixed(1)),
    totalRevenue: Number(totalRevenue.toFixed(2)),
    averageBookingValue: Number(averageBookingValue.toFixed(2)),
    revenuePerAvailableSlot: Number(revenuePerSlot.toFixed(2)),
    projectedTotalRevenue: Number(projectedRevenue.toFixed(2)),
    status: pkg.status,
    departureDate: pkg.departureDate,
    returnDate: pkg.returnDate,
  };
}

  async getPackageAvailability(packageId: number, operatorId: number) {
    const pkg = await this.packageRepo.findOne({
      where: { id: packageId, operatorId },
      relations: ["bookings"],
    })

    if (!pkg) {
      throw new NotFoundException("Package not found or access denied")
    }

    const totalSlots = pkg.capacity
    const bookedSlots = pkg.booked
    const availableSlots = totalSlots - bookedSlots
    const occupancyPercentage = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0

    // Calculate slots by status
    const pendingSlots =
      pkg.bookings?.filter((b) => b.status === "pending").reduce((sum, b) => sum + b.numberOfPilgrims, 0) || 0
    const confirmedSlots =
      pkg.bookings
        ?.filter((b) => b.status === "confirmed" || b.status === "fully_paid")
        .reduce((sum, b) => sum + b.numberOfPilgrims, 0) || 0

    return {
      packageId: pkg.id,
      packageTitle: pkg.title,
      totalSlots,
      bookedSlots,
      availableSlots,
      occupancyPercentage: Math.round(occupancyPercentage * 10) / 10,
      pendingSlots,
      confirmedSlots,
      status: pkg.status,
      departureDate: pkg.departureDate,
      returnDate: pkg.returnDate,
      isFullyBooked: availableSlots <= 0,
      bookingStatus: availableSlots <= 0 ? "full" : availableSlots < 10 ? "filling_fast" : "available",
    }
  }

async getAggregatePerformance(operatorId: number) {
  const packages = await this.packageRepo.find({
    where: { operatorId },
    relations: ["bookings"],
  })

  let totalRevenue = 0
  let totalBookings = 0
  let totalCapacity = 0
  let totalBooked = 0
  let totalCancelled = 0
  let totalPending = 0
  let totalConfirmed = 0

  // Explicitly type the array
  const packageMetrics: PackagePerformanceMetricDto[] = []

  for (const pkg of packages) {
    const bookings = pkg.bookings || []
    const pkgTotalBookings = bookings.length
    const pkgRevenue = bookings.reduce((sum, b) => sum + Number(b.amountPaid || 0), 0)
    const pkgCancelled = bookings.filter((b) => b.status === BookingStatus.CANCELLED).length
    const pkgPending = bookings.filter((b) => b.status === BookingStatus.PENDING).length
    const pkgConfirmed = bookings.filter(
      (b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.FULLY_PAID,
    ).length

    totalRevenue += pkgRevenue
    totalBookings += pkgTotalBookings
    totalCapacity += pkg.capacity
    totalBooked += pkg.booked
    totalCancelled += pkgCancelled
    totalPending += pkgPending
    totalConfirmed += pkgConfirmed

    packageMetrics.push({
      id: pkg.id,
      title: pkg.title,
      status: pkg.status,
      capacity: pkg.capacity,
      booked: pkg.booked,
      available: pkg.capacity - pkg.booked,
      revenue: Number(pkgRevenue.toFixed(2)),
      bookings: pkgTotalBookings,
      occupancyRate: pkg.capacity > 0 ? Number(((pkg.booked / pkg.capacity) * 100).toFixed(1)) : 0,
      departureDate: pkg.departureDate, // optional, so ? is correct
    })
  }

  const overallOccupancyRate = totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0
  const conversionRate = totalBookings > 0 ? (totalConfirmed / totalBookings) * 100 : 0
  const cancellationRate = totalBookings > 0 ? (totalCancelled / totalBookings) * 100 : 0
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

  const activePackages = packages.filter((p) => p.status === PackageStatus.ACTIVE).length

  return {
    summary: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalBookings,
      totalCapacity,
      totalBooked,
      availableSlots: totalCapacity - totalBooked,
      occupancyRate: Number(overallOccupancyRate.toFixed(1)),
      conversionRate: Number(conversionRate.toFixed(1)),
      cancellationRate: Number(cancellationRate.toFixed(1)),
      averageBookingValue: Number(averageBookingValue.toFixed(2)),
      activePackages,
      totalPackages: packages.length,
      bookingsByStatus: {
        pending: totalPending,
        confirmed: totalConfirmed,
        cancelled: totalCancelled,
      },
    },
    packages: packageMetrics.sort((a, b) => b.revenue - a.revenue),
  }  as AggregatePerformanceResponseDto;
}
}
