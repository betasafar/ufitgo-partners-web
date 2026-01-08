// src/packages/dto/performance.dto.ts

import { PackageStatus } from '../entities/package.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PackagePerformanceMetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: PackageStatus })
  status: PackageStatus;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  booked: number;

  @ApiProperty()
  available: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  bookings: number;

  @ApiProperty()
  occupancyRate: number;

  @ApiProperty({ required: false })
  departureDate?: Date;
}

export class AggregatePerformanceSummaryDto {
  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalBookings: number;

  @ApiProperty()
  totalCapacity: number;

  @ApiProperty()
  totalBooked: number;

  @ApiProperty()
  availableSlots: number;

  @ApiProperty()
  occupancyRate: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  cancellationRate: number;

  @ApiProperty()
  averageBookingValue: number;

  @ApiProperty()
  activePackages: number;

  @ApiProperty()
  totalPackages: number;

  @ApiProperty({
    type: 'object',
    properties: {
      pending: { type: 'number' },
      confirmed: { type: 'number' },
      cancelled: { type: 'number' },
    },
  })
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export class AggregatePerformanceResponseDto {
  @ApiProperty()
  summary: AggregatePerformanceSummaryDto;

  @ApiProperty({ type: [PackagePerformanceMetricDto] })
  packages: PackagePerformanceMetricDto[];
}
