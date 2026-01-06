// internal/controller/routes.go
package controller

import "github.com/gofiber/fiber/v2"

func RegisterRoutes(app *fiber.App) {
	operator := app.Group("/go/operator")

	operator.Get("/packages/home-aggregation", HomeAggregationHandler)
	operator.Get("/bookings/pending", PendingBookingsHandler)
	operator.Get("/analytics/highload", HighLoadAnalyticsHandler)
	operator.Get("/payments/highload", PaymentAggregatesHandler)
}
