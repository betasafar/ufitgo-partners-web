// src/reports/dto/popular-packages-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PopularPackagesQueryDto {
  @ApiPropertyOptional({
    description: 'Number of top packages to return',
    example: 5,
    minimum: 1,
    maximum: 20,
    default: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 5;
}