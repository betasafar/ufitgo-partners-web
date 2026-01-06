package controller

import (
  "github.com/gofiber/fiber/v2"
  "betasafar-operator-go/internal/service"
)

// @Summary Operator home aggregation
// @Description Fast stats for operator dashboard
// @Tags operator
// @Security JWT-auth
// @Produce json
// @Success 200 {object} map[string]any
// @Router /packages/home-aggregation [get]
func HomeAggregationHandler(c *fiber.Ctx) error {
  operatorID := c.Locals("operatorID").(string)
  data, err := service.GetHomeAggregation(operatorID)
  if err != nil {
    return c.Status(500).JSON(fiber.Map{"error": err.Error()})
  }
  return c.JSON(data)
}

// @Summary Pending bookings
// @Description List of pending bookings
// @Tags bookings
// @Security JWT-auth
// @Produce json
// @Success 200 {array} map[string]any
// @Router /bookings/pending [get]
func PendingBookingsHandler(c *fiber.Ctx) error {
  operatorID := c.Locals("operatorID").(string)
  bookings, err := service.GetPendingBookings(operatorID)
  if err != nil {
    return c.Status(500).JSON(fiber.Map{"error": err.Error()})
  }
  return c.JSON(bookings)
}

// @Summary High-load analytics
// @Description Revenue trends, conversion rates
// @Tags analytics
// @Security JWT-auth
// @Produce json
// @Success 200 {object} map[string]any
// @Router /analytics/highload [get]
func HighLoadAnalyticsHandler(c *fiber.Ctx) error {
  operatorID := c.Locals("operatorID").(string)
  data, err := service.GetHighLoadAnalytics(operatorID)
  if err != nil {
    return c.Status(500).JSON(fiber.Map{"error": err.Error()})
  }
  return c.JSON(data)
}

// @Summary Payment aggregates
// @Description Total paid, pending, balance
// @Tags payments
// @Security JWT-auth
// @Produce json
// @Success 200 {object} map[string]any
// @Router /payments/highload [get]
func PaymentAggregatesHandler(c *fiber.Ctx) error {
  operatorID := c.Locals("operatorID").(string)
  data, err := service.GetPaymentAggregates(operatorID)
  if err != nil {
    return c.Status(500).JSON(fiber.Map{"error": err.Error()})
  }
  return c.JSON(data)
}
