"use client"

import type React from "react"

import { Lock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { TierUpgradeModal } from "./tier-upgrade-modal"

interface LockedChartOverlayProps {
  title: string
  requiredTier: "BRONZE" | "SILVER" | "GOLD"
  currentTier: "BRONZE" | "SILVER" | "GOLD"
  previewMode?: boolean
  children?: React.ReactNode
}

export function LockedChartOverlay({
  title,
  requiredTier,
  currentTier,
  previewMode = true,
  children,
}: LockedChartOverlayProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const tierOrder = { BRONZE: 1, SILVER: 2, GOLD: 3 }
  const isLocked = tierOrder[currentTier] < tierOrder[requiredTier]

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        {previewMode && <div className="opacity-20 blur-sm pointer-events-none">{children}</div>}

        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>

          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Unlock advanced analytics with {requiredTier} tier to gain deeper insights into your business performance
            and make data-driven decisions.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Available in {requiredTier} tier</span>
          </div>

          <Button onClick={() => setShowUpgradeModal(true)}>Upgrade to {requiredTier}</Button>
        </div>
      </Card>

      {showUpgradeModal && (
        <TierUpgradeModal
          currentTier={currentTier}
          targetTier={requiredTier}
          onClose={() => setShowUpgradeModal(false)}
          context={`unlock ${title}`}
        />
      )}
    </>
  )
}
