import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from '../operators/entities/operator.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepo: Repository<Operator>,
  ) {}

  async getProfile(operatorId: number) {
    const operator = await this.operatorRepo.findOne({
      where: { id: operatorId },
      select: [
        'id',
        'email',
        'phone',
        'companyName',
        'cacNumber',
        'verificationStatus',
        'logoUrl',
        'createdAt',
      ],
    });

    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    return operator;
  }

  async updateProfile(operatorId: number, updateData: Partial<Operator>) {
    const operator = await this.operatorRepo.findOneBy({ id: operatorId });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    Object.assign(operator, updateData);
    return this.operatorRepo.save(operator);
  }

  async uploadLogo(operatorId: number, logoUrl: string) {
    const operator = await this.operatorRepo.findOneBy({ id: operatorId });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    operator.logoUrl = logoUrl;
    return this.operatorRepo.save(operator);
  }

  async getVerificationStatus(operatorId: number) {
    const operator = await this.operatorRepo.findOne({
      where: { id: operatorId },
      select: ['verificationStatus', 'documents'],
    });

    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    return {
      status: operator.verificationStatus,
      documents: operator.documents || {},
    };
  }
}
