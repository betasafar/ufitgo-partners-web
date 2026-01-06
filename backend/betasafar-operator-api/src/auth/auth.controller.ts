// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiProperty, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'elite@travels.com',
      companyName: 'Elite Travels',
      verificationStatus: 'pending',
    },
  })
  operator: {
    id: number;
    email: string;
    companyName: string;
    verificationStatus: string;
  };
}

class RegisterResponseDto {
  @ApiProperty({ example: 'Operator registered successfully. Awaiting admin verification.' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'elite@travels.com',
      phone: '+2348012345678',
      companyName: 'Elite Travels',
      cacNumber: 'RC123456',
      verificationStatus: 'pending',
      createdAt: '2026-01-06T10:00:00.000Z',
      updatedAt: '2026-01-06T10:00:00.000Z',
    },
  })
  operator: any;
}

@ApiTags('Operator Auth')
@Controller('operator/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check for operator auth service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Post('register')
  @HttpCode(201)
  @Public()
  @ApiOperation({ summary: 'Register a new operator' })
  @ApiBody({
    schema: {
      example: {
        companyName: 'Elite Hajj Travels',
        email: 'elite@travels.com',
        phone: '+2348012345678',
        password: 'SecurePass123!',
        cacNumber: 'RC123456',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Operator registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email or phone already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Login operator and return JWT token' })
  @ApiBody({
    schema: {
      example: {
        email: 'elite@travels.com',
        password: 'SecurePass123!',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout operator (client-side token removal)' })
  @ApiResponse({ status: 200, description: 'Logout instruction' })
  async logout() {
    return { message: 'Logged out successfully — remove JWT token on client side' };
  }
}
