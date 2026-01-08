"use client"

import { useEffect, useState } from "react"
import type { DashboardStats, Booking } from "@/lib/types"
import { StatsCards } from "@/components/stats-cards"
import { VerificationBanner } from "@/components/verification-banner"
import { RevenueChart } from "@/components/revenue-chart"
import { UrgentTasks } from "@/components/urgent-tasks"
import { RecentApplicants } from "@/components/recent-applicants"
import { AccountStatusCard } from "@/components/account-status-card"
import { api } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/api-endpoints"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalBookings: 0,
    bookingsChange: 0,
    pendingPayments: 0,
    paymentsChange: 0,
    visaExpiring: 0,
    visaChange: 0,
    activePackages: 0,
    seatsFilled: 0,
    totalSeats: 0,
    revenueProjected: 0,
  })
  const [revenueData, setRevenueData] = useState([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [operator, setOperator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResult, revenueResult, bookingsResult, userResult, tierResult, metricsResult] =
        await Promise.allSettled([
          api.get(ENDPOINTS.REPORTS.DASHBOARD_STATS),
          api.get(ENDPOINTS.REPORTS.REVENUE_FLOW),
          api.get(ENDPOINTS.BOOKINGS.RECENT),
          api.get(ENDPOINTS.PROFILE.GET),
          api.get(ENDPOINTS.TIER.INFO),
          api.get(ENDPOINTS.METRICS.OVERVIEW),
        ])

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value)
      }

      if (revenueResult.status === "fulfilled") {
        setRevenueData(revenueResult.value)
      }

      if (bookingsResult.status === "fulfilled") {
        const mappedBookings = (bookingsResult.value as any[]).map((booking: any) => ({
          id: String(booking.id),
          packageId: String(booking.packageId || booking.package?.id || ""),
          pilgrimId: String(booking.pilgrimId || booking.userId || ""),
          pilgrimName: booking.pilgrimName || "Unknown",
          pilgrimEmail: booking.pilgrimEmail || "",
          packageTitle: booking.package?.title || "Unknown Package",
          amount: Number(booking.totalAmount || booking.amount || 0),
          paymentStatus:
            booking.status === "fully_paid" ? "completed" : booking.status === "deposit_paid" ? "partial" : "pending",
          travelDate: booking.travelDate || booking.package?.startDate || new Date().toISOString(),
          createdAt: booking.createdAt || new Date().toISOString(),
        }))
        setRecentBookings(mappedBookings)
      }

      const userData = userResult.status === "fulfilled" ? userResult.value : null
      const tierData = tierResult.status === "fulfilled" ? tierResult.value : null
      const metrics = metricsResult.status === "fulfilled" ? metricsResult.value : null

      if (userData) {
        setOperator({
          ...userData,
          tier: tierData?.tier || userData.tier || "BRONZE",
          tierInfo: tierData?.tierInfo,
          trustScore: metrics?.trustScore || tierData?.trustScore || 0,
          trustBadges: tierData?.badges || [],
          documents: tierData?.documents || [],
          totalBookings: metrics?.totalBookings || 0,
          successfulBookings: metrics?.successfulBookings || 0,
          cancelledBookings: metrics?.cancelledBookings || 0,
          monthlyBookingsCount: metrics?.monthlyBookingsCount || 0,
          activePackagesCount: metrics?.activePackagesCount || 0,
        })
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Here's your business overview for today</p>
      </div>

      <StatsCards stats={stats} />
      <VerificationBanner />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <RevenueChart data={revenueData} />
          <RecentApplicants bookings={recentBookings} />
        </div>
        <div className="space-y-6">
          {operator && <AccountStatusCard operator={operator} />}
          <UrgentTasks />
        </div>
      </div>
    </div>
  )
}
