// src/app.module.ts
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import { JwtModule } from "@nestjs/jwt"
import { APP_GUARD } from "@nestjs/core"

import { getTypeOrmConfig } from "./config/database.config"
import { throttlerConfig } from "./config/throttler.config"
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard"
import { AdminModule } from "./admin/admin.module"
import { AuthModule } from "./admin/auth/auth.module"
import { OperatorsModule } from "./operators/operators.module" // Import new operators module for tier management

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync(throttlerConfig),

    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get("ADMIN_JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
      inject: [ConfigService],
    }),

    AdminModule, // ✅ IMPORT MODULE HERE
    AuthModule, // ✅ THIS IS REQUIRED
    OperatorsModule, // Add operators module for tier system management
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
