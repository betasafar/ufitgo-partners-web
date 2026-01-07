// src/bookings/bookings.controller.ts
import { Controller, Get, Put, Post, Body, Param, ParseIntPipe } from "@nestjs/common"
import { BookingsService } from "./bookings.service"
import { BookingDto } from "../common/dto/booking.dto"
import { AdjustPaymentDto } from "./dto/adjust-payment.dto"
import { ApproveBookingDto } from "./dto/approve-booking.dto"
import { RejectBookingDto } from "./dto/reject-booking.dto"
import { RefundBookingDto } from "./dto/refund-booking.dto"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger"

@ApiTags("Operator Bookings")
@ApiBearerAuth("JWT-auth")
@Controller("operator/bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: "List all bookings for the authenticated operator" })
  @ApiResponse({ status: 200, description: "List of bookings returned successfully", type: [BookingDto] })
  async listBookings() {
    const operator = { id: 1 }
    return this.bookingsService.findAllForOperator(operator.id)
  }

  // --- STATIC ROUTES FIRST ---

  @Get("urgent-tasks")
  @ApiOperation({ summary: "Get urgent tasks requiring attention" })
  @ApiResponse({ status: 200, description: "Urgent tasks returned" })
  async getUrgentTasks() {
    const operator = { id: 1 }
    return this.bookingsService.getUrgentTasks(operator.id)
  }

  @Get("recent")
  @ApiOperation({ summary: "Get recent travelers" })
  @ApiResponse({ status: 200, description: "Recent travelers returned" })
  async getRecentTravelers() {
    const operator = { id: 1 }
    return this.bookingsService.getRecentTravelers(operator.id, 5)
  }

  // --- PARAM ROUTES AFTER STATIC ROUTES ---

  @Get(":id/detailed")
  @ApiOperation({ summary: "Get detailed booking information with payment progress" })
  @ApiResponse({ status: 200, description: "Detailed booking information" })
  async getBookingDetailed(@Param("id", ParseIntPipe) id: number) {
    const operator = { id: 1 }
    return this.bookingsService.findOneDetailed(id, operator.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed information about a specific booking" })
  @ApiResponse({ status: 200, description: "Booking details returned", type: BookingDto })
  @ApiResponse({ status: 404, description: "Booking not found or access denied" })
  async getBookingDetails(@Param("id", ParseIntPipe) id: number) {
    const operator = { id: 1 }
    return this.bookingsService.findOne(id, operator.id)
  }

  @Put(":id/adjust-payment")
  @ApiOperation({ summary: "Adjust payment amount or update booking status" })
  @ApiBody({ type: AdjustPaymentDto })
  @ApiResponse({ status: 200, description: "Booking updated successfully", type: BookingDto })
  async adjustPayment(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: AdjustPaymentDto,
  ) {
    const operator = { id: 1 }
    return this.bookingsService.adjustPayment(id, operator.id, body)
  }

  @Post(":id/approve")
  @ApiOperation({ summary: "Approve a pending booking" })
  @ApiBody({ type: ApproveBookingDto })
  async approveBooking(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ApproveBookingDto,
  ) {
    const operator = { id: 1 }
    return this.bookingsService.approveBooking(id, operator.id, dto)
  }

  @Post(":id/reject")
  @ApiOperation({ summary: "Reject a pending booking" })
  @ApiBody({ type: RejectBookingDto })
  async rejectBooking(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RejectBookingDto,
  ) {
    const operator = { id: 1 }
    return this.bookingsService.rejectBooking(id, operator.id, dto)
  }

  @Post(":id/refund")
  @ApiOperation({ summary: "Process a refund for a booking" })
  @ApiBody({ type: RefundBookingDto })
  async refundBooking(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RefundBookingDto,
  ) {
    const operator = { id: 1 }
    return this.bookingsService.processRefund(id, operator.id, dto)
  }
}
