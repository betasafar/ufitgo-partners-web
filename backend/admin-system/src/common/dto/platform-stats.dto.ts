import { ApiProperty } from '@nestjs/swagger';

export class PlatformStatsDto {
  @ApiProperty({ example: 156 })
  totalOperators: number;

  @ApiProperty({ example: 98 })
  approvedOperators: number;

  @ApiProperty({ example: 58 })
  pendingOperators: number;

  @ApiProperty({ example: 45000000 })
  totalPlatformRevenue: number;

  @ApiProperty({ example: 12000000 })
  pendingPayouts: number;
}
