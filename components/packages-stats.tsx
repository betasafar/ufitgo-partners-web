import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DashboardStats } from "@/lib/types"

interface PackagesStatsProps {
  stats: DashboardStats
}

export function PackagesStats({ stats }: PackagesStatsProps) {
  const filledPercentage = (stats.seatsFilled / stats.totalSeats) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-card to-muted">
        <div className="text-sm text-muted-foreground mb-2">ACTIVE PACKAGES</div>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold">{stats.activePackages}</div>
          <div className="text-success text-sm mb-1">↑ 20%</div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-muted">
        <div className="text-sm text-muted-foreground mb-2">SEATS FILLED</div>
        <div className="flex items-end gap-2 mb-3">
          <div className="text-4xl font-bold">{stats.seatsFilled}</div>
          <div className="text-muted-foreground text-lg mb-1">/ {stats.totalSeats}</div>
          <div className="text-success text-sm mb-1">↑ 5%</div>
        </div>
        <Progress value={filledPercentage} className="h-2" />
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-muted">
        <div className="text-sm text-muted-foreground mb-2">REVENUE PROJECTED</div>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold">₦ {stats.revenueProjected}M</div>
          <div className="text-success text-sm mb-1">↑ 12%</div>
        </div>
      </Card>
    </div>
  )
}
