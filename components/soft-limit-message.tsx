"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SoftLimitMessageProps {
  current: number
  limit: number
  feature: string
  upgradeAction: string
  upgradeLink?: string
}

export function SoftLimitMessage({ current, limit, feature, upgradeAction, upgradeLink }: SoftLimitMessageProps) {
  const isNearLimit = current >= limit * 0.8
  const isAtLimit = current >= limit

  if (!isNearLimit) return null

  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {isAtLimit
              ? `You've reached your ${feature} limit for now`
              : `You're doing great! ${current} out of ${limit} ${feature} used`}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {isAtLimit
              ? `${upgradeAction} to ${feature === "packages" ? "list more packages" : "accept more bookings"} and grow your business.`
              : `${upgradeAction} soon to ensure you can continue accepting bookings without interruption.`}
          </p>
          {upgradeLink && (
            <Button size="sm" variant="outline" asChild className="gap-2 bg-transparent">
              <Link href={upgradeLink}>
                {upgradeAction}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
