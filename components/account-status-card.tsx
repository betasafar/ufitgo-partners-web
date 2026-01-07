"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { VerificationStatus } from "@/components/verification-status"
import { FileUp, TrendingUp, PackageIcon, Calendar } from "lucide-react"
import type { OperatorWithTier } from "@/lib/types"
import Link from "next/link"

interface AccountStatusCardProps {
  operator: OperatorWithTier
}

export function AccountStatusCard({ operator }: AccountStatusCardProps) {
  const isVerified = operator.verificationStatus === "approved"
  const packageUsagePercent = (operator.activePackagesCount / operator.tierInfo.maxActivePackages) * 100
  const bookingUsagePercent = (operator.monthlyBookingsCount / operator.tierInfo.maxMonthlyBookings) * 100

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Account Status</h3>
          <div className="flex items-center justify-center py-2">
            <VerificationStatus verified={isVerified} size="lg" showLabel={true} />
          </div>
        </div>

        {/* Current Activity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>Your Current Activity</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <PackageIcon className="h-4 w-4" />
                Active Packages
              </span>
              <span className="font-medium">
                {operator.activePackagesCount} of {operator.tierInfo.maxActivePackages}
              </span>
            </div>
            <Progress value={packageUsagePercent} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings This Month
              </span>
              <span className="font-medium">
                {operator.monthlyBookingsCount} of {operator.tierInfo.maxMonthlyBookings}
              </span>
            </div>
            <Progress value={bookingUsagePercent} className="h-2" />
          </div>
        </div>

        {/* Actions */}
        {!isVerified && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Complete verification to unlock higher limits and more features
            </div>
            <Button className="w-full gap-2" asChild>
              <Link href="/dashboard/verification">
                <FileUp className="h-4 w-4" />
                Complete Verification
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
