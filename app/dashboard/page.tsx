import type { DashboardStats, Booking } from "@/lib/types"
import { StatsCards } from "@/components/stats-cards"
import { VerificationBanner } from "@/components/verification-banner"
import { RevenueChart } from "@/components/revenue-chart"
import { UrgentTasks } from "@/components/urgent-tasks"
import { RecentApplicants } from "@/components/recent-applicants"
import { TierOverviewCard } from "@/components/tier-overview-card"
import { Suspense } from "react"
import { apiRequest, getCurrentUser, getTierInfo, getOperatorMetrics } from "@/lib/api-proxy"

async function getDashboardData() {
  try {
    const [statsResult, revenueResult, bookingsResult, userResult, tierResult, metricsResult] =
      await Promise.allSettled([
        apiRequest("/operator/reports/dashboard-stats", { next: { revalidate: 60 } }),
        apiRequest("/operator/reports/revenue-flow", { next: { revalidate: 120 } }),
        apiRequest("/operator/bookings/recent", { next: { revalidate: 90 } }),
        getCurrentUser(),
        getTierInfo(),
        getOperatorMetrics(),
      ])

    const stats = statsResult.status === "fulfilled" ? statsResult.value : null
    const revenueDataResponse = revenueResult.status === "fulfilled" ? revenueResult.value : []
    const recentBookings = bookingsResult.status === "fulfilled" ? bookingsResult.value : []
    const userData = userResult.status === "fulfilled" ? userResult.value : null
    const tierData = tierResult.status === "fulfilled" ? tierResult.value : null
    const metrics = metricsResult.status === "fulfilled" ? metricsResult.value : null

    const revenueData = Array.isArray(revenueDataResponse)
      ? revenueDataResponse
      : (revenueDataResponse as any)?.data || []

    const mappedStats: DashboardStats = {
      totalRevenue: stats?.totalRevenue || 0,
      revenueChange: stats?.revenueChange || 0,
      totalBookings: stats?.totalBookings || 0,
      bookingsChange: stats?.bookingsChange || 0,
      pendingPayments: stats?.pendingPayments || 0,
      paymentsChange: 0,
      visaExpiring: 0,
      visaChange: 0,
      activePackages: stats?.activePackages || 0,
      seatsFilled: 0,
      totalSeats: 0,
      revenueProjected: 0,
    }

    const mappedBookings: Booking[] = (recentBookings as any[]).map((booking: any) => ({
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

    const operatorWithTier = userData
      ? {
          ...userData,
          tier: tierData?.tier || userData.tier || "BRONZE",
          tierInfo: tierData?.tierInfo || {
            level: userData.tier || "BRONZE",
            maxPilgrimsPerBooking: 50,
            maxActivePackages: 5,
            maxMonthlyBookings: 50,
            requiresEscrow: true,
            canCreateCustomPackages: false,
            hasAnalyticsAccess: false,
            hasPrioritySupport: false,
            features: [],
          },
          trustScore: metrics?.trustScore || tierData?.trustScore || 0,
          trustBadges: tierData?.badges || [],
          documents: tierData?.documents || [],
          totalBookings: metrics?.totalBookings || 0,
          successfulBookings: metrics?.successfulBookings || 0,
          cancelledBookings: metrics?.cancelledBookings || 0,
          monthlyBookingsCount: metrics?.monthlyBookingsCount || 0,
          activePackagesCount: metrics?.activePackagesCount || 0,
        }
      : null

    return { stats: mappedStats, revenueData, recentBookings: mappedBookings, operator: operatorWithTier }
  } catch (error) {
    console.error("[v0] Dashboard data fetch error:", error)
    return {
      stats: {
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
      },
      revenueData: [],
      recentBookings: [],
      operator: null,
    }
  }
}

export default async function DashboardPage() {
  const { stats, revenueData, recentBookings, operator } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Here's your business overview for today</p>
      </div>

      <StatsCards stats={stats} />

      <Suspense fallback={<div>Loading...</div>}>
        <VerificationBanner />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <RevenueChart data={revenueData} />
          <RecentApplicants bookings={recentBookings} />
        </div>
        <div className="space-y-6">
          {operator && <TierOverviewCard operator={operator} />}
          <Suspense fallback={<div className="animate-pulse h-48 bg-muted/10 rounded-lg" />}>
            <UrgentTasks />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
