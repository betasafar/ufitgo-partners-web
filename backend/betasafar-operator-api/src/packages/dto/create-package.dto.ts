// src/packages/dto/create-package.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString } from "class-validator"
import { PackageType, PackageStatus } from "../entities/package.entity"

export class CreatePackageDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsEnum(PackageType)
  type: PackageType

  @IsNumber()
  price: number

  @IsNumber()
  duration: number

  @IsNumber()
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
