import type { DashboardStats, RevenueDataPoint, Booking } from "@/lib/types"
import { StatsCards } from "@/components/stats-cards"
import { VerificationBanner } from "@/components/verification-banner"
import { RevenueChart } from "@/components/revenue-chart"
import { UrgentTasks } from "@/components/urgent-tasks"
import { RecentApplicants } from "@/components/recent-applicants"
import { Suspense } from "react"
import { apiRequest } from "@/lib/api"
import { cookies } from "next/headers"

async function getDashboardData() {
  const cookieStore = await cookies()
  const operatorData = cookieStore.get("operator_data")?.value
  const operator = operatorData ? JSON.parse(operatorData) : null

  try {
    const stats: DashboardStats = await apiRequest("/operator/analytics/dashboard-stats")
    const revenueData: { data: RevenueDataPoint[] } = await apiRequest("/operator/analytics/revenue-flow", {
      params: { period: "30days" },
    })
    const recentBookings: Booking[] = await apiRequest("/operator/bookings/recent", {
      params: { limit: "5" },
    })

    return { stats, revenueData: revenueData.data, recentBookings, operator }
  } catch (error) {
    console.error("[v0] Failed to load dashboard data:", error)
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
      operator,
    }
  }
}

export default async function DashboardPage() {
  const { stats, revenueData, recentBookings, operator } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {operator?.companyName || "Travel Agency"}</h1>
        <p className="text-muted-foreground">Here's your business overview for today</p>
      </div>

      <StatsCards stats={stats} />

      <Suspense fallback={<div>Loading...</div>}>
        <VerificationBanner />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <UrgentTasks />
        </div>
      </div>

      <RecentApplicants bookings={recentBookings} />
    </div>
  )
}
