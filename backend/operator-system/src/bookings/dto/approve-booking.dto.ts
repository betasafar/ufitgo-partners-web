import { IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ApproveBookingDto {
  @ApiProperty({ description: "Optional notes for approval", required: false })
  @IsOptional()
  @IsString()
  notes?: string
}
