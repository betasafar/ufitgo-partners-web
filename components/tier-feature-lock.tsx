"use client"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TierLevel } from "@/lib/types"

interface TierFeatureLockProps {
  requiredTier: TierLevel
  currentTier: TierLevel
  featureName: string
  description?: string
  variant?: "inline" | "banner"
  onUpgradeClick?: () => void
}

const TIER_ORDER: Record<TierLevel, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
}

export function TierFeatureLock({
  requiredTier,
  currentTier,
  featureName,
  description,
  variant = "inline",
  onUpgradeClick,
}: TierFeatureLockProps) {
  const isLocked = TIER_ORDER[currentTier] < TIER_ORDER[requiredTier]

  if (!isLocked) return null

  if (variant === "inline") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-help">
              <Info className="h-3 w-3" />
              <span className="italic">Available for verified operators</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">
              {description ||
                `${featureName} is available for verified operators. Complete your verification or contact support to learn more.`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // banner variant
  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm text-blue-900 dark:text-blue-100">{featureName}</p>
          {description && <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{description}</p>}
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            Complete verification or contact our support team to discuss access to this feature.
          </p>
        </div>
      </div>
      {onUpgradeClick && (
        <Button size="sm" onClick={onUpgradeClick} variant="outline" className="flex-shrink-0 bg-transparent">
          Learn More
        </Button>
      )}
    </div>
  )
}
