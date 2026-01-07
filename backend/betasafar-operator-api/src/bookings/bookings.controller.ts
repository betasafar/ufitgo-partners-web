// src/bookings/bookings.controller.ts
import { Controller, Get, Put, Post, Body } from "@nestjs/common"
import type { BookingsService } from "./bookings.service"
import { BookingDto } from "../common/dto/booking.dto"
import { AdjustPaymentDto } from "./dto/adjust-payment.dto"
import { ApproveBookingDto } from "./dto/approve-booking.dto"
import { RejectBookingDto } from "./dto/reject-booking.dto"
import { RefundBookingDto } from "./dto/refund-booking.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger"

@ApiTags("Operator Bookings")
@ApiBearerAuth("JWT-auth")
@Controller("operator/bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: "List all bookings for the authenticated operator" })
  @ApiResponse({ status: 200, description: "List of bookings returned successfully", type: [BookingDto] })
  async listBookings() {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.findAllForOperator(operator.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed information about a specific booking" })
  @ApiResponse({ status: 200, description: "Booking details returned", type: BookingDto })
  @ApiResponse({ status: 404, description: "Booking not found or access denied" })
  async getBookingDetails(id: string) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.findOne(Number(id), operator.id)
  }

  @Put(":id/adjust-payment")
  @ApiOperation({ summary: "Adjust payment amount or update booking status" })
  @ApiBody({ type: AdjustPaymentDto })
  @ApiResponse({ status: 200, description: "Booking updated successfully", type: BookingDto })
  async adjustPayment(id: string, @Body() body: AdjustPaymentDto) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.adjustPayment(Number(id), operator.id, body)
  }

  @Get("urgent-tasks")
  @ApiOperation({ summary: "Get urgent tasks requiring attention" })
  @ApiResponse({ status: 200, description: "Urgent tasks returned" })
  async getUrgentTasks() {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.getUrgentTasks(operator.id)
  }

  @Get("recent")
  @ApiOperation({ summary: "Get recent travelers" })
  @ApiResponse({ status: 200, description: "Recent travelers returned" })
  async getRecentTravelers() {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.getRecentTravelers(operator.id, 5)
  }

  @Get(":id/detailed")
  @ApiOperation({ summary: "Get detailed booking information with payment progress" })
  @ApiResponse({ status: 200, description: "Detailed booking information" })
  async getBookingDetailed(id: string) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.findOneDetailed(Number(id), operator.id)
  }

  @Post(":id/approve")
  @ApiOperation({ summary: "Approve a pending booking" })
  @ApiBody({ type: ApproveBookingDto })
  @ApiResponse({ status: 200, description: "Booking approved successfully", type: BookingDto })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async approveBooking(id: string, @Body() dto: ApproveBookingDto) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.approveBooking(Number(id), operator.id, dto)
  }

  @Post(":id/reject")
  @ApiOperation({ summary: "Reject a pending booking" })
  @ApiBody({ type: RejectBookingDto })
  @ApiResponse({ status: 200, description: "Booking rejected successfully", type: BookingDto })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async rejectBooking(id: string, @Body() dto: RejectBookingDto) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.rejectBooking(Number(id), operator.id, dto)
  }

  @Post(":id/refund")
  @ApiOperation({ summary: "Process a refund for a booking" })
  @ApiBody({ type: RefundBookingDto })
  @ApiResponse({ status: 200, description: "Refund processed successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({ status: 400, description: "Invalid refund amount" })
  async refundBooking(id: string, @Body() dto: RefundBookingDto) {
    const operator = { id: 1 } // TODO: Get from @CurrentOperator() decorator
    return this.bookingsService.processRefund(Number(id), operator.id, dto)
  }
}
