import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SessionTimeoutDialog } from "@/components/session-timeout-dialog"
import { getCurrentUser, getTierInfo, getOperatorMetrics } from "@/lib/api-proxy"
import { Suspense } from "react"
import type { OperatorWithTier, TierLevel } from "@/lib/types"

export const metadata = {
  title: "Dashboard - TravelOps",
  description: "Operator dashboard",
}

async function getOperator(): Promise<OperatorWithTier> {
  try {
    const userData = await getCurrentUser()

    if (!userData) {
      console.warn("[v0] No user data available, using fallback")
      return {
        id: "0",
        companyName: "Guest User",
        email: "guest@travelops.com",
        phone: "",
        verified: false,
        verificationStatus: "pending",
        cacRegistration: "",
        nahconLicense: "",
        role: "operator",
        tier: "BRONZE" as TierLevel,
        tierInfo: {
          level: "BRONZE" as TierLevel,
          maxPilgrimsPerBooking: 50,
          maxActivePackages: 5,
          maxMonthlyBookings: 50,
          requiresEscrow: true,
          canCreateCustomPackages: false,
          hasAnalyticsAccess: false,
          hasPrioritySupport: false,
          features: [],
        },
        trustScore: 0,
        trustBadges: [],
        documents: [],
        totalBookings: 0,
        successfulBookings: 0,
        cancelledBookings: 0,
        monthlyBookingsCount: 0,
        activePackagesCount: 0,
      }
    }

    const [tierResult, metricsResult] = await Promise.allSettled([getTierInfo(), getOperatorMetrics()])

    const tierData = tierResult.status === "fulfilled" ? tierResult.value : null
    const metrics = metricsResult.status === "fulfilled" ? metricsResult.value : null

    return {
      id: String(userData.id),
      companyName: userData.companyName || userData.company_name || "Travel Agency",
      email: userData.email,
      phone: userData.phone || userData.phoneNumber || "",
      logo: userData.logo || userData.logoUrl,
      verified: userData.verificationStatus === "approved" || userData.verified === true,
      verificationStatus: userData.verificationStatus || userData.verification_status || "pending",
      cacRegistration: userData.cacRegistration || userData.cac_registration || "",
      nahconLicense: userData.nahconLicense || userData.nahcon_license || "",
      role: "operator",
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
  } catch (error) {
    console.error("[v0] Failed to load operator:", error)
    return {
      id: "0",
      companyName: "Travel Agency",
      email: "operator@travelops.com",
      phone: "",
      verified: false,
      verificationStatus: "pending",
      cacRegistration: "",
      nahconLicense: "",
      role: "operator",
      tier: "BRONZE" as TierLevel,
      tierInfo: {
        level: "BRONZE" as TierLevel,
        maxPilgrimsPerBooking: 50,
        maxActivePackages: 5,
        maxMonthlyBookings: 50,
        requiresEscrow: true,
        canCreateCustomPackages: false,
        hasAnalyticsAccess: false,
        hasPrioritySupport: false,
        features: [],
      },
      trustScore: 0,
      trustBadges: [],
      documents: [],
      totalBookings: 0,
      successfulBookings: 0,
      cancelledBookings: 0,
      monthlyBookingsCount: 0,
      activePackagesCount: 0,
    }
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const operator = await getOperator()

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar operator={operator} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader operator={operator} />
        <main className="flex-1 p-6 lg:p-8">
          <Suspense fallback={<div className="animate-pulse h-full bg-muted/10 rounded-lg" />}>{children}</Suspense>
        </main>
      </div>
      <SessionTimeoutDialog />
    </div>
  )
}
