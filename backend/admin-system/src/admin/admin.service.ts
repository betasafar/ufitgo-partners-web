// src/admin/admin.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator, OperatorVerificationStatus } from './entities/operator.entity';
import { WalletTransaction, TransactionType, TransactionStatus } from './entities/wallet-transaction.entity';
import { EmailService } from '../common/email/email.service';
import { PendingOperatorDto } from '../common/dto/pending-operator.dto';
import { PayoutRequestDto, OperatorSummary } from '../common/dto/payout-request.dto';
import { PlatformStatsDto } from '../common/dto/platform-stats.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepo: Repository<Operator>,
    @InjectRepository(WalletTransaction)
    private transactionRepo: Repository<WalletTransaction>,
    private emailService: EmailService,
  ) {}

  async getPendingOperators(): Promise<PendingOperatorDto[]> {
    return this.operatorRepo.find({
      where: { verificationStatus: OperatorVerificationStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async updateVerificationStatus(
    operatorId: number,
    status: 'approved' | 'rejected' | 'under_review',
  ) {
    const operator = await this.operatorRepo.findOne({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operator not found');

    const previous = operator.verificationStatus;
    operator.verificationStatus = OperatorVerificationStatus[
      status.toUpperCase().replace('-', '_')
    ];

    await this.operatorRepo.save(operator);

    if (previous !== operator.verificationStatus) {
      await this.emailService.sendVerificationUpdateEmail(
        operator.email,
        operator.companyName,
        status,
      );
    }

    return operator;
  }

  async getPendingPayouts(): Promise<PayoutRequestDto[]> {
    const transactions = await this.transactionRepo.find({
      where: { type: TransactionType.DEBIT, status: TransactionStatus.PENDING },
      relations: ['operator'],
      order: { createdAt: 'DESC' },
    });

    // Map to DTO with safe operator access
    return transactions.map(tx => ({
      id: tx.id,
      amount: Number(tx.amount),
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt,
      operator: tx.operator
        ? {
            id: tx.operator.id,
            companyName: tx.operator.companyName,
            email: tx.operator.email,
          }
        : { id: 0, companyName: 'Unknown', email: 'unknown@betasafar.app' }, // fallback
    }));
  }

  async approvePayout(id: number): Promise<PayoutRequestDto> {
    const tx = await this.transactionRepo.findOne({
      where: { id },
      relations: ['operator'],
    });

    if (!tx) throw new NotFoundException('Payout not found');
    if (!tx.operator) throw new BadRequestException('Operator not linked');
    if (tx.status !== TransactionStatus.PENDING) throw new BadRequestException('Not pending');

    tx.status = TransactionStatus.COMPLETED;
    await this.transactionRepo.save(tx);

    await this.emailService.sendPayoutRequestEmail(
      tx.operator.email,
      tx.operator.companyName,
      Number(tx.amount),
      tx.id,
    );

    // Return DTO
    return {
      id: tx.id,
      amount: Number(tx.amount),
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt,
      operator: {
        id: tx.operator.id,
        companyName: tx.operator.companyName,
        email: tx.operator.email,
      },
    };
  }

  async getStats(): Promise<PlatformStatsDto> {
    const [operators, approved, pending, revenueResult, payoutResult] = await Promise.all([
      this.operatorRepo.count(),
      this.operatorRepo.count({ where: { verificationStatus: OperatorVerificationStatus.APPROVED } }),
      this.operatorRepo.count({ where: { verificationStatus: OperatorVerificationStatus.PENDING } }),
      this.transactionRepo
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.amount), 0)', 'rev')
        .where('t.type = :type AND t.status = :status', {
          type: TransactionType.CREDIT,
          status: TransactionStatus.COMPLETED,
        })
        .getRawOne(),
      this.transactionRepo
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.amount), 0)', 'pending')
        .where('t.type = :type AND t.status = :status', {
          type: TransactionType.DEBIT,
          status: TransactionStatus.PENDING,
        })
        .getRawOne(),
    ]);

    return {
      totalOperators: operators,
      approvedOperators: approved,
      pendingOperators: pending,
      totalPlatformRevenue: Number(revenueResult.rev || 0),
      pendingPayouts: Number(payoutResult.pending || 0),
    };
  }
}