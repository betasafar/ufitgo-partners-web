import { mockApplicants, mockDocuments } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, CheckCircle2, FileText, ImageIcon, Download, Upload, Plus } from "lucide-react"
import Link from "next/link"

export default function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const applicant = mockApplicants[0] // Mock data

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/dashboard/applicants" className="hover:text-foreground">
          Applicants
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Abdul Ibrahim</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Applicant Details</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              PENDING REVIEW
            </Badge>
          </div>
          <p className="text-muted-foreground">Application ID: #NG-KAN-2024-892</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-primary hover:bg-primary/90">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept Booking
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Refund
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Profile */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abdul"
                    alt="Abdul Ibrahim"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Abdul Ibrahim</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="text-muted-foreground">PP:</span>
                    <span className="font-semibold">A09876543</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    <span className="text-muted-foreground">Nigerian</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted-foreground">Kano State</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-semibold">Male</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Male</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Age: 45</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Occupation: Merchant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Edit Details
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">EMAIL ADDRESS</p>
                <p className="text-sm font-medium">abdul.ibrahim@example.com</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">PHONE NUMBER</p>
                <p className="text-sm font-medium">+234 803 123 4567</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DATE OF BIRTH</p>
                <p className="text-sm font-medium">12 Aug 1978</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">MARITAL STATUS</p>
                <p className="text-sm font-medium">Married</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">NEXT OF KIN</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="text-sm font-medium">Fatima Ibrahim</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Relationship</p>
                  <p className="text-sm font-medium">Spouse</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm font-medium">+234 803 987 6543</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm font-medium">No 5, Emir Road, Kano</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package & Booking */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="text-lg font-semibold">Package & Booking</h3>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Hajj 2024
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Selected Package</p>
                  <p className="font-semibold text-sm">Gold Umrah Package 2024</p>
                  <p className="text-xs text-muted-foreground mt-1">Includes: 5-Star Hotel, Visa, Transport</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Travel Date</p>
                  <p className="font-semibold text-sm">15 Nov 2024</p>
                  <p className="text-xs text-muted-foreground mt-1">Duration: 14 Days</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Departure From</p>
                  <p className="font-semibold text-sm">Lagos (LOS)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">PAYMENT STATUS</h3>
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">₦ 2,500,000</p>
                <p className="text-3xl font-bold">/ ₦ 4,500,000</p>
              </div>
              <Progress value={55} className="h-3" />
              <p className="text-sm text-primary">55% Paid</p>
              <p className="text-xs text-muted-foreground">45% Remaining</p>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Outstanding Balance</p>
                <p className="text-2xl font-bold">₦ 2,000,000</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold">Documents</h3>
              </div>
            </div>

            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {doc.type === "pdf" ? (
                      <div className="p-2 bg-red-500/10 rounded">
                        <FileText className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-500/10 rounded">
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.size} • Uploaded {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Document
            </Button>
          </div>

          {/* Transactions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold">Transactions</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">View complete payment history</p>
            <Link href={`/dashboard/applicants/${params.id}/payments`}>
              <Button variant="outline" className="w-full bg-transparent">
                View All Transactions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
