// src/profile/profile.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UpdateProfileDto } from '../common/dto/update-profile.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Operator Profile')
@ApiBearerAuth('JWT-auth')  // If you're using JWT auth
@Controller('operator/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get operator profile' })
  @ApiQuery({ name: 'operatorId', type: Number })
  @ApiResponse({ status: 200, description: 'Operator profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Operator not found' })
  async getProfile(@Query('operatorId', ParseIntPipe) operatorId: number) {
    return this.profileService.getProfile(operatorId);
  }

  @Put()
  @ApiOperation({ summary: 'Update operator profile' })
  @ApiQuery({ name: 'operatorId', type: Number })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async updateProfile(
    @Query('operatorId', ParseIntPipe) operatorId: number,
    @Body() updateData: UpdateProfileDto,  // Now properly typed and validated
  ) {
    return this.profileService.updateProfile(operatorId, updateData);
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Upload operator logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Logo image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  
  @ApiQuery({ name: 'operatorId', type: Number })
  @ApiResponse({ status: 200, description: 'Logo uploaded and updated successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded or invalid file' })
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Query('operatorId', ParseIntPipe) operatorId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No logo file provided');
    }

    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'betasafar/operators/logos',
    );

    return this.profileService.uploadLogo(operatorId, uploadResult.secure_url);
  }

  @Get('verification-status')
  @ApiOperation({ summary: 'Get operator verification status' })
  @ApiQuery({ name: 'operatorId', type: Number })
  @ApiResponse({ status: 200, description: 'Verification status retrieved' })
  async getVerificationStatus(@Query('operatorId', ParseIntPipe) operatorId: number) {
    return this.profileService.getVerificationStatus(operatorId);
  }
}
