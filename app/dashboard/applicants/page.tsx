"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, UserPlus, Download } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Booking {
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
  }
}

export default function ApplicantsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    visasProcessed: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])

        // Calculate stats from bookings
        const total = data.bookings?.length || 0
        const visasProcessed = data.bookings?.filter((b: Booking) => b.status === "confirmed").length || 0
        const pendingPayments =
          data.bookings?.reduce((sum: number, b: Booking) => sum + (b.totalAmount - b.amountPaid), 0) || 0

        setStats({
          total,
          visasProcessed,
          pendingPayments,
        })
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            {status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading travelers...</p>
        </div>
      </div>
    )
  }

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
          <div className="text-3xl font-bold">{stats.total}</div>
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
            <div className="text-3xl font-bold">{stats.visasProcessed}</div>
            <span className="text-muted-foreground">of {stats.total} total</span>
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
          <div className="text-3xl font-bold">₦{(stats.pendingPayments / 1000000).toFixed(1)}M</div>
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
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const paymentProgress = Math.round((booking.amountPaid / booking.totalAmount) * 100)
                return (
                  <TableRow key={booking.id} className="border-b border-border">
                    <TableCell>
                      <Link
                        href={`/dashboard/applicants/${booking.id}`}
                        className="flex items-center gap-3 hover:text-primary"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                          {booking.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "NA"}
                        </div>
                        <div>
                          <p className="font-semibold">{booking.user?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">ID: {booking.id}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{booking.user?.phone || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{booking.user?.email || "N/A"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">BK-{booking.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">₦{(booking.amountPaid / 1000000).toFixed(1)}M</span>
                          <span className="text-muted-foreground">
                            of ₦{(booking.totalAmount / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <Progress value={paymentProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">{paymentProgress}% Paid</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/applicants/${booking.id}`}>
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
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {bookings.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">1</span> to{" "}
              <span className="font-semibold">{bookings.length}</span> of{" "}
              <span className="font-semibold">{stats.total}</span> results
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
