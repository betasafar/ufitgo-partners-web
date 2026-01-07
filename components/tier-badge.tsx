"use client"

import { Crown, Award, Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TierLevel } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TierBadgeProps {
  tier: TierLevel
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  interactive?: boolean
  className?: string
}

const tierConfig = {
  BRONZE: {
    icon: Medal,
    color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    label: "Bronze",
    benefits: ["Up to 50 pilgrims/booking", "5 active packages", "Basic support", "Escrow required"],
  },
  SILVER: {
    icon: Award,
    color: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    label: "Silver",
    benefits: ["Up to 100 pilgrims/booking", "20 active packages", "Priority support", "No escrow"],
  },
  GOLD: {
    icon: Crown,
    color:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
    label: "Gold",
    benefits: ["Unlimited pilgrims", "Unlimited packages", "24/7 VIP support", "Custom branding"],
    shine: true,
  },
}

const sizeConfig = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
}

export function TierBadge({ tier, size = "md", showLabel = true, interactive = true, className }: TierBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium transition-all",
        config.color,
        config.shine && "relative overflow-hidden",
        interactive && "hover:scale-105 cursor-pointer",
        className,
      )}
    >
      <Icon className={sizeConfig[size]} />
      {showLabel && <span>{config.label}</span>}
      {config.shine && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
      )}
    </div>
  )

  if (!interactive) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{config.label} Tier Benefits</p>
            <ul className="space-y-1 text-xs">
              {config.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
