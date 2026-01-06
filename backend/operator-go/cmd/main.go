// cmd/main.go
package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	swagger "github.com/gofiber/swagger"

	"betasafar-operator-go/config"
	"betasafar-operator-go/internal/controller"
	"betasafar-operator-go/internal/db"
	"betasafar-operator-go/internal/middleware"

	"betasafar-operator-go/docs"
	_ "betasafar-operator-go/docs"

	"github.com/joho/godotenv"
)

// @title Betasafar Operator Go API
// @version 1.0
// @description High-performance analytics and aggregation for operators
// @host api.betasafar.app
// @BasePath /go/operator
//
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
// @description JWT token for operator authentication (Bearer scheme)

func main() {
	loadEnvIfLocal()

	db.InitDB()
	defer db.CloseDB()

	middleware.JWTSecret = []byte(config.JWTSecret())

	app := fiber.New()

	// Global middlewares
	app.Use(logger.New())
	app.Use(rateLimiter())
	app.Use(corsMiddleware())

	// Configure Swagger dynamically
	configureSwagger()

	// Swagger UI (public)
	app.Get("/docs/*", swagger.HandlerDefault)

	// Operator route group
	operator := app.Group("/go/operator")

	// Public endpoints
	operator.Get("/health", HealthHandler)

	// JWT protection (everything else)
	app.Use(func(c *fiber.Ctx) error {
		if strings.HasPrefix(c.Path(), "/docs") ||
			c.Path() == "/go/operator/health" {
			return c.Next()
		}
		return middleware.JWTAuth()(c)
	})

	// Register protected routes
	controller.RegisterRoutes(app)

	port := config.AppPort()
	baseURL := getBaseURL(port)

	log.Println("Betasafar Operator Go API started")
	log.Printf("Base URL: %s", baseURL)
	log.Printf("Health: %s/go/operator/health", baseURL)
	log.Printf("Swagger UI: %s/docs", baseURL)

	log.Fatal(app.Listen(":" + port))
}

// -------------------- Handlers --------------------

func HealthHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":    "ok",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// -------------------- Helpers --------------------

func loadEnvIfLocal() {
	if os.Getenv("ENV") != "production" && os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found — using system environment variables")
		}
	}
}

func rateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many requests — please try again later",
			})
		},
	})
}

func corsMiddleware() fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     getAllowedOrigins(),
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	})
}

func getBaseURL(port string) string {
	if isLocal() {
		return "http://localhost:" + port
	}

	if host := os.Getenv("RENDER_EXTERNAL_HOSTNAME"); host != "" {
		return "https://" + host
	}

	if host := os.Getenv("API_HOST"); host != "" {
		return host
	}

	return "https://api.betasafar.app"
}

func isLocal() bool {
	return os.Getenv("ENV") != "production" && os.Getenv("RENDER") == ""
}

func configureSwagger() {
	base := getBaseURL(config.AppPort())

	host := strings.TrimPrefix(base, "http://")
	host = strings.TrimPrefix(host, "https://")
	host = strings.TrimSuffix(host, "/")

	scheme := "http"
	if strings.HasPrefix(base, "https://") {
		scheme = "https"
	}

	docs.SwaggerInfo.Host = host
	docs.SwaggerInfo.Schemes = []string{scheme}
	docs.SwaggerInfo.BasePath = "/go/operator"

	log.Printf("Swagger configured → Host: %s | Scheme: %s", host, scheme)
}

func getAllowedOrigins() string {
	base := getBaseURL(config.AppPort())

	origins := []string{
		base,
		strings.Replace(base, "http://", "https://", 1),
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:5050",
	}

	if custom := os.Getenv("ALLOWED_ORIGINS"); custom != "" {
		return custom
	}

	seen := make(map[string]bool)
	var unique []string
	for _, o := range origins {
		if !seen[o] {
			seen[o] = true
			unique = append(unique, o)
		}
	}

	return strings.Join(unique, ",")
}
