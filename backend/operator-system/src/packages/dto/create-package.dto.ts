// src/packages/dto/create-package.dto.ts
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  ValidateNested,
  IsInt,
} from "class-validator"
import { Type } from "class-transformer"
import { PackageType, PackageStatus } from "../entities/package.entity"

export class CreatePackageDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsEnum(PackageType)
  type: PackageType

  @IsNumber({}, { message: "Price must be a valid number" })
  @Min(0)
  @Type(() => Number) // ← Critical: converts string to number
  price: number

  @IsInt({ message: "Duration must be a whole number of days" })
  @Min(1)
  @Type(() => Number)
  duration: number

  @IsInt({ message: "Capacity must be a whole number" })
  @Min(1)
  @Type(() => Number)
  capacity: number

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]

  @IsOptional()
  @IsDateString()
  departureDate?: string

  @IsOptional()
  @IsDateString()
  returnDate?: string
}