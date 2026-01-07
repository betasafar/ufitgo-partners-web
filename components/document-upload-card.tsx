"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, Upload, Eye, AlertCircle } from "lucide-react"
import type { VerificationDocument } from "@/lib/types"

interface DocumentUploadCardProps {
  document: VerificationDocument
  onUpload: (type: string) => void
  onView: (documentId: number) => void
}

const documentTypeLabels = {
  HAJJ_LICENSE: "Hajj License",
  CAC_CERTIFICATE: "CAC Certificate",
  TAX_CLEARANCE: "Tax Clearance",
  BANK_STATEMENT: "Bank Statement",
}

export function DocumentUploadCard({ document, onUpload, onView }: DocumentUploadCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
      label: "Pending",
    },
    under_review: {
      icon: Clock,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      label: "Under Review",
    },
    approved: {
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      label: "Approved",
    },
    rejected: { icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", label: "Rejected" },
  }

  const status = statusConfig[document.status]
  const StatusIcon = status.icon

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${status.color.split(" ")[0]}/10`}>
            <StatusIcon className={`h-5 w-5 ${status.color.split(" ")[1]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{documentTypeLabels[document.type]}</h3>
              <Badge variant="outline" className={status.color}>
                {status.label}
              </Badge>
            </div>
            {document.uploadedAt && (
              <p className="text-xs text-muted-foreground mb-1">
                Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            )}
            {document.reviewedAt && (
              <p className="text-xs text-muted-foreground">
                Reviewed: {new Date(document.reviewedAt).toLocaleDateString()}
              </p>
            )}
            {document.rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400">{document.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {document.status === "approved" || document.status === "under_review" || document.status === "rejected" ? (
            <Button variant="ghost" size="sm" onClick={() => onView(document.id)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          ) : null}
          {document.status === "pending" || document.status === "rejected" ? (
            <Button size="sm" onClick={() => onUpload(document.type)}>
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
