// src/packages/packages.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PackagesService, CreatePackageDto, UpdatePackageDto } from './packages.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { PackageDto } from '../common/dto/package.dto';

@ApiTags('Operator Packages')
@ApiBearerAuth('JWT-auth')
@Controller('operator/packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Create a new package with images' })
  @ApiBody({
    description: 'Package data + up to 10 images',
    type: CreatePackageDto,
    examples: {
      umrahExample: {
        summary: 'Premium Umrah Package',
        value: {
          title: 'Premium Umrah Ramadan 2026',
          description: '5-star hotels near Haram, VIP transport, guided rituals',
          type: 'vip',
          durationDays: 14,
          capacity: 50,
          price: 6800000,
          depositAmount: 2000000,
          departureDate: '2026-03-10',
          returnDate: '2026-03-24',
          bookingOpensAt: '2026-01-01',
          bookingClosesAt: '2026-02-28',
          destination: 'Makkah',
          itinerary: [
            { day: 1, title: 'Arrival in Makkah', description: 'Hotel check-in and welcome briefing' },
            { day: 2, title: 'Umrah Rituals', description: 'Tawaf and Sa\'i with guide' },
            { day: 14, title: 'Departure', description: 'Transfer to airport' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Package created successfully',
    type: PackageDto,
    example: {
      id: 1,
      title: 'Premium Umrah Ramadan 2026',
      price: 6800000,
      depositAmount: 2000000,
      type: 'vip',
      status: 'draft',
      images: [
        'https://res.cloudinary.com/betasafar/image/upload/v1700000000/packages/umrah1.jpg',
        'https://res.cloudinary.com/betasafar/image/upload/v1700000000/packages/umrah2.jpg',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Makkah', description: 'Hotel check-in and welcome briefing' },
        { day: 2, title: 'Umrah Rituals', description: 'Tawaf and Sa\'i with guide' },
      ],
      allowsInstallment: true,
      createdAt: '2026-01-06T10:00:00.000Z',
    },
  })
  async create(
    @CurrentOperator() operator: { id: number },
    @Body() dto: CreatePackageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.packagesService.create(operator.id, dto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages belonging to the operator' })
  @ApiResponse({
    status: 200,
    description: 'List of operator packages',
    type: [PackageDto],
    example: [
      {
        id: 1,
        title: 'Premium Umrah Ramadan 2026',
        price: 6800000,
        type: 'vip',
        status: 'active',
        capacity: 50,
        bookedSlots: 32,
        departureDate: '2026-03-10',
        allowsInstallment: true,
        images: ['https://res.cloudinary.com/.../umrah1.jpg'],
        createdAt: '2026-01-06T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Family Hajj 2026',
        price: 12000000,
        type: 'standard',
        status: 'draft',
        capacity: 100,
        bookedSlots: 0,
        departureDate: '2026-06-20',
        allowsInstallment: false,
        images: [],
        createdAt: '2026-01-05T14:30:00.000Z',
      },
    ],
  })
  async findAll(@CurrentOperator() operator: { id: number }) {
    return this.packagesService.findAllForOperator(operator.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed information about a specific package' })
  @ApiResponse({
    status: 200,
    description: 'Package details with itinerary and images',
    type: PackageDto,
    example: {
      id: 1,
      title: 'Premium Umrah Ramadan 2026',
      description: 'Luxury experience with 5-star accommodation',
      type: 'vip',
      price: 6800000,
      depositAmount: 2000000,
      durationDays: 14,
      capacity: 50,
      bookedSlots: 32,
      departureDate: '2026-03-10',
      returnDate: '2026-03-24',
      destination: 'Makkah',
      status: 'active',
      images: [
        'https://res.cloudinary.com/betasafar/image/upload/v1700000000/packages/umrah1.jpg',
        'https://res.cloudinary.com/betasafar/image/upload/v1700000000/packages/umrah2.jpg',
      ],
      itinerary: [
        { day: 1, title: 'Arrival', description: 'Airport pickup and hotel check-in' },
        { day: 2, title: 'Umrah Day', description: 'Complete Umrah with guide' },
        { day: 14, title: 'Departure', description: 'Transfer to airport' },
      ],
      allowsInstallment: true,
      createdAt: '2026-01-06T10:00:00.000Z',
      updatedAt: '2026-01-07T12:00:00.000Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Package not found or access denied' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentOperator() operator: { id: number },
  ) {
    return this.packagesService.findOne(id, operator.id);
  }

  // You can add @Put, @Delete similarly with examples if needed
}
