import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Upload, Eye, FileText } from "lucide-react"

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your agency's public profile and verification status.</p>
      </div>

      {/* Profile Completion */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Profile Completion</h2>
          </div>
          <span className="text-2xl font-bold text-primary">75%</span>
        </div>
        <Progress value={75} className="h-3 mb-3" />
        <p className="text-sm text-muted-foreground">Finish setting up your profile to get verified by NAHCON.</p>
      </div>

      {/* Verification Checklist */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Verification Checklist</h2>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            3 of 4 Completed
          </Badge>
        </div>

        <div className="space-y-4">
          {/* NAHCON License */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold">NAHCON License</p>
                <p className="text-sm text-muted-foreground">Verified on Oct 12, 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Verified
              </Badge>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Business Registration */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Business Registration (CAC)</p>
                <p className="text-sm text-muted-foreground">Uploaded. Pending administrative review.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Pending Review
              </Badge>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bank Account */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold">Bank Account Verification</p>
                <p className="text-sm text-muted-foreground">Jaiz Bank •••• 4589 verified successfully.</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Verified
            </Badge>
          </div>

          {/* Saudi Partner Contract */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold">Saudi Partner Contract</p>
                <p className="text-sm text-muted-foreground">
                  Upload your current active contract with a Saudi service provider.
                </p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* Company Logo */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Company Logo</h2>
        <p className="text-sm text-muted-foreground mb-6">Upload a high-quality logo (JPG, PNG). Max size 2MB.</p>

        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-border bg-muted flex items-center justify-center">
            <div className="text-center">
              <svg className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-muted-foreground">CURRENIT</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
            <Button variant="outline">Remove</Button>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h2 className="text-lg font-semibold">Company Details</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-muted-foreground">Company Name</label>
            <p className="text-sm font-medium mt-1">Al-Haramain Tours</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">CAC Registration</label>
            <p className="text-sm font-medium mt-1">RC1234567</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email Address</label>
            <p className="text-sm font-medium mt-1">contact@alharamain.ng</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Phone Number</label>
            <p className="text-sm font-medium mt-1">+234 803 555 1234</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
          <Button variant="outline">Discard Changes</Button>
          <Button className="bg-primary hover:bg-primary/90">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
