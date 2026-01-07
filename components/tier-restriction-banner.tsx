"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { TierLevel } from "@/lib/types"

interface TierRestrictionBannerProps {
  title: string
  message: string
  requiredTier: TierLevel
  actionText?: string
  actionHref?: string
  dismissible?: boolean
}

export function TierRestrictionBanner({
  title,
  message,
  requiredTier,
  actionText = "Upgrade Now",
  actionHref = "/dashboard/upgrade",
  dismissible = true,
}: TierRestrictionBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Alert className="border-warning/50 bg-warning/10">
      <AlertCircle className="h-5 w-5 text-warning" />
      <AlertTitle className="flex items-center justify-between">
        <span>{title}</span>
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-transparent"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>{message}</p>
        <Button size="sm" asChild className="gap-2">
          <Link href={actionHref}>
            <TrendingUp className="h-4 w-4" />
            {actionText}
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
