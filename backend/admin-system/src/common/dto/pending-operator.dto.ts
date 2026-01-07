import { ApiProperty } from '@nestjs/swagger';

export class PendingOperatorDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: 'Elite Hajj Travels Ltd' })
  companyName: string;

  @ApiProperty({ example: 'info@elitehajj.com' })
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  phone: string;

  @ApiProperty({ example: 'RC1234567', required: false })
  cacNumber?: string;

  @ApiProperty({ example: 'pending' })
  verificationStatus: string;

  @ApiProperty({ example: '2026-01-15T10:30:00.000Z' })
  createdAt: Date;
}
