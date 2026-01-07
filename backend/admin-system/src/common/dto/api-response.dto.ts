import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
    additionalProperties: true,  // This is required for generic objects
    description: 'Response data (generic)',
  } as ApiPropertyOptions)
  data?: T;
}
