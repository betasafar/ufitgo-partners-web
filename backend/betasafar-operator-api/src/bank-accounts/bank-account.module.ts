// src/bank-accounts/bank-account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { BankAccount } from './entities/bank-account.entity';
import { Operator } from '../operators/entities/operator.entity'; // ← ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([BankAccount, Operator]), // ← ADD Operator here
    HttpModule,
  ],
  controllers: [BankAccountController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}