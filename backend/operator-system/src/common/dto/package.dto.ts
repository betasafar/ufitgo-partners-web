// betasafar-operator-nestjs/src/common/dto/package.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PackageDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: 'Premium Umrah 2026' })
  title: string;

  @ApiProperty({ example: '14 days in Makkah & Madinah with 5-star hotels' })
  description: string;

  @ApiProperty({ example: 'vip', enum: ['economy', 'standard', 'vip'] })
  type: string;

  @ApiProperty({ example: 14 })
  durationDays: number;

  @ApiProperty({ example: 50 })
  capacity: number;

  @ApiProperty({ example: 8 })
  bookedSlots: number;

  @ApiProperty({ example: 450000 })
  price: number;

  @ApiProperty({ example: 150000, required: false })
  depositAmount?: number;

  @ApiProperty({ example: '2026-03-15' })
  departureDate: string;

  @ApiProperty({ example: '2026-03-29' })
  returnDate: string;

  @ApiProperty({ example: 'active', enum: ['draft', 'active', 'paused', 'closed'] })
  status: string;

  @ApiProperty({ type: [String], example: ['https://cloudinary.com/img1.jpg'] })
  images: string[];

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  createdAt: Date;
}
