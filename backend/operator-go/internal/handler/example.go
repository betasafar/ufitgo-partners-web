package handler

import "github.com/gofiber/fiber/v2"

// @Summary Broadcast to package pilgrims
// @Description Operator broadcasts update to all booked pilgrims (placeholder)
// @Tags notifications
// @Accept json
// @Produce json
// @Param packageId path int true "Package ID"
// @Param title body string true "Message title"
// @Param message body string true "Message body"
// @Success 200 {object} map[string]string
// @Router /notifications/broadcast [post]
func BroadcastHandler(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{
    "message": "Broadcast feature coming soon",
  })
}

// @Summary Get home aggregation
// @Description Fast stats for operator dashboard
// @Tags dashboard
// @Produce json
// @Success 200 {object} map[string]any
// @Router /packages/home-aggregation [get]
func HomeAggregation(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{
    "totalBookings": 45,
    "revenue": 24000000,
    "activePackages": 8,
    "pendingPayout": 12000000,
  })
}

// @Summary Get pending bookings
// @Description List of pending bookings
// @Tags bookings
// @Produce json
// @Success 200 {array} map[string]any
// @Router /bookings/pending [get]
func PendingBookings(c *fiber.Ctx) error {
  return c.JSON([]map[string]any{
    {"id": 123, "pilgrim": "Ahmad Yusuf", "package": "Premium Umrah", "amount": 2200000},
    {"id": 124, "pilgrim": "Fatima Ali", "package": "Family Hajj", "amount": 4500000},
  })
}

// @Summary High-load analytics
// @Description Revenue trends, conversion rates
// @Tags analytics
// @Produce json
// @Success 200 {object} map[string]any
// @Router /analytics/highload [get]
func HighLoadAnalytics(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{
    "monthlyRevenue": []int{12000000, 18000000, 24000000, 22000000},
    "conversionRate": "68%",
    "avgBookingValue": 3200000,
  })
}

// @Summary Payment aggregates
// @Description Total paid, pending, balance
// @Tags payments
// @Produce json
// @Success 200 {object} map[string]any
// @Router /payments/highload [get]
func PaymentAggregates(c *fiber.Ctx) error {
  return c.JSON(fiber.Map{
    "totalPaid": 22000000,
    "pendingPayment": 2000000,
    "walletBalance": 18000000,
  })
}
