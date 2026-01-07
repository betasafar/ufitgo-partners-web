"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Download, Filter, CreditCard } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ApplicantPaymentsPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [params.id])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/operator/bookings/${params.id}/detailed`,
        { credentials: "include" },
      )
      if (response.ok) {
        const data = await response.json()
        setBooking(data.booking)
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading payment details...</div>
  }

  if (!booking) {
    return <div className="p-6">Booking not found</div>
  }

  const totalCost = booking.package?.price || 0
  const amountPaid = booking.paymentProgress?.paid || 0
  const outstanding = totalCost - amountPaid
  const paymentPercentage = totalCost > 0 ? (amountPaid / totalCost) * 100 : 0

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
        <Link href={`/dashboard/applicants/${params.id}`} className="hover:text-foreground">
          {booking.applicant?.name || "Applicant Name"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-primary">Payments</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xl font-bold">{booking.applicant?.initials || "A"}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{booking.applicant?.name || "Applicant Name"}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Passport: {booking.applicant?.passport || "A12345678"}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Package: {booking.package?.name || "Premium Hajj 2024 (Abuja)"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            {booking.status || "Confirmed"}
          </Badge>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Statement
          </Button>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-muted rounded-lg">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Total Package Cost</span>
          </div>
          <p className="text-3xl font-bold mb-2">₦{totalCost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Includes flight, visa, and accommodation
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">Total Paid</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {paymentPercentage.toFixed(0)}%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-green-500 mb-2">₦{amountPaid.toLocaleString()}</p>
          <Progress value={paymentPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            Last payment: {new Date(booking.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Outstanding Balance</span>
          </div>
          <p className="text-3xl font-bold mb-3">₦{outstanding.toLocaleString()}</p>
          <Button className="w-full bg-primary hover:bg-primary/90">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Transaction Ledger</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead>DATE</TableHead>
              <TableHead>REF ID</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>METHOD</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn: any) => (
              <TableRow key={txn.id} className={`border-b border-border ${txn.status === "pending" ? "italic" : ""}`}>
                <TableCell className={txn.status === "pending" ? "text-muted-foreground" : ""}>
                  {new Date(txn.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-mono text-sm">{txn.reference}</TableCell>
                <TableCell>
                  <p className="font-medium">{txn.description || "Payment"}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{txn.method || "Bank Transfer"}</span>
                </TableCell>
                <TableCell className="font-semibold">₦{txn.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {txn.status === "completed" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Paid
                    </Badge>
                  )}
                  {txn.status === "pending" && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Pending
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
          Showing recent 4 transactions
        </div>
      </div>

      {/* Right side panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Visualization */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Payment Visualization</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="20"
                  strokeDasharray={`${paymentPercentage * 5.026} ${100 * 5.026}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground mb-1">PAID</p>
                <p className="text-3xl font-bold">{paymentPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span className="text-sm">Due</span>
            </div>
          </div>
        </div>

        {/* Refund Eligibility */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="text-lg font-semibold">Refund Eligibility</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <div>
                <p className="font-semibold text-green-500">75% Refundable</p>
                <p className="text-xs text-muted-foreground mt-1">Valid until 1st Ramadan (Mar 10, 2024)</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Cancellations made after the deadline will incur a 40% processing fee. Bank transfer refunds take 5-7
              business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
