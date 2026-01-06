// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operators/entities/operator.entity';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.OPERATOR_JWT_SECRET, // or keep configService if preferred
        signOptions: { expiresIn: '7d' },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}