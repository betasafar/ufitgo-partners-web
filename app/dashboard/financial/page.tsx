"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { TrendingUp, TrendingDown, Download } from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalBookings: number
  bookingsChange: number
  pendingPayments: number
  paymentsDue: number
  visaSuccessRate: number
  upcomingDeparture: string
}

interface RevenueFlowData {
  month: string
  revenue: number
  expenses: number
}

interface TopPackage {
  id: string
  name: string
  booked: number
  total: number
  revenue: number
}

interface Transaction {
  id: string
  applicantName: string
  applicantId: string
  packageName: string
  date: string
  status: string
  amount: number
}

export default function FinancialPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueFlowData[]>([])
  const [topPackages, setTopPackages] = useState<TopPackage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("this-month")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001"

        // Fetch dashboard stats
        const statsRes = await fetch(`${apiUrl}/operator/reports/dashboard-stats`)
        const statsData = await statsRes.json()
        setStats(statsData)

        // Fetch revenue flow data
        const revenueRes = await fetch(`${apiUrl}/operator/reports/revenue-flow?period=monthly`)
        const revenueFlowData = await revenueRes.json()
        setRevenueData(revenueFlowData)

        // Fetch popular packages
        const packagesRes = await fetch(`${apiUrl}/operator/reports/popular-packages?limit=3`)
        const packagesData = await packagesRes.json()
        setTopPackages(packagesData)

        // Fetch recent transactions (using wallet endpoint)
        const transactionsRes = await fetch(`${apiUrl}/operator/wallet/transactions?limit=5`)
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      } catch (error) {
        console.error("[v0] Failed to fetch financial data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timePeriod])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading financial data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Salaam, Ibrahim.</div>
          <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
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
            <div className="text-2xl font-bold text-foreground mb-1">
              ₦{stats?.totalRevenue?.toLocaleString() || "0"}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-4" />
              <span>+{stats?.revenueChange || 0}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Total Bookings</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">👥</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats?.totalBookings || 0}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>+{stats?.bookingsChange || 0}% new applicants</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Outstanding Balance</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">📊</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ₦{stats?.pendingPayments?.toLocaleString() || "0"}
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingDown className="size-3" />
              <span>{stats?.paymentsDue || 0} payments overdue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-muted-foreground">Visa Success Rate</div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">✈</div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats?.visaSuccessRate || 0}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>{stats?.upcomingDeparture || "Next flight soon"}</span>
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
                <div key={pkg.id}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{pkg.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {pkg.booked}/{pkg.total} slots booked
                      </div>
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
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {txn.applicantName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{txn.applicantName}</div>
                          <div className="text-xs text-muted-foreground">ID: {txn.applicantId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{txn.packageName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{txn.date}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                          txn.status === "paid" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            txn.status === "paid" ? "bg-green-600" : "bg-yellow-600"
                          }`}
                        />
                        {txn.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">₦{txn.amount.toLocaleString()}</td>
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
