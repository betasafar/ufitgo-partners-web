import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SessionTimeoutDialog } from "@/components/session-timeout-dialog"
import { cookies } from "next/headers"
import type { Operator } from "@/lib/types"

export const metadata = {
  title: "Dashboard - TravelOps",
  description: "Operator dashboard",
}

async function getOperator(): Promise<Operator> {
  try {
    const cookieStore = await cookies()
    const operatorDataCookie = cookieStore.get("operator_data")?.value

    if (operatorDataCookie) {
      const operatorData = JSON.parse(operatorDataCookie)
      // Map backend response to our Operator type
      return {
        id: String(operatorData.id),
        companyName: operatorData.companyName || "Travel Agency",
        email: operatorData.email,
        phone: operatorData.phone || "",
        logo: operatorData.logo,
        verified: operatorData.verificationStatus === "approved",
        verificationStatus: operatorData.verificationStatus || "pending",
        cacRegistration: operatorData.cacRegistration || "",
        nahconLicense: operatorData.nahconLicense || "",
        role: "operator",
      }
    }

    // Fallback to default operator if no session data
    return {
      id: "1",
      companyName: "Travel Agency",
      email: "operator@travelops.com",
      phone: "",
      verified: false,
      verificationStatus: "pending",
      cacRegistration: "",
      nahconLicense: "",
      role: "operator",
    }
  } catch (error) {
    console.error("[v0] Failed to get operator from session:", error)
    // Return default operator on error
    return {
      id: "1",
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
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
      <SessionTimeoutDialog />
    </div>
  )
}
