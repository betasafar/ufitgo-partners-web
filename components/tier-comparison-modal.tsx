"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TierBadge } from "@/components/tier-badge"
import { Check, X } from "lucide-react"
import type { TierLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TierComparisonModalProps {
  currentTier: TierLevel
  trigger?: React.ReactNode
}

const tierFeatures = {
  BRONZE: {
    maxPilgrims: "50 per booking",
    maxPackages: "5 active",
    customPackages: false,
    escrow: true,
    analytics: "Basic",
    support: "Standard",
    commission: "15%",
    marketing: false,
  },
  SILVER: {
    maxPilgrims: "100 per booking",
    maxPackages: "20 active",
    customPackages: true,
    escrow: false,
    analytics: "Advanced",
    support: "Priority",
    commission: "12%",
    marketing: true,
  },
  GOLD: {
    maxPilgrims: "Unlimited",
    maxPackages: "Unlimited",
    customPackages: true,
    escrow: false,
    analytics: "Premium + Predictive",
    support: "24/7 VIP",
    commission: "10%",
    marketing: true,
  },
}

export function TierComparisonModal({ currentTier, trigger }: TierComparisonModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Compare Tiers</Button>}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tier Comparison</DialogTitle>
          <DialogDescription>Choose the tier that best fits your business needs</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {(["BRONZE", "SILVER", "GOLD"] as TierLevel[]).map((tier) => (
            <div
              key={tier}
              className={cn(
                "rounded-lg border-2 p-6 space-y-4",
                currentTier === tier ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <div className="space-y-2">
                <TierBadge tier={tier} size="md" showLabel={false} interactive={false} className="mb-2" />
                <h3 className="font-bold text-lg">{tier}</h3>
                {currentTier === tier && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    <Check className="h-3 w-3" />
                    Current Tier
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Max Pilgrims</p>
                  <p className="font-medium">{tierFeatures[tier].maxPilgrims}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Packages</p>
                  <p className="font-medium">{tierFeatures[tier].maxPackages}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Custom Packages</p>
                  <p className="font-medium">
                    {tierFeatures[tier].customPackages ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Escrow Required</p>
                  <p className="font-medium">
                    {tierFeatures[tier].escrow ? (
                      <Check className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <X className="h-4 w-4 text-green-500" />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Analytics</p>
                  <p className="font-medium">{tierFeatures[tier].analytics}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Support</p>
                  <p className="font-medium">{tierFeatures[tier].support}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Commission Rate</p>
                  <p className="font-medium">{tierFeatures[tier].commission}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Marketing Tools</p>
                  <p className="font-medium">
                    {tierFeatures[tier].marketing ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </p>
                </div>
              </div>

              {currentTier !== tier && (
                <Button className="w-full" variant={tier === "GOLD" ? "default" : "outline"}>
                  Upgrade to {tier}
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
