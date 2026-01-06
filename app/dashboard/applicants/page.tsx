import { mockApplicants } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, UserPlus, Download } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ApplicantsPage() {
  const totalApplicants = 142
  const visasProcessed = 89
  const pendingPayments = 15400000

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Travelers Management</h1>
          <p className="text-muted-foreground">
            Manage traveler details, visa status, and payments across all your packages.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Traveler
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">TOTAL TRAVELERS</span>
          </div>
          <div className="text-3xl font-bold">{totalApplicants}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-green-500">+12% vs last week</span>
          </div>
          <div className="mt-3">
            <Progress value={32} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">45/50 Seats Filled</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">VISAS PROCESSED</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">{visasProcessed}</div>
            <span className="text-muted-foreground">of {totalApplicants} total</span>
          </div>
          <div className="mt-3">
            <Progress value={63} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">12 Pending Submission</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">PENDING PAYMENTS</span>
          </div>
          <div className="text-3xl font-bold">₦{(pendingPayments / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-muted-foreground mt-1">outstanding</div>
          <div className="mt-3">
            <span className="text-xs text-orange-500">85 payments due</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Next due date: Oct 15</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, passport number, or booking ID..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <span>All Statuses</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <span>Payment: All</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Applicants Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead>TRAVELER</TableHead>
              <TableHead>CONTACT INFO</TableHead>
              <TableHead>BOOKING ID</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>PAYMENT PROGRESS</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockApplicants.map((applicant) => (
              <TableRow key={applicant.id} className="border-b border-border">
                <TableCell>
                  <Link
                    href={`/dashboard/applicants/${applicant.id}`}
                    className="flex items-center gap-3 hover:text-primary"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                      {applicant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">Pass: {applicant.passport}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{applicant.phone}</p>
                    <p className="text-xs text-muted-foreground">{applicant.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-mono text-sm">{applicant.bookingId}</p>
                    <p className="text-xs text-muted-foreground">{applicant.bookingDate}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {applicant.status === "approved" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Approved
                    </Badge>
                  )}
                  {applicant.status === "confirmed" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Visa Issued
                    </Badge>
                  )}
                  {applicant.status === "reviewing" && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      Pending Info
                    </Badge>
                  )}
                  {applicant.status === "issue_flagged" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      Issue Flagged
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">₦{(applicant.amountPaid / 1000000).toFixed(1)}M</span>
                      <span className="text-muted-foreground">of ₦{(applicant.totalAmount / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress value={applicant.paymentProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{applicant.paymentProgress}% Paid</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/applicants/${applicant.id}`}>
                      <Button variant="ghost" size="icon">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                    </Link>
                    <Link href={`/dashboard/applicants/${applicant.id}`}>
                      <Button variant="ghost" size="icon">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">10</span> of{" "}
            <span className="font-semibold">142</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm">
              14
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
