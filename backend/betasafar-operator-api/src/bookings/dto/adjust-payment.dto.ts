// src/bookings/dto/adjust-payment.dto.ts
import { IsOptional, IsEnum, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class AdjustPaymentDto {
  @ApiProperty({
    description: 'Amount paid so far (in kobo or NGN depending on your system)',
    example: 3500000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @ApiProperty({
    description: 'Update booking status',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Additional payment details from gateway',
    example: { gateway: 'Paystack', reference: 'ref_1234567890' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  paymentDetails?: Record<string, any>;
}