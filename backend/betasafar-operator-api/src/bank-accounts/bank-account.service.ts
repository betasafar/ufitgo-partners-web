// src/bank-accounts/bank-account.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Operator } from '../operators/entities/operator.entity';

@Injectable()
export class BankAccountService {
  private readonly paystackSecret: string;

  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(Operator)
    private operatorRepo: Repository<Operator>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secret) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured in environment');
    }
    this.paystackSecret = secret; // Now safe: secret is guaranteed to be string
  }

  async addAndVerify(operatorId: number, dto: { accountNumber: string; bankCode: string }) {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operator not found');

    // Step 1: Resolve account name
    const resolveRes = await firstValueFrom(
      this.httpService.get('https://api.paystack.co/bank/resolve', {
        params: { account_number: dto.accountNumber, bank_code: dto.bankCode },
        headers: { Authorization: `Bearer ${this.paystackSecret}` },
      }),
    );

    if (!resolveRes.data.status) {
      throw new BadRequestException('Invalid account number or bank code');
    }

    const accountName = resolveRes.data.data.account_name;

    // Step 2: Compare with company name (fuzzy match)
    const companyNorm = operator.companyName.toLowerCase().trim();
    const accountNorm = accountName.toLowerCase().trim();

    const similarity = this.stringSimilarity(companyNorm, accountNorm);
    if (similarity < 0.75) {
      throw new BadRequestException(
        `Account name "${accountName}" does not match company name "${operator.companyName}" (similarity: ${(similarity * 100).toFixed(0)}%)`,
      );
    }

    // Step 3: Create transfer recipient
    const recipientRes = await firstValueFrom(
      this.httpService.post(
        'https://api.paystack.co/transferrecipient',
        {
          type: 'nuban',
          name: accountName,
          account_number: dto.accountNumber,
          bank_code: dto.bankCode,
          currency: 'NGN',
        },
        { headers: { Authorization: `Bearer ${this.paystackSecret}` } },
      ),
    );

    if (!recipientRes.data.status) {
      throw new BadRequestException('Failed to create Paystack recipient');
    }

    const recipientCode = recipientRes.data.data.recipient_code;

    // Step 4: Save verified account (replace old one)
    await this.bankAccountRepo.delete({ operatorId });

    const bankAccount = this.bankAccountRepo.create({
      operatorId,
      bankCode: dto.bankCode,
      bankName: resolveRes.data.data.bank_name || 'Unknown Bank',
      accountNumber: dto.accountNumber,
      accountName,
      recipientCode,
      isVerified: true,
    });

    return this.bankAccountRepo.save(bankAccount);
  }

  async getVerifiedAccount(operatorId: number): Promise<BankAccount | null> {
    return this.bankAccountRepo.findOne({
      where: { operatorId, isVerified: true },
    });
  }

  // Simple fuzzy string similarity
  private stringSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - this.editDistance(longer, shorter)) / longer.length;
  }

  private editDistance(s1: string, s2: string): number {
    const costs = new Array(s2.length + 1);
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(newValue, lastValue, costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}