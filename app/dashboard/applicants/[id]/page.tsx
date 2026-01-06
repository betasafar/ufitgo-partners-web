"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  id: number
  userId: number
  packageId: number
  status: string
  totalAmount: number
  amountPaid: number
  travelDate: string
  bookingDate: string
  user?: {
    name: string
    email: string
    phone: string
    dateOfBirth?: string
    nationality?: string
    passportNumber?: string
  }
  package?: {
    name: string
    duration: number
    departure: string
  }
  paymentProgress?: number
  relatedBookingsCount?: number
}

export default function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [params.id])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${params.id}/detailed`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traveler details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Booking not found</p>
          <p className="text-muted-foreground mb-4">
            The booking you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/dashboard/applicants">
            <Button>Back to Travelers</Button>
          </Link>
        </div>
      </div>
    )
  }

  const paymentProgress = booking.paymentProgress || Math.round((booking.amountPaid / booking.totalAmount) * 100)
  const outstandingBalance = booking.totalAmount - booking.amountPaid

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
        <span className="text-foreground">{booking.user?.name || "Traveler"}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Applicant Details</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {booking.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">Application ID: #BK-{booking.id}</p>
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
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.user?.name || "user"}`}
                    alt={booking.user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">{booking.user?.name || "Unknown Traveler"}</h2>
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
                    <span className="font-semibold">{booking.user?.passportNumber || "N/A"}</span>
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
                    <span className="text-muted-foreground">{booking.user?.nationality || "N/A"}</span>
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
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">EMAIL ADDRESS</p>
                <p className="text-sm font-medium">{booking.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">PHONE NUMBER</p>
                <p className="text-sm font-medium">{booking.user?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DATE OF BIRTH</p>
                <p className="text-sm font-medium">
                  {booking.user?.dateOfBirth ? new Date(booking.user.dateOfBirth).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">BOOKING DATE</p>
                <p className="text-sm font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
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
                  <p className="font-semibold text-sm">{booking.package?.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duration: {booking.package?.duration || "N/A"} days
                  </p>
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
                  <p className="font-semibold text-sm">{new Date(booking.travelDate).toLocaleDateString()}</p>
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
                  <p className="font-semibold text-sm">{booking.package?.departure || "N/A"}</p>
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
                <p className="text-sm text-muted-foreground">₦ {booking.amountPaid.toLocaleString()}</p>
                <p className="text-3xl font-bold">/ ₦ {booking.totalAmount.toLocaleString()}</p>
              </div>
              <Progress value={paymentProgress} className="h-3" />
              <p className="text-sm text-primary">{paymentProgress}% Paid</p>
              <p className="text-xs text-muted-foreground">{100 - paymentProgress}% Remaining</p>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Outstanding Balance</p>
                <p className="text-2xl font-bold">₦ {outstandingBalance.toLocaleString()}</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
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
