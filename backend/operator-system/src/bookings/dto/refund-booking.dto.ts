import { IsNumber, IsOptional, IsString, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RefundBookingDto {
  @ApiProperty({ description: "Refund amount", required: true })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: "Refund reason", required: false })
  @IsOptional()
  @IsString()
  reason?: string

  @ApiProperty({ description: "Refund method (e.g., bank_transfer, cash)", required: false })
  @IsOptional()
  @IsString()
  method?: string
}
