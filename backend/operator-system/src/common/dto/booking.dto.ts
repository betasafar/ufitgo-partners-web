// betasafar-operator-nestjs/src/common/dto/booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty({ example: 456 })
  id: number;

  @ApiProperty({ example: 'Ahmad Yusuf' })
  pilgrimName: string;

  @ApiProperty({ example: '+2348012345678' })
  pilgrimPhone: string;

  @ApiProperty({ example: 4 })
  numberOfPilgrims: number;

  @ApiProperty({ example: 1800000 })
  totalAmount: number;

  @ApiProperty({ example: 1800000 })
  amountPaid: number;

  @ApiProperty({ example: 'fully_paid', enum: ['pending', 'deposit_paid', 'fully_paid', 'confirmed', 'cancelled', 'completed'] })
  status: string;

  @ApiProperty({ example: 'Premium Umrah 2026' })
  packageTitle: string;

  @ApiProperty({ example: '2026-01-20T14:22:00.000Z' })
  createdAt: Date;
}
