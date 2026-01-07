"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { TrustBadge } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface TrustBadgesProps {
  badges: TrustBadge[]
  maxVisible?: number
  expandable?: boolean
}

export function TrustBadges({ badges, maxVisible = 5, expandable = true }: TrustBadgesProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleBadges = expanded ? badges : badges.slice(0, maxVisible)
  const hasMore = badges.length > maxVisible

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-2xl">🏆</span>
        </div>
        <p className="text-sm">No badges earned yet</p>
        <p className="text-xs mt-1">Complete bookings and maintain high ratings to earn badges</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {visibleBadges.map((badge) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all hover:scale-105",
                    "bg-card hover:bg-accent",
                  )}
                >
                  <div className="text-4xl">{badge.icon}</div>
                  <p className="text-xs font-medium text-center line-clamp-2">{badge.name}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {expandable && hasMore && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Show Less" : `Show ${badges.length - maxVisible} More`}
            <ChevronRight className={cn("ml-1 h-4 w-4 transition-transform", expanded && "rotate-90")} />
          </Button>
        </div>
      )}
    </div>
  )
}
