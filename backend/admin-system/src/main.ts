// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType, BadRequestException } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3002;
  const isProd = process.env.NODE_ENV === 'production';

  // Base URL for logs and Swagger
  const baseUrl =
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${port}`;

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://betasafar.app',
      'https://betasafar-gateway.onrender.com',
      baseUrl, // Useful for direct access
    ],
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  // Optional: Enable URI version if you plan to version API later
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // === Global Validation Pipe (CRITICAL for DTO validation) ===
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                    // Strip properties not in DTO
      forbidNonWhitelisted: true,         // Reject unknown properties
      transform: true,                    // Auto-transform payload to DTO class
      disableErrorMessages: false,       // Hide detailed errors in production
      transformOptions: { enableImplicitConversion: true }, 
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: result,
        });
      },
    }),
  );




  // Protect Swagger with basic auth (only in non-production or always)
  app.use(['/docs', '/docs-json'], basicAuth({
    challenge: true,
    users: { admin: 'supersecret' }, // Consider using env var in prod
  }));

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Betasafar Admin API')
    .setDescription('Admin panel for managing operators, payouts, and platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addServer(baseUrl, isProd ? 'Production' : 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps JWT token after refresh
    },
  });

  // Listen on all interfaces (important for Render/cloud)
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API running at: ${baseUrl}/api`);
  console.log(`📘 Swagger UI: ${baseUrl}/docs`);
}

bootstrap();
