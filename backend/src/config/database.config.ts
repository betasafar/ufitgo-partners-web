import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // synchronize: configService.get<string>('NODE_ENV') !== 'production', // false in production
  // logging: configService.get<string>('NODE_ENV') === 'development',
  // ssl: configService.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,

  synchronize: false,
  logging: false,

  ssl: {
    rejectUnauthorized: false,
  },
});
