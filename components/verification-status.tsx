"use client"

import { Shield, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerificationStatusProps {
  verified: boolean
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function VerificationStatus({ verified, size = "md", showLabel = true }: VerificationStatusProps) {
  const sizeConfig = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const config = verified
    ? {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        label: "Verified",
        badge: "✓ Verified Operator",
        description: "Full access to all platform features",
      }
    : {
        icon: Shield,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
        label: "New Operator",
        badge: "🛡 Escrow Protected",
        description: "Your bookings are protected while we verify your documents",
      }

  const Icon = config.icon

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium",
        config.color,
        config.bgColor,
        config.borderColor,
      )}
    >
      <Icon className={sizeConfig[size]} />
      {showLabel && <span className="text-sm">{config.badge}</span>}
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block cursor-help">{badge}</div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
            {!verified && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Complete verification to unlock all features
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
