// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator, OperatorVerificationStatus } from '../operators/entities/operator.entity';
import { EmailService } from '../common/email/email.service'; // ← Added
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepo: Repository<Operator>,
    private jwtService: JwtService,
    private emailService: EmailService, // ← Injected
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.operatorRepo.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });

    if (existing) {
      throw new ConflictException('Email or phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const operator = this.operatorRepo.create({
      companyName: dto.companyName,
      email: dto.email,
      phone: dto.phone,
      cacNumber: dto.cacNumber,
      passwordHash,
      verificationStatus: OperatorVerificationStatus.PENDING,
    });

    const savedOperator = await this.operatorRepo.save(operator);

    // Remove sensitive data
    const { passwordHash: _, ...safeOperator } = savedOperator;

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(savedOperator.email, savedOperator.companyName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // We don't throw here — registration succeeded, email is non-critical
    }

    return {
      message: 'Operator registered successfully. Awaiting admin verification.',
      operator: safeOperator,
    };
  }

  async login(dto: LoginDto) {
    const operator = await this.operatorRepo.findOne({
      where: { email: dto.email },
    });

    if (!operator) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, operator.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: operator.id,
      email: operator.email,
      role: 'operator',
      verificationStatus: operator.verificationStatus,
    };

    return {
      access_token: this.jwtService.sign(payload),
      operator: {
        id: operator.id,
        email: operator.email,
        companyName: operator.companyName,
        verificationStatus: operator.verificationStatus,
      },
    };
  }

  async logout() {
    // For JWT, logout is handled client-side by removing the token
    
    return;
  }

  async findById(id: number): Promise<Operator> {
    const operator = await this.operatorRepo.findOne({ where: { id } });
    if (!operator) throw new UnauthorizedException('Operator not found');
    return operator;
  }
}
