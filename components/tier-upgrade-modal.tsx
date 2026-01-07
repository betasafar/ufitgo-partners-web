"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Lock, Sparkles, TrendingUp, Shield, Users } from "lucide-react"
import type { TierLevel } from "@/lib/types"

interface TierUpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTier: TierLevel
  requiredTier: TierLevel
  lockedFeature?: string
  currentMetrics?: {
    totalBookings: number
    successfulBookings: number
    trustScore: number
  }
}

const TIER_BENEFITS = {
  BRONZE: {
    icon: Shield,
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    features: ["5 active packages", "50 pilgrims per booking", "10 bookings per month", "Basic support"],
    requirements: "Automatic tier - Get started immediately!",
  },
  SILVER: {
    icon: Users,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    features: [
      "15 active packages",
      "200 pilgrims per booking",
      "30 bookings per month",
      "Priority support",
      "Custom package templates",
      "Flexible payment terms",
    ],
    requirements: "Upload NAHCON license + Complete 5 successful trips OR Pay partnership fee",
  },
  GOLD: {
    icon: Sparkles,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    features: [
      "Unlimited packages",
      "500 pilgrims per booking",
      "Unlimited bookings",
      "24/7 VIP support",
      "Advanced analytics",
      "Custom pricing rules",
      "White-label options",
    ],
    requirements: "Maintain 90% success rate + 50 completed trips + 85+ trust score",
  },
  PLATINUM: {
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    features: [
      "Everything in GOLD",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "Revenue optimization tools",
    ],
    requirements: "Invitation only - Top 5% performers",
  },
}

export function TierUpgradeModal({
  open,
  onOpenChange,
  currentTier,
  requiredTier,
  lockedFeature,
  currentMetrics,
}: TierUpgradeModalProps) {
  const requiredTierInfo = TIER_BENEFITS[requiredTier]
  const Icon = requiredTierInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-lg ${requiredTierInfo.bgColor}`}>
              <Icon className={`h-6 w-6 ${requiredTierInfo.color}`} />
            </div>
            <div>
              <DialogTitle className="text-2xl">Upgrade to {requiredTier} Tier</DialogTitle>
              <DialogDescription>Unlock more features and grow your business</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {lockedFeature && (
          <Card className="p-4 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Why am I seeing this?</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>{lockedFeature}</strong> is a {requiredTier} tier feature. Your current {currentTier} tier
                  doesn't include access to this capability.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              What you'll get with {requiredTier}
            </h3>
            <div className="grid gap-2">
              {requiredTierInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              How to unlock {requiredTier}
            </h3>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm">{requiredTierInfo.requirements}</p>
            </Card>
          </div>

          {currentMetrics && requiredTier === "GOLD" && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        currentMetrics.successfulBookings / currentMetrics.totalBookings >= 0.9
                          ? "default"
                          : "secondary"
                      }
                    >
                      {((currentMetrics.successfulBookings / currentMetrics.totalBookings) * 100).toFixed(0)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">Need 90%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Trips</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentMetrics.successfulBookings >= 50 ? "default" : "secondary"}>
                      {currentMetrics.successfulBookings}/50
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Trust Score</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentMetrics.trustScore >= 85 ? "default" : "secondary"}>
                      {currentMetrics.trustScore}/100
                    </Badge>
                    <span className="text-xs text-muted-foreground">Need 85+</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Maybe Later
          </Button>
          {requiredTier === "SILVER" && (
            <Button
              onClick={() => (window.location.href = "/dashboard/verification")}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500"
            >
              Upload Documents
            </Button>
          )}
          {requiredTier === "GOLD" && (
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500"
              disabled
            >
              Keep Building Trust
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
