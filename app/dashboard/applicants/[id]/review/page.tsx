"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Check, CalendarIcon, Plane, FileText, Receipt, Clock } from "lucide-react"

export default function ReviewBookingPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewNote, setReviewNote] = useState("")

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
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBooking = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/operator/bookings/${params.id}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note: reviewNote }),
        },
      )

      if (response.ok) {
        alert("Booking accepted successfully")
        window.location.href = `/dashboard/applicants/${params.id}`
      }
    } catch (error) {
      console.error("Failed to accept booking:", error)
    }
  }

  const handleRejectBooking = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/operator/bookings/${params.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason: reviewNote }),
        },
      )

      if (response.ok) {
        alert("Booking rejected")
        window.location.href = `/dashboard/applicants`
      }
    } catch (error) {
      console.error("Failed to reject booking:", error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading booking details...</div>
  }

  if (!booking) {
    return <div className="p-6">Booking not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/dashboard" className="hover:text-foreground">
          Dashboard
        </a>
        <span>/</span>
        <a href="/dashboard/applicants" className="hover:text-foreground">
          Applicants
        </a>
        <span>/</span>
        <span className="text-primary">Review Booking Request</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Booking Request</h1>
          <p className="text-sm text-muted-foreground">
            Booking Ref: <strong>#{booking.id}</strong> • Date: {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending Review</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="size-20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.applicant?.name}`} />
                    <AvatarFallback>{booking.applicant?.initials || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <Check className="size-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{booking.applicant?.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5">
                          <FileText className="size-4" />
                          Passport: {booking.applicant?.passport}
                        </span>
                        <span className="flex items-center gap-1.5">🇳🇬 Nationality: Nigerian</span>
                        <span className="flex items-center gap-1.5">♂ Gender: Male</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Identity Check</span>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Pass</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">📦</div>
                  <h3 className="font-semibold">Package Details</h3>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Selected Package</div>
                  <div className="text-lg font-bold text-foreground">{booking.package?.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Includes: 5-Star Hotel, Visa, Transport</div>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Travel Date</span>
                    <span className="ml-auto font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration</span>
                    <span className="ml-auto font-medium">{booking.package?.duration || 14} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Plane className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Departure From</span>
                    <span className="ml-auto font-medium">Lagos (LOS)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">📄</div>
                  <h3 className="font-semibold">Documentation</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-red-500/10">📕</div>
                      <div>
                        <div className="text-sm font-medium">International Passport</div>
                        <div className="text-xs text-muted-foreground">Valid until 2029</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      VIEW
                    </Button>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-yellow-500/10">💉</div>
                      <div>
                        <div className="text-sm font-medium">Vaccination Card</div>
                        <div className="text-xs text-muted-foreground">Yellow Fever / COVID-19</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      VIEW
                    </Button>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-blue-500/10">✈</div>
                      <div>
                        <div className="text-sm font-medium">Visa Status</div>
                        <div className="text-xs text-yellow-600 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-yellow-600" />
                          Processing
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      CHECK
                    </Button>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold uppercase text-xs text-muted-foreground">Note to Applicant (Optional)</h3>
              <Textarea
                placeholder="Enter reason for rejection or additional instructions..."
                className="min-h-[100px]"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 flex-1 bg-transparent" onClick={handleRejectBooking}>
              <X className="size-4" />
              Reject Booking
            </Button>
            <Button className="gap-2 flex-1" onClick={handleAcceptBooking}>
              <Check className="size-4" />
              Accept Booking
            </Button>
          </div>

          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <span>ℹ</span>
            <span>Accepting will trigger an automated email and SMS to the applicant.</span>
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold uppercase text-xs text-muted-foreground">Payment Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Package Cost</span>
                  <span className="font-semibold">₦{booking.package?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">
                    ₦{booking.paymentProgress?.paid.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding Balance</span>
                  <span className="text-lg font-bold text-red-600">
                    ₦{(booking.package?.price - booking.paymentProgress?.paid).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                  <Receipt className="size-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Payment Receipt</div>
                    <div className="text-xs text-muted-foreground">
                      Uploaded {new Date(booking.createdAt).toLocaleDateString()} via Bank Transfer
                    </div>
                  </div>
                </div>
                <Button variant="link" size="sm" className="w-full mt-2 text-primary">
                  Verify Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
