// src/admin/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Admin } from '../entities/admin.entity';

class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty()
  admin: {
    id: number;
    email: string;
    name: string;
  };
}

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Get admin API health status' })
  async health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: LoginResponse, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Validation errors (missing/invalid fields)' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto.email, dto.password);
    } catch (error) {
      // Handle authentication-specific errors (wrong password, user not found, etc.)
      throw new BadRequestException({
        success: false,
        message: 'Invalid email or password',
      });
    }
  }

  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change admin password' })
  async changePassword(
    @Req() req: Request & { user: Admin },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }
}