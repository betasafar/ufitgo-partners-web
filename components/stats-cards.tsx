import { Card } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/types"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `₦ ${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: stats.revenueChange,
      icon: "💰",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      subtitle: "Travelers",
      change: stats.bookingsChange,
      capacity: stats.bookingsChange,
      icon: "👥",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments.toString(),
      subtitle: "Travelers",
      change: stats.paymentsChange,
      status: "warning",
      icon: "💳",
    },
    {
      title: "Visa Status",
      value: stats.visaExpiring.toString(),
      subtitle: "Expiring",
      change: stats.visaChange,
      status: "danger",
      icon: "⚠️",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm text-muted-foreground">{card.title}</div>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">{card.value}</div>
            {card.subtitle && <div className="text-sm text-muted-foreground">{card.subtitle}</div>}
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            {card.change > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={card.change > 0 ? "text-success" : "text-destructive"}>
              {card.change > 0 ? "+" : ""}
              {card.change}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
