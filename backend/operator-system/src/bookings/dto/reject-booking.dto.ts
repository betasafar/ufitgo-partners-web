import { IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RejectBookingDto {
  @ApiProperty({ description: "Reason for rejection", required: true })
  @IsNotEmpty()
  @IsString()
  reason: string
}
