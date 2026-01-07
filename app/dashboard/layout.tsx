import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SessionTimeoutDialog } from "@/components/session-timeout-dialog"
import { getCurrentUser } from "@/lib/api-proxy"
import { Suspense } from "react"
import type { Operator } from "@/lib/types"

export const metadata = {
  title: "Dashboard - TravelOps",
  description: "Operator dashboard",
}

async function getOperator(): Promise<Operator> {
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
      }
    }

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
