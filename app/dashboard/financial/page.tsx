import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertCircle, Calendar, Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - will be replaced with real API calls
const financialStats = {
  totalRevenue: 45000000,
  totalBookings: 342,
  outstandingBalance: 2150000,
  visaSuccessRate: 98.5,
  revenueChange: 12.5,
  bookingsChange: 5,
  overduePayments: 24,
  nextFlightDays: 14,
}

const revenueData = [
  { month: "Jan", revenue: 7200000, expenses: 4800000 },
  { month: "Feb", revenue: 6800000, expenses: 4500000 },
  { month: "Mar", revenue: 8100000, expenses: 5200000 },
  { month: "Apr", revenue: 7900000, expenses: 4900000 },
  { month: "May", revenue: 9500000, expenses: 5800000 },
  { month: "Jun", revenue: 10200000, expenses: 6100000 },
]

const topPackages = [
  { id: 1, name: "Hajj Deluxe 2024", slots: "45/50", revenue: 4500000, image: "🕋" },
  { id: 2, name: "Umrah Premium Package", slots: "120/200", revenue: 2200000, image: "🕌" },
  { id: 3, name: "Ramadan Special", slots: "Full", revenue: 3800000, image: "🌙" },
]

const recentTransactions = [
  {
    id: 1,
    applicant: "Yusuf Abdullahi",
    package: "Hajj Deluxe 2024",
    date: "Oct 24, 2023",
    amount: 2500000,
    status: "completed",
  },
  {
    id: 2,
    applicant: "Amina Ibrahim",
    package: "Umrah Premium",
    date: "Oct 23, 2023",
    amount: 1800000,
    status: "completed",
  },
  {
    id: 3,
    applicant: "Mohammed Hassan",
    package: "Standard Hajj",
    date: "Oct 22, 2023",
    amount: 1500000,
    status: "pending",
  },
]

export default function FinancialOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Salaam, Ibrahim.</p>
          <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            This Month
          </Button>
          <Button variant="outline" size="sm">
            Last Month
          </Button>
          <Button variant="outline" size="sm">
            YTD
          </Button>
          <Button className="gap-2">Record Payment</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">₦{(financialStats.totalRevenue / 1000000).toFixed(1)}M</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="size-4" />
                <span>+{financialStats.revenueChange}% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-3xl font-bold">{financialStats.totalBookings}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="size-4" />
                <span>+{financialStats.bookingsChange}% new applicants</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-3xl font-bold">₦{(financialStats.outstandingBalance / 1000000).toFixed(1)}M</p>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="size-4" />
                <span>{financialStats.overduePayments} payments overdue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Visa Success Rate</p>
              <p className="text-3xl font-bold">{financialStats.visaSuccessRate}%</p>
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Calendar className="size-4" />
                <span>Next flight in {financialStats.nextFlightDays} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Income vs Expenses over the last 6 months</p>
            </div>
            <Button variant="ghost" size="icon">
              <span className="text-xl">⋮</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#eab308" />
                <Bar dataKey="expenses" name="Expenses" fill="#78716c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                  {pkg.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.slots} slots booked</p>
                </div>
                <p className="font-semibold text-primary">₦{(pkg.revenue / 1000000).toFixed(1)}M</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Packages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <span className="text-xl">⋮</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground pb-3 border-b">
              <div>Applicant</div>
              <div>Package</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Amount</div>
            </div>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {transaction.applicant.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{transaction.applicant}</span>
                </div>
                <div className="text-sm">{transaction.package}</div>
                <div className="text-sm text-muted-foreground">{transaction.date}</div>
                <div>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                    {transaction.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                </div>
                <div className="text-sm font-semibold text-right">₦{transaction.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
