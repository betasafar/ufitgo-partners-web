// Create a new package page
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SoftLimitMessage } from "@/components/soft-limit-message"
import { ArrowLeft, Save, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import type { OperatorWithTier } from "@/lib/types"
import { getTierInfo, getOperatorMetrics } from "@/lib/api-proxy"

export default function CreatePackagePage() {
  const router = useRouter()
  const [operator, setOperator] = useState<OperatorWithTier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTierData() {
      try {
        const [tierData, metrics] = await Promise.all([getTierInfo(), getOperatorMetrics()])

        setOperator({
          id: "1",
          email: "",
          companyName: "",
          phone: "",
          role: "operator",
          verified: true,
          verificationStatus: "approved",
          cacRegistration: "",
          nahconLicense: "",
          tier: tierData.tier,
          tierInfo: tierData.tierInfo,
          trustScore: tierData.trustScore,
          trustBadges: tierData.badges,
          documents: tierData.documents || [],
          totalBookings: metrics.totalBookings,
          successfulBookings: metrics.successfulBookings,
          cancelledBookings: metrics.cancelledBookings,
          monthlyBookingsCount: metrics.monthlyBookingsCount,
          activePackagesCount: metrics.activePackagesCount,
        })
      } catch (error) {
        console.error("Failed to load tier data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTierData()
  }, [])

  if (loading || !operator) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const { tierInfo, activePackagesCount = 0, verificationStatus } = operator
  const canCreatePackage = activePackagesCount < tierInfo.maxActivePackages
  const isVerified = verificationStatus === "approved"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Package</h1>
          <p className="text-muted-foreground">Design your Hajj or Umrah package</p>
        </div>
      </div>

      <SoftLimitMessage
        current={activePackagesCount}
        limit={tierInfo.maxActivePackages}
        feature="packages"
        upgradeAction={isVerified ? "Contact support" : "Complete verification"}
        upgradeLink={isVerified ? "/dashboard/settings" : "/dashboard/verification"}
      />

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
          <CardDescription>Provide the basic information about your package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name *</Label>
              <Input id="packageName" placeholder="e.g., Premium Hajj 2026" disabled={!canCreatePackage} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₦) *</Label>
              <Input id="price" type="number" placeholder="5000000" disabled={!canCreatePackage} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your package, including accommodation, meals, and services..."
              className="min-h-[100px]"
              disabled={!canCreatePackage}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPilgrims">Maximum Pilgrims *</Label>
              <Input
                id="maxPilgrims"
                type="number"
                placeholder={`Up to ${tierInfo.maxPilgrimsPerBooking} pilgrims`}
                max={tierInfo.maxPilgrimsPerBooking}
                disabled={!canCreatePackage}
              />
              {tierInfo.maxPilgrimsPerBooking < 100 && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Higher limits available for verified operators. Complete verification to accept larger groups.
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flexibleDates">Flexible Dates</Label>
              <Input
                id="flexibleDates"
                type="text"
                placeholder="Allow flexible travel dates"
                disabled={!canCreatePackage || !tierInfo.canCreateCustomPackages}
              />
              {!tierInfo.canCreateCustomPackages && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    This feature is available for experienced verified operators. Contact support to learn more.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPricing">Custom Pricing</Label>
            <Input
              id="customPricing"
              placeholder="Set dynamic pricing based on demand"
              disabled={!canCreatePackage || !tierInfo.canCreateCustomPackages}
            />
            <p className="text-xs text-muted-foreground">
              Create pricing tiers, early bird discounts, and seasonal rates. Available for experienced operators.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button disabled={!canCreatePackage} className="gap-2">
          <Save className="h-4 w-4" />
          {canCreatePackage ? "Create Package" : "Package Limit Reached"}
        </Button>
      </div>
    </div>
  )
}
