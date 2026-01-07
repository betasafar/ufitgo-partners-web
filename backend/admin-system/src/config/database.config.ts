// src/config/database.config.ts
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// Import ALL entities
import { Admin } from '../admin/entities/admin.entity';
import { Operator } from '../admin/entities/operator.entity';
import { WalletTransaction } from '../admin/entities/wallet-transaction.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [Admin, Operator, WalletTransaction],
    synchronize: false,
    logging: false,

    ssl: {
      rejectUnauthorized: false,
    },
  };
};