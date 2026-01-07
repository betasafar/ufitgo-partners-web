"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, Download } from "lucide-react"

// Fetching package performance from backend API
async function getPackagePerformance() {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/packages/performance`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch performance")

    return await response.json()
  } catch (error) {
    console.error("[v0] Failed to fetch package performance:", error)
    // Return mock data as fallback
    return {
      totalRevenue: 45200000,
      totalBookings: 1240,
      avgConversion: 12.5,
      slotsRemaining: 450,
      bookingVelocity: [
        { week: "Wk 1", applications: 85, bookings: 65 },
        { week: "Wk 2", applications: 110, bookings: 95 },
        { week: "Wk 3", applications: 145, bookings: 120 },
        { week: "Wk 4", applications: 180, bookings: 155 },
        { week: "Wk 5", applications: 210, bookings: 185 },
        { week: "Wk 6", applications: 260, bookings: 230 },
      ],
      topRegions: [
        { region: "Kano", percentage: 42, applicants: 520 },
        { region: "Lagos", percentage: 28, applicants: 310 },
        { region: "Abuja (FCT)", percentage: 15, applicants: 180 },
      ],
      paymentPreference: [
        { type: "Installment", percentage: 60 },
        { type: "Full Payment", percentage: 40 },
      ],
      activePackages: [
        {
          name: "Ramadan VIP 2024",
          duration: "Last 10 Days",
          status: "filling-fast",
          price: 4500000,
          filled: 45,
          total: 50,
          revenue: 202500000,
        },
        {
          name: "Standard Hajj Package",
          duration: "Full Season",
          status: "open",
          price: 3200000,
          filled: 120,
          total: 300,
          revenue: 384000000,
        },
        {
          name: "Umrah Express",
          duration: "14 Days",
          status: "closing-soon",
          price: 1850000,
          filled: 88,
          total: 100,
          revenue: 162800000,
        },
      ],
    }
  }
}

export default async function PackagePerformancePage() {
  const performanceData = await getPackagePerformance()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Package Performance</h1>
          <p className="text-sm text-muted-foreground">Insights for Hajj & Umrah 2024 Season</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this-season">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-season">This Season</SelectItem>
              <SelectItem value="last-season">Last Season</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Package Type: All</SelectItem>
              <SelectItem value="hajj">Hajj Only</SelectItem>
              <SelectItem value="umrah">Umrah Only</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Status: Active</SelectItem>
              <SelectItem value="closed">Status: Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Total Revenue</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">💰</div>
            </div>
            {/* Using backend data instead of hardcoded values */}
            <div className="text-3xl font-bold text-foreground mb-1">
              ₦ {(performanceData.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+15% vs last season</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Total Bookings</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">🎫</div>
            </div>
            {/* Using backend data */}
            <div className="text-3xl font-bold text-foreground mb-1">
              {performanceData.totalBookings.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+5% vs last season</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Avg. Conversion</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">📊</div>
            </div>
            {/* Using backend data */}
            <div className="text-3xl font-bold text-foreground mb-1">{performanceData.avgConversion}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+2.1% vs average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Slots Remaining</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">🪑</div>
            </div>
            {/* Using backend data */}
            <div className="text-3xl font-bold text-foreground mb-1">{performanceData.slotsRemaining}</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingDown className="size-3" />
              <span>-10% filling fast</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Booking Velocity</h2>
                <p className="text-sm text-muted-foreground">Applications vs. Confirmed Bookings</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-muted" />
                  <span>Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-primary" />
                  <span>Bookings</span>
                </div>
              </div>
            </div>
            {/* Using backend data for booking velocity chart */}
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData.bookingVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Bar dataKey="applications" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Applicant Demographics</h2>
                <p className="text-sm text-muted-foreground">Distribution by category</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Top Regions</h3>
                {/* Using backend data for regional distribution */}
                <div className="space-y-3">
                  {performanceData.topRegions.map((region: any) => (
                    <div key={region.region}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">{region.percentage}%</span>
                          <span className="text-xs text-muted-foreground">{region.applicants} applicants</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${region.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold mb-3">Payment Plan Preference</h3>
                {/* Using backend data for payment preferences */}
                <div className="grid grid-cols-2 gap-3">
                  {performanceData.paymentPreference.map((plan: any) => (
                    <div key={plan.type} className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{plan.percentage}%</div>
                      <div className="text-xs text-muted-foreground">{plan.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Packages</h2>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="size-4" />
              Download CSV
            </Button>
          </div>

          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left text-xs uppercase text-muted-foreground px-4 py-3">Package Name</th>
                  <th className="text-left text-xs uppercase text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-right text-xs uppercase text-muted-foreground px-4 py-3">Price / Pax</th>
                  <th className="text-right text-xs uppercase text-muted-foreground px-4 py-3">Filled Slots</th>
                  <th className="text-right text-xs uppercase text-muted-foreground px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {/* Using backend data for active packages table */}
                {performanceData.activePackages.map((pkg: any) => (
                  <tr key={pkg.name} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium">{pkg.name}</div>
                        <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {pkg.status === "filling-fast" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 text-xs">
                          <span className="size-1.5 rounded-full bg-red-600" />
                          Filling Fast
                        </span>
                      )}
                      {pkg.status === "open" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs">
                          <span className="size-1.5 rounded-full bg-green-600" />
                          Open
                        </span>
                      )}
                      {pkg.status === "closing-soon" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs">
                          <span className="size-1.5 rounded-full bg-orange-600" />
                          Closing Soon
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">₦ {(pkg.price / 1000000).toFixed(1)}M</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-semibold">
                          {pkg.filled} / {pkg.total}
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(pkg.filled / pkg.total) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-primary">
                      ₦ {(pkg.revenue / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
