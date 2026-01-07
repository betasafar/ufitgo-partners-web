import { getCurrentUser } from "@/lib/api-proxy"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LockedChartOverlay } from "@/components/locked-chart-overlay"
import { TierBadge } from "@/components/tier-badge"
import { TrendingUp, Users, DollarSign, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getAnalyticsData(operatorId: number, tier: string) {
  // Basic metrics available to all tiers
  const basicMetrics = {
    totalBookings: 156,
    totalRevenue: 2450000,
    activePackages: 8,
    avgBookingValue: 15705,
  }

  // Advanced metrics only for SILVER+
  const advancedMetrics =
    tier !== "BRONZE"
      ? {
          bookingTrends: [
            /* chart data */
          ],
          customerDemographics: [
            /* chart data */
          ],
          monthlyGrowth: 23.5,
        }
      : null

  // Premium metrics only for GOLD
  const premiumMetrics =
    tier === "GOLD"
      ? {
          predictiveAnalytics: [
            /* chart data */
          ],
          industryBenchmarks: [
            /* chart data */
          ],
          customReports: true,
        }
      : null

  return { basicMetrics, advancedMetrics, premiumMetrics }
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const tier = user.tier || "BRONZE"
  const analytics = await getAnalyticsData(user.id, tier)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} size="lg" showLabel />
          {tier === "GOLD" && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Basic Metrics - Available to all tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.basicMetrics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.basicMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.basicMetrics.activePackages}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.basicMetrics.avgBookingValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per booking</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends - SILVER+ */}
      <LockedChartOverlay title="Booking Trends" requiredTier="SILVER" currentTier={tier} previewMode>
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Track your bookings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded">Sample Chart Data</div>
          </CardContent>
        </Card>
      </LockedChartOverlay>

      {/* Customer Demographics - SILVER+ */}
      <LockedChartOverlay title="Customer Demographics" requiredTier="SILVER" currentTier={tier} previewMode>
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>Understand your customer base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded">
              Sample Demographics Data
            </div>
          </CardContent>
        </Card>
      </LockedChartOverlay>

      {/* Predictive Analytics - GOLD only */}
      <LockedChartOverlay title="Predictive Analytics" requiredTier="GOLD" currentTier={tier} previewMode>
        <Card>
          <CardHeader>
            <CardTitle>Predictive Analytics</CardTitle>
            <CardDescription>AI-powered forecasting and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded">Sample Predictive Data</div>
          </CardContent>
        </Card>
      </LockedChartOverlay>

      {/* Industry Benchmarks - GOLD only */}
      <LockedChartOverlay title="Industry Benchmarks" requiredTier="GOLD" currentTier={tier} previewMode>
        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmarks</CardTitle>
            <CardDescription>Compare your performance with industry standards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded">Sample Benchmark Data</div>
          </CardContent>
        </Card>
      </LockedChartOverlay>
    </div>
  )
}
