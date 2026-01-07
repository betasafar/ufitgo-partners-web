// src/admin/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'passwordHash'], // Explicit select
    });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: admin.id, email: admin.email, role: 'admin' };

    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  }

  async changePassword(adminId: number, dto: ChangePasswordDto) {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
      select: ['id', 'passwordHash'],
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Optional: Prevent reusing the same password
    const isSameAsCurrent = await bcrypt.compare(dto.newPassword, admin.passwordHash);
    if (isSameAsCurrent) {
      throw new BadRequestException('New password must be different from current');
    }

    const hash = await bcrypt.hash(dto.newPassword, 12); // Use 12 rounds in 2026
    await this.adminRepo.update(adminId, { passwordHash: hash });

    return { success: true, message: 'Password changed successfully' };
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminRepo.findOne({ where: { id } });
  }
}
