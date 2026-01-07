import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { Operator } from './entities/operator.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { EmailService } from '../common/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, WalletTransaction]),
  ],
  controllers: [AdminController],
  providers: [AdminService, EmailService],
  exports: [AdminService],
})
export class AdminModule {}
