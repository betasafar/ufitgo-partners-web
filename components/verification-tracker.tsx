"use client"

import { CheckCircle2, Clock, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VerificationStatus } from "@/lib/types"

interface VerificationTrackerProps {
  status: VerificationStatus
  uploadedAt?: string
  reviewedAt?: string
  estimatedReviewDays?: number
}

const steps = [
  { key: "uploaded", label: "Uploaded", statuses: ["pending", "under_review", "approved", "rejected"] },
  { key: "review", label: "Under Review", statuses: ["under_review", "approved", "rejected"] },
  { key: "completed", label: "Completed", statuses: ["approved", "rejected"] },
]

export function VerificationTracker({
  status,
  uploadedAt,
  reviewedAt,
  estimatedReviewDays = 3,
}: VerificationTrackerProps) {
  const getStepStatus = (step: (typeof steps)[0]) => {
    if (step.statuses.includes(status)) {
      if (step.key === "completed") {
        return status === "approved" ? "complete" : status === "rejected" ? "rejected" : "pending"
      }
      if (step.key === "review" && status === "under_review") return "active"
      if (step.key === "uploaded" && status === "pending") return "active"
      if (step.statuses.indexOf(status) > 0) return "complete"
      return "active"
    }
    return "pending"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step)
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    stepStatus === "complete" && "bg-green-500 border-green-500 text-white",
                    stepStatus === "active" && "bg-blue-500 border-blue-500 text-white",
                    stepStatus === "rejected" && "bg-red-500 border-red-500 text-white",
                    stepStatus === "pending" && "bg-muted border-muted-foreground/20 text-muted-foreground",
                  )}
                >
                  {stepStatus === "complete" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : stepStatus === "active" ? (
                    <Clock className="h-5 w-5" />
                  ) : stepStatus === "rejected" ? (
                    <Circle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs font-medium mt-2 text-center",
                    stepStatus === "complete" && "text-green-600 dark:text-green-400",
                    stepStatus === "active" && "text-blue-600 dark:text-blue-400",
                    stepStatus === "rejected" && "text-red-600 dark:text-red-400",
                    stepStatus === "pending" && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 -mt-8 transition-colors",
                    stepStatus === "complete" ? "bg-green-500" : "bg-muted",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Additional info */}
      <div className="text-center text-sm text-muted-foreground">
        {status === "pending" && uploadedAt && (
          <p>
            Uploaded {new Date(uploadedAt).toLocaleDateString()} · Estimated review: {estimatedReviewDays} days
          </p>
        )}
        {status === "under_review" && (
          <p>Your documents are being reviewed by our team · Usually takes {estimatedReviewDays} days</p>
        )}
        {status === "approved" && reviewedAt && (
          <p className="text-green-600 dark:text-green-400">Approved on {new Date(reviewedAt).toLocaleDateString()}</p>
        )}
        {status === "rejected" && reviewedAt && (
          <p className="text-red-600 dark:text-red-400">Rejected on {new Date(reviewedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  )
}
