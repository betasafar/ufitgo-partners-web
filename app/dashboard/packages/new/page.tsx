// app/dashboard/packages/new/page.tsx
// Server Component - fetches authenticated operator data securely

import { getTierInfo, getOperatorMetrics } from "@/lib/api-proxy"
import CreatePackageClient from "@/components/create-package-client"
import { OperatorWithTier } from "@/lib/types"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Create New Package | Operator Dashboard",
}

export default async function CreatePackagePage() {
  const [tierData, metrics] = await Promise.all([
    getTierInfo(),
    getOperatorMetrics(),
  ])

  if (!tierData || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg text-red-600">Failed to load operator data.</p>
        <p className="text-muted-foreground">Please refresh the page or log in again.</p>
      </div>
    )
  }

  const operator: OperatorWithTier = {
    id: "current", // placeholder — real ID comes from auth if needed
    email: "",
    companyName: "",
    phone: "",
    role: "operator",
    verified: tierData.verificationStatus === "approved",
    verificationStatus: tierData.verificationStatus || "pending",
    cacRegistration: "",
    nahconLicense: "",
    tier: tierData.tier || "basic",
    tierInfo: tierData.tierInfo,
    trustScore: tierData.trustScore || 0,
    trustBadges: tierData.badges || [],
    documents: tierData.documents || [],
    totalBookings: metrics.totalBookings || 0,
    successfulBookings: metrics.successfulBookings || 0,
    cancelledBookings: metrics.cancelledBookings || 0,
    monthlyBookingsCount: metrics.monthlyBookingsCount || 0,
    activePackagesCount: metrics.activePackagesCount || 0,
  }

  const canCreatePackage = operator.activePackagesCount < operator.tierInfo.maxActivePackages

  // Optional: redirect if limit reached and not verified enough
  // if (!canCreatePackage && operator.verificationStatus !== "approved") {
  //   redirect("/dashboard/packages")
  // }

  return <CreatePackageClient operator={operator} canCreateInitially={canCreatePackage} />
}