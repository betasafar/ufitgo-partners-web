// internal/db/db.go
package db

import (
	"context"
	"log"

	"betasafar-operator-go/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB() {
	dsn := config.DatabaseURL()

	var err error
	Pool, err = pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	if err = Pool.Ping(context.Background()); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	log.Println("Connected to PostgreSQL successfully")
}

func CloseDB() {
	if Pool != nil {
		Pool.Close()
	}
}
