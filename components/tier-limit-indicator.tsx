"use client"

import { AlertCircle, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TierLimitIndicatorProps {
  current: number
  limit: number
  label: string
  type: "bookings" | "packages" | "pilgrims"
  onUpgradeClick?: () => void
}

export function TierLimitIndicator({ current, limit, label, type, onUpgradeClick }: TierLimitIndicatorProps) {
  const percentage = Math.min((current / limit) * 100, 100)
  const isNearLimit = percentage >= 80
  const isAtLimit = current >= limit

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={isNearLimit ? "text-orange-500 font-semibold" : "text-muted-foreground"}>
          {current} / {limit}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${isNearLimit ? "bg-orange-500/20" : ""}`} />

      {isAtLimit && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-sm font-semibold block">You've reached your {type} limit</span>
              <span className="text-xs">
                {type === "bookings" && "Upgrade to accept more bookings and grow your revenue"}
                {type === "packages" && "Upgrade to create more package options for your customers"}
                {type === "pilgrims" && "Upgrade to serve larger groups and maximize your earnings"}
              </span>
            </div>
            {onUpgradeClick && (
              <Button size="sm" variant="outline" onClick={onUpgradeClick} className="ml-2 bg-transparent shrink-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          You're approaching your {type} limit. Upgrade now to avoid disruption to your business.
        </p>
      )}
    </div>
  )
}
