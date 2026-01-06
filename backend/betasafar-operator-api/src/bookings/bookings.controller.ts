// src/bookings/bookings.controller.ts
import { Controller, Get, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CurrentOperator } from '../common/decorators/current-operator.decorator';
import { BookingDto } from '../common/dto/booking.dto';
// In your BookingsController
import { AdjustPaymentDto } from './dto/adjust-payment.dto';
import { ApiTags, ApiOperation, ApiProperty, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

// class AdjustPaymentDto {
//   @ApiProperty({
//     description: 'New amount paid (in NGN)',
//     example: 3500000,
//     nullable: true,
//   })
//   amountPaid?: number;

//   @ApiProperty({
//     description: 'Update booking status',
//     enum: ['pending', 'deposit_paid', 'fully_paid', 'confirmed', 'cancelled', 'completed'],
//     example: 'confirmed',
//     nullable: true,
//   })
//   status?: string;

//   @ApiProperty({
//     description: 'Additional payment details (e.g., transaction reference)',
//     example: { gateway: 'Paystack', reference: 'PAY_20260107_789' },
//     nullable: true,
//   })
//   paymentDetails?: Record<string, any>;
// }

@ApiTags('Operator Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('operator/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bookings for the authenticated operator' })
  @ApiResponse({
    status: 200,
    description: 'List of bookings returned successfully',
    type: [BookingDto],
    example: [
      {
        id: 101,
        pilgrimName: 'Ahmad Yusuf',
        pilgrimPhone: '+2348012345678',
        pilgrimEmail: 'ahmad@example.com',
        numberOfPilgrims: 4,
        totalAmount: 27200000,
        amountPaid: 8000000,
        status: 'deposit_paid',
        packageId: 1,
        operatorId: 1,
        userId: 5,
        createdAt: '2026-01-06T10:00:00.000Z',
        updatedAt: '2026-01-06T12:30:00.000Z',
      },
    ],
  })
  async listBookings(@CurrentOperator() operator: { id: number }) {
    return this.bookingsService.findAllForOperator(operator.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed information about a specific booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking details returned',
    type: BookingDto,
    example: {
      id: 101,
      pilgrimName: 'Fatima Ali',
      pilgrimPhone: '+2348022222222',
      pilgrimEmail: 'fatima@example.com',
      numberOfPilgrims: 2,
      totalAmount: 11000000,
      amountPaid: 11000000,
      status: 'fully_paid',
      paymentDetails: { gateway: 'Paystack', reference: 'PAY_20260105_456' },
      package: {
        id: 2,
        title: 'Deluxe Umrah April 2026',
        price: 5500000,
      },
      operator: {
        id: 1,
        companyName: 'Elite Travels',
      },
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-06T09:15:00.000Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Booking not found or access denied' })
  async getBookingDetails(
    @Param('id', ParseIntPipe) id: number,
    @CurrentOperator() operator: { id: number },
  ) {
    return this.bookingsService.findOne(id, operator.id);
  }

  @Put(':id/adjust-payment')
  @ApiOperation({ summary: 'Adjust payment amount or update booking status' })
  @ApiBody({ type: AdjustPaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: BookingDto,
  })
  async adjustPayment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentOperator() operator: { id: number },
    @Body() body: AdjustPaymentDto,
  ) {
    return this.bookingsService.adjustPayment(id, operator.id, body);
  }
}