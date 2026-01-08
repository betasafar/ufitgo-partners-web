// src/reports/dto/date-range-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsISO8601 } from 'class-validator';

export class DateRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Start date (ISO format: YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'start must be a valid ISO date' })
  start?: string;

  @ApiPropertyOptional({
    description: 'End date (ISO format: YYYY-MM-DD)',
    example: '2026-01-31',
  })
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'end must be a valid ISO date' })
  end?: string;
}
