"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { TrendingUp, TrendingDown, Download } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 25000000, expenses: 18000000 },
  { month: "Feb", revenue: 28000000, expenses: 19000000 },
  { month: "Mar", revenue: 32000000, expenses: 21000000 },
  { month: "Apr", revenue: 29000000, expenses: 20000000 },
  { month: "May", revenue: 38000000, expenses: 23000000 },
  { month: "Jun", revenue: 45000000, expenses: 25000000 },
]

const topPackages = [
  { name: "Hajj Deluxe 2024", slots: "45/50", booked: 45, total: 50, revenue: 4500000 },
  { name: "Umrah Premium", slots: "120/200", booked: 120, total: 200, revenue: 2200000 },
  { name: "Ramadan Special", slots: "40/40", booked: 40, total: 40, revenue: 3800000 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Salaam, Ibrahim.</div>
          <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="size-4" />
            Record Payment
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
            <div className="text-2xl font-bold text-foreground mb-1">₦45,000,000</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Total Bookings</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">👥</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">342</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+5% new applicants</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Outstanding Balance</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">📊</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">₦2,150,000</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingDown className="size-3" />
              <span>24 payments overdue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Visa Success Rate</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">✈</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">98.5%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>Next flight in 14 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Revenue Analytics</h2>
                <p className="text-sm text-muted-foreground">Income vs Expenses over the last 6 months</p>
              </div>
              <Button variant="ghost" size="sm">
                ⋮
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--muted))" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Packages</h2>
            <div className="space-y-4">
              {topPackages.map((pkg) => (
                <div key={pkg.name}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{pkg.name}</div>
                      <div className="text-xs text-muted-foreground">{pkg.slots} slots booked</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">₦{(pkg.revenue / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(pkg.booked / pkg.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
              View All Packages
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                ⚙
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="size-4" />
              </Button>
            </div>
          </div>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left text-xs uppercase text-muted-foreground px-4 py-3">Applicant</th>
                  <th className="text-left text-xs uppercase text-muted-foreground px-4 py-3">Package</th>
                  <th className="text-left text-xs uppercase text-muted-foreground px-4 py-3">Date</th>
                  <th className="text-right text-xs uppercase text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-right text-xs uppercase text-muted-foreground px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        IM
                      </div>
                      <div>
                        <div className="text-sm font-medium">Musa Ibrahim</div>
                        <div className="text-xs text-muted-foreground">ID: HAJJ-24-001</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">Hajj Premium 2024</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">Oct 24, 2024</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs">
                      <span className="size-1.5 rounded-full bg-green-600" />
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">₦2,500,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
