// src/bookings/bookings.controller.ts
import { Controller, Get, Put, Param, Body, ParseIntPipe, Query } from "@nestjs/common"
import type { BookingsService } from "./bookings.service"
import { BookingDto } from "../common/dto/booking.dto"
import { AdjustPaymentDto } from "./dto/adjust-payment.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger"

@ApiTags("Operator Bookings")
@ApiBearerAuth("JWT-auth")
@Controller("operator/bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: "List all bookings for the authenticated operator" })
  @ApiResponse({ status: 200, description: "List of bookings returned successfully", type: [BookingDto] })
  async listBookings(operator: { id: number }) {
    return this.bookingsService.findAllForOperator(operator.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed information about a specific booking" })
  @ApiResponse({ status: 200, description: "Booking details returned", type: BookingDto })
  @ApiResponse({ status: 404, description: "Booking not found or access denied" })
  async getBookingDetails(operator: { id: number }, @Param("id", ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id, operator.id)
  }

  @Put(":id/adjust-payment")
  @ApiOperation({ summary: "Adjust payment amount or update booking status" })
  @ApiBody({ type: AdjustPaymentDto })
  @ApiResponse({ status: 200, description: "Booking updated successfully", type: BookingDto })
  async adjustPayment(operator: { id: number }, @Param("id", ParseIntPipe) id: number, @Body() body: AdjustPaymentDto) {
    return this.bookingsService.adjustPayment(id, operator.id, body)
  }

  @Get("urgent-tasks")
  @ApiOperation({ summary: "Get urgent tasks requiring attention" })
  @ApiResponse({ status: 200, description: "Urgent tasks returned" })
  async getUrgentTasks(operator: { id: number }) {
    return this.bookingsService.getUrgentTasks(operator.id)
  }

  @Get("recent")
  @ApiOperation({ summary: "Get recent travelers" })
  @ApiResponse({ status: 200, description: "Recent travelers returned" })
  async getRecentTravelers(operator: { id: number }, @Query("limit", new ParseIntPipe({ optional: true })) limit = 5) {
    return this.bookingsService.getRecentTravelers(operator.id, limit)
  }

  @Get(":id/detailed")
  @ApiOperation({ summary: "Get detailed booking information with payment progress" })
  @ApiResponse({ status: 200, description: "Detailed booking information" })
  async getBookingDetailed(operator: { id: number }, @Param("id", ParseIntPipe) id: number) {
    return this.bookingsService.findOneDetailed(id, operator.id)
  }
}
