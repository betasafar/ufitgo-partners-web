import type { DashboardStats, RevenueDataPoint, Booking } from "@/lib/types"
import { StatsCards } from "@/components/stats-cards"
import { VerificationBanner } from "@/components/verification-banner"
import { RevenueChart } from "@/components/revenue-chart"
import { UrgentTasks } from "@/components/urgent-tasks"
import { RecentApplicants } from "@/components/recent-applicants"
import { Suspense } from "react"
import { mockRevenueFlow, mockApplicants } from "@/lib/mock-data"
import { cookies } from "next/headers"

async function getDashboardData() {
  const cookieStore = await cookies()
  const operatorData = cookieStore.get("operator_data")?.value
  const operator = operatorData ? JSON.parse(operatorData) : null

  const stats: DashboardStats = {
    totalRevenue: 45000000,
    totalBookings: 342,
    outstandingBalance: 2150000,
    visaSuccessRate: 98.5,
  }

  const revenueData: RevenueDataPoint[] = mockRevenueFlow.map((item) => ({
    month: item.month,
    revenue: item.revenue,
    expenses: item.revenue * 0.65,
  }))

  const recentBookings: Booking[] = mockApplicants.slice(0, 5).map((applicant) => ({
    id: applicant.id,
    name: applicant.name,
    passport: applicant.passport,
    package: applicant.package,
    bookingDate: applicant.bookingDate,
    status: applicant.status,
    visaStatus: applicant.visaStatus,
    paymentProgress: applicant.paymentProgress,
    avatar: applicant.avatar,
  }))

  return { stats, revenueData, recentBookings, operator }
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
