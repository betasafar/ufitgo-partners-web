"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DocumentUploadCard } from "@/components/document-upload-card"
import { VerificationTracker } from "@/components/verification-tracker"
import type { VerificationDocument } from "@/lib/types"

// Mock data - replace with actual API calls
const mockDocuments: VerificationDocument[] = [
  {
    id: 1,
    type: "HAJJ_LICENSE",
    status: "approved",
    uploadedAt: "2026-01-15T10:00:00Z",
    reviewedAt: "2026-01-16T14:30:00Z",
  },
  {
    id: 2,
    type: "CAC_CERTIFICATE",
    status: "under_review",
    uploadedAt: "2026-01-15T10:05:00Z",
  },
  {
    id: 3,
    type: "TAX_CLEARANCE",
    status: "pending",
  },
  {
    id: 4,
    type: "BANK_STATEMENT",
    status: "rejected",
    uploadedAt: "2026-01-14T09:00:00Z",
    reviewedAt: "2026-01-15T11:00:00Z",
    rejectionReason: "Bank statement must be from the last 3 months. Please upload a more recent statement.",
  },
]

export default function VerificationPage() {
  const [documents] = useState(mockDocuments)

  const completedDocs = documents.filter((d) => d.status === "approved").length
  const totalDocs = documents.length
  const completionPercent = (completedDocs / totalDocs) * 100

  const handleUpload = (type: string) => {
    console.log("[v0] Upload document:", type)
    // TODO: Implement document upload
  }

  const handleView = (documentId: number) => {
    console.log("[v0] View document:", documentId)
    // TODO: Implement document viewer
  }

  // Get overall verification status
  const overallStatus = documents.every((d) => d.status === "approved")
    ? "approved"
    : documents.some((d) => d.status === "under_review")
      ? "under_review"
      : "pending"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verification Center</h1>
        <p className="text-muted-foreground">Upload and manage your verification documents</p>
      </div>

      {/* Verification Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Verification Progress</h2>
            <span className="text-2xl font-bold text-primary">{Math.round(completionPercent)}%</span>
          </div>
          <Progress value={completionPercent} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {completedDocs} of {totalDocs} documents verified
          </p>
        </div>
      </Card>

      {/* Overall Status Tracker */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Verification Status</h2>
        <VerificationTracker
          status={overallStatus}
          uploadedAt={documents[0]?.uploadedAt}
          reviewedAt={documents.find((d) => d.reviewedAt)?.reviewedAt}
        />
      </Card>

      {/* Alert for rejected documents */}
      {documents.some((d) => d.status === "rejected") && (
        <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Action Required</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Some documents were rejected. Please review the feedback and reupload corrected versions.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Document List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Verification Documents</h2>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Multiple
          </Button>
        </div>

        <div className="grid gap-4">
          {documents.map((doc) => (
            <DocumentUploadCard key={doc.id} document={doc} onUpload={handleUpload} onView={handleView} />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Document Requirements</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• All documents must be clear, readable scans or photos</li>
          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</li>
          <li>• Documents must be current and not expired</li>
          <li>• Bank statements should be from the last 3 months</li>
        </ul>
      </Card>
    </div>
  )
}
