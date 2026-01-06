package service

import (
  "context"
  "fmt"

  "betasafar-operator-go/internal/db"
)

// Home aggregation for operator dashboard
func GetHomeAggregation(operatorID string) (map[string]any, error) {
  ctx := context.Background()

  var totalBookings, activePackages int
  var revenue, pendingPayout float64

  err := db.Pool.QueryRow(ctx, `
    SELECT 
      COUNT(b.id),
      SUM(b.total_amount),
      SUM(CASE WHEN b.status = 'pending' THEN b.total_amount - b.amount_paid ELSE 0 END)
    FROM bookings b
    WHERE b.operator_id = $1
  `, operatorID).Scan(&totalBookings, &revenue, &pendingPayout)
  if err != nil {
    return nil, err
  }

  err = db.Pool.QueryRow(ctx, `
    SELECT COUNT(*) FROM packages
    WHERE operator_id = $1 AND status = 'active'
  `, operatorID).Scan(&activePackages)
  if err != nil {
    return nil, err
  }

  return map[string]any{
    "totalBookings": totalBookings,
    "revenue": revenue,
    "activePackages": activePackages,
    "pendingPayout": pendingPayout,
  }, nil
}

// Pending bookings list
func GetPendingBookings(operatorID string) ([]map[string]any, error) {
  ctx := context.Background()

  rows, err := db.Pool.Query(ctx, `
    SELECT b.id, b.pilgrim_name, p.title, b.total_amount, b.created_at
    FROM bookings b
    JOIN packages p ON b.package_id = p.id
    WHERE b.operator_id = $1 AND b.status = 'pending'
    ORDER BY b.created_at DESC
  `, operatorID)
  if err != nil {
    return nil, err
  }
  defer rows.Close()

  var bookings []map[string]any
  for rows.Next() {
    var id int
    var pilgrim, packageTitle string
    var amount float64
    var createdAt string
    rows.Scan(&id, &pilgrim, &packageTitle, &amount, &createdAt)
    bookings = append(bookings, map[string]any{
      "id": id,
      "pilgrim": pilgrim,
      "package": packageTitle,
      "amount": amount,
      "date": createdAt,
    })
  }

  return bookings, nil
}

// High-load analytics
func GetHighLoadAnalytics(operatorID string) (map[string]any, error) {
  ctx := context.Background()

  // Monthly revenue (last 6 months)
  rows, err := db.Pool.Query(ctx, `
    SELECT DATE_TRUNC('month', b.created_at) as month, SUM(b.total_amount)
    FROM bookings b
    WHERE b.operator_id = $1 AND b.status IN ('confirmed', 'fully_paid', 'completed')
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `, operatorID)
  if err != nil {
    return nil, err
  }
  defer rows.Close()

  var revenue []int
  for rows.Next() {
    var month string
    var amount float64
    rows.Scan(&month, &amount)
    revenue = append(revenue, int(amount))
  }

  // Conversion rate example
  var totalViews, totalBookings int
  // In real app: track views separately
  totalBookings = 45 // placeholder
  totalViews = 120

  conversion := 0.0
  if totalViews > 0 {
    conversion = float64(totalBookings) / float64(totalViews) * 100
  }

  return map[string]any{
    "monthlyRevenue": revenue,
    "conversionRate": fmt.Sprintf("%.1f%%", conversion),
    "avgBookingValue": 3200000,
  }, nil
}

// Payment aggregates
func GetPaymentAggregates(operatorID string) (map[string]any, error) {
  ctx := context.Background()

  var totalPaid, pending float64

  err := db.Pool.QueryRow(ctx, `
    SELECT 
      COALESCE(SUM(amount_paid), 0),
      COALESCE(SUM(total_amount - amount_paid), 0)
    FROM bookings
    WHERE operator_id = $1
  `, operatorID).Scan(&totalPaid, &pending)
  if err != nil {
    return nil, err
  }

  balance := totalPaid - pending // simplified

  return map[string]any{
    "totalPaid": totalPaid,
    "pendingPayment": pending,
    "walletBalance": balance,
  }, nil
}
