// src/profile/dto/update-profile.dto.ts
import { IsString, IsOptional, IsUrl, IsPhoneNumber, Length, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Company name of the operator' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Short description about the company' })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @ApiPropertyOptional({ description: 'Contact phone number (international format)' })
  @IsOptional()
  @IsPhoneNumber()  // Validates international format like +966...
  phone?: string;

  @ApiPropertyOptional({ description: 'Contact or business email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Company website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Address of the company' })
  @IsOptional()
  @IsString()
  @Length(5, 200)
  address?: string;

  @ApiPropertyOptional({ description: 'City where the operator is based' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Country of operation' })
  @IsOptional()
  @IsString()
  country?: string;
}
