// config/config.go
package config

import (
	"log"
	"os"
)

func AppPort() string {
	if port := os.Getenv("PORT"); port != "" {
		return port
	}
	return "4001"
}

func DatabaseURL() string {
	url := os.Getenv("DATABASE_URL")
	if url == "" {
		log.Fatal("DATABASE_URL is required in production")
	}
	return url
}

func JWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET is required")
	}
	return secret
}
