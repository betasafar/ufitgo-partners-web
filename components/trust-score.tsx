"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TrustScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const sizeConfig = {
  sm: { circle: 48, stroke: 4, text: "text-sm" },
  md: { circle: 64, stroke: 6, text: "text-base" },
  lg: { circle: 80, stroke: 8, text: "text-lg" },
}

export function TrustScore({ score, size = "md", showLabel = true }: TrustScoreProps) {
  const config = sizeConfig[size]
  const radius = (config.circle - config.stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 71) return "text-green-500"
    if (score >= 41) return "text-yellow-500"
    return "text-red-500"
  }

  const getStrokeColor = (score: number) => {
    if (score >= 71) return "#22c55e"
    if (score >= 41) return "#eab308"
    return "#ef4444"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex flex-col items-center gap-2 cursor-pointer">
            <div className="relative" style={{ width: config.circle, height: config.circle }}>
              <svg className="transform -rotate-90" width={config.circle} height={config.circle}>
                <circle
                  cx={config.circle / 2}
                  cy={config.circle / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={config.stroke}
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx={config.circle / 2}
                  cy={config.circle / 2}
                  r={radius}
                  stroke={getStrokeColor(score)}
                  strokeWidth={config.stroke}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center font-bold",
                  config.text,
                  getColor(score),
                )}
              >
                {score}
              </div>
            </div>
            {showLabel && <span className="text-xs text-muted-foreground font-medium">Trust Score</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-semibold text-sm">Trust Score Breakdown</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span>Completed trips:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Payment history:</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Customer ratings:</span>
                <span className="font-medium">25%</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
