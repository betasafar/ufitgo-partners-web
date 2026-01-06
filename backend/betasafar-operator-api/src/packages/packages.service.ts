// src/packages/packages.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package, PackageType, PackageStatus } from './entities/package.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

export class CreatePackageDto {
  title: string;
  description: string;
  type: PackageType;  // ← Change to enum (we'll validate in controller)
  durationDays: number;
  capacity: number;
  price: number;
  depositAmount?: number;
  departureDate: string; // ISO string
  returnDate: string;
  bookingOpensAt?: string;
  bookingClosesAt?: string;
  itinerary: Array<{ day: number; title: string; description: string }>;
  images?: string[];
}

export class UpdatePackageDto {
  title?: string;
  description?: string;
  type?: PackageType;
  durationDays?: number;
  capacity?: number;
  price?: number;
  depositAmount?: number;
  departureDate?: string;
  returnDate?: string;
  bookingOpensAt?: string;
  bookingClosesAt?: string;
  itinerary?: Array<{ day: number; title: string; description: string }>;
  images?: string[];
  status?: PackageStatus;
}

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepo: Repository<Package>,
    private cloudinaryService: CloudinaryService, // ← Add this
  ) {}

 async create(
    operatorId: number,
    dto: CreatePackageDto,
    files?: Array<Express.Multer.File>, // ← Add files parameter
  ) {
    let imageUrls: string[] = dto.images || [];

    // Upload images if provided
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => 
        this.cloudinaryService.uploadFile(file)
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);
    }

    const pkg = this.packageRepo.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      durationDays: dto.durationDays,
      capacity: dto.capacity,
      price: dto.price,
      depositAmount: dto.depositAmount,
      departureDate: new Date(dto.departureDate),
      returnDate: new Date(dto.returnDate),
      bookingOpensAt: dto.bookingOpensAt ? new Date(dto.bookingOpensAt) : undefined,
      bookingClosesAt: dto.bookingClosesAt ? new Date(dto.bookingClosesAt) : undefined,
      itinerary: dto.itinerary || [],
      images: imageUrls,
      operatorId,
      status: PackageStatus.DRAFT,
      bookedSlots: 0,
    });

    return this.packageRepo.save(pkg);
  }

  async findAllForOperator(operatorId: number) {
    return this.packageRepo.find({
      where: { operatorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, operatorId: number) {
    const pkg = await this.packageRepo.findOne({
      where: { id, operatorId },
      relations: ['bookings'],
    });

    if (!pkg) {
      throw new NotFoundException('Package not found or access denied');
    }

    return pkg;
  }

  async update(id: number, operatorId: number, dto: Partial<UpdatePackageDto>) {
    const pkg = await this.findOne(id, operatorId);

    // Manually map only allowed fields
    if (dto.title !== undefined) pkg.title = dto.title;
    if (dto.description !== undefined) pkg.description = dto.description;
    if (dto.type !== undefined) pkg.type = dto.type;
    if (dto.durationDays !== undefined) pkg.durationDays = dto.durationDays;
    if (dto.capacity !== undefined) pkg.capacity = dto.capacity;
    if (dto.price !== undefined) pkg.price = dto.price;
    if (dto.depositAmount !== undefined) pkg.depositAmount = dto.depositAmount;
    if (dto.departureDate !== undefined) pkg.departureDate = new Date(dto.departureDate);
    if (dto.returnDate !== undefined) pkg.returnDate = new Date(dto.returnDate);
    if (dto.bookingOpensAt !== undefined) pkg.bookingOpensAt = dto.bookingOpensAt ? new Date(dto.bookingOpensAt) : undefined;
    if (dto.bookingClosesAt !== undefined) pkg.bookingClosesAt = dto.bookingClosesAt ? new Date(dto.bookingClosesAt) : undefined;
    if (dto.itinerary !== undefined) pkg.itinerary = dto.itinerary;
    if (dto.images !== undefined) pkg.images = dto.images;
    if (dto.status !== undefined) pkg.status = dto.status;

    return this.packageRepo.save(pkg);
  }

  async toggleStatus(id: number, operatorId: number, status: PackageStatus) {
    const pkg = await this.findOne(id, operatorId);
    pkg.status = status;
    return this.packageRepo.save(pkg);
  }

  async delete(id: number, operatorId: number) {
    const pkg = await this.findOne(id, operatorId);
    await this.packageRepo.remove(pkg);
    return { message: 'Package deleted successfully' };
  }

  async getBookingsForPackage(packageId: number, operatorId: number) {
    const pkg = await this.findOne(packageId, operatorId);
    return pkg.bookings || [];
  }

}
