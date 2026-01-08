// src/config/throttler.config.ts

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
    throttlers: [
      // Default limit for most endpoints
      {
        ttl: Number(config.get('RATE_LIMIT_TTL')) || 60,
        limit: Number(config.get('RATE_LIMIT_COUNT')) || 100,
      },
      // Stricter limit for sensitive routes like login/register
      {
        name: 'short',
        ttl: 60,
        limit: 5, // e.g., 5 attempts per minute
      },
    ],
  }),
};
