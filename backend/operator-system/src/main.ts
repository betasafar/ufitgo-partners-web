import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module" // Fixed import path to use relative path instead of absolute
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import basicAuth from "express-basic-auth"
import { ConfigService } from "@nestjs/config"
import { ValidationPipe } from "@nestjs/common"
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const port = configService.get<number>("PORT") || 3000
  const isProd = process.env.NODE_ENV === "production"

  // Render injects this automatically
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`

  app.enableCors({
    origin: ["http://localhost:3000", `${baseUrl}`, "https://betasafar.app"],
    credentials: true,
  })

  app.setGlobalPrefix("api")

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,          // ← Enable auto-conversion
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.use(
    ["/docs", "/docs-json"],
    basicAuth({
      challenge: true,
      users: { admin: "supersecret" },
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle("betasafar Operator API")
    .setDescription("API documentation for the betasafar Operator backend")
    .setVersion("1.0")
    // .addBasicAuth()
    .addBearerAuth(
      // ← This shows Bearer token input
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT-auth", // name
    )
    .addServer(`${baseUrl}`, isProd ? "Production" : "Local")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, document)

  await app.listen(port, "0.0.0.0")

  console.log(`🚀 API running at: ${baseUrl}`)
  console.log(`📘 Swagger UI: ${baseUrl}/docs`)
}

bootstrap()
