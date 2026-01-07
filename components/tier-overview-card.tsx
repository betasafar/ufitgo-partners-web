"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TierBadge } from "@/components/tier-badge"
import { TrustScore } from "@/components/trust-score"
import { FileUp, TrendingUp, Award } from "lucide-react"
import type { OperatorWithTier } from "@/lib/types"
import Link from "next/link"

interface TierOverviewCardProps {
  operator: OperatorWithTier
}

export function TierOverviewCard({ operator }: TierOverviewCardProps) {
  const packageUsagePercent = (operator.activePackagesCount / operator.tierInfo.maxActivePackages) * 100
  const bookingUsagePercent = (operator.monthlyBookingsCount / operator.tierInfo.maxMonthlyBookings) * 100

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Your Tier Status</h3>
            <p className="text-sm text-muted-foreground">Track your tier usage and benefits</p>
          </div>
          <TrustScore score={operator.trustScore} size="sm" />
        </div>

        {/* Tier Badge */}
        <div className="flex items-center justify-center py-4">
          <TierBadge tier={operator.tier} size="lg" showLabel={true} interactive={true} />
        </div>

        {/* Usage Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Packages</span>
              <span className="font-medium">
                {operator.activePackagesCount}/{operator.tierInfo.maxActivePackages}
              </span>
            </div>
            <Progress value={packageUsagePercent} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bookings This Month</span>
              <span className="font-medium">
                {operator.monthlyBookingsCount}/{operator.tierInfo.maxMonthlyBookings}
              </span>
            </div>
            <Progress value={bookingUsagePercent} className="h-2" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
            <Link href="/dashboard/verification">
              <FileUp className="h-4 w-4" />
              Upload Docs
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
            <Link href="/dashboard/tier-benefits">
              <Award className="h-4 w-4" />
              View Benefits
            </Link>
          </Button>
        </div>

        <Button className="w-full gap-2" asChild>
          <Link href="/dashboard/upgrade">
            <TrendingUp className="h-4 w-4" />
            View Upgrade Path
          </Link>
        </Button>
      </div>
    </Card>
  )
}
