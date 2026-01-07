"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Filter, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface PaymentStats {
  monthlyCollected: number // This month's revenue from completed credits
  pendingWithdrawals: number // Pending payout requests
  totalTransactions: number
  averageTransaction: number
}

interface Transaction {
  id: number
  amount: number
  type: "credit" | "debit" | "refund"
  status: "pending" | "completed" | "failed"
  description?: string
  createdAt: string
  booking?: {
    pilgrim?: {
      fullName: string
      id: number
    }
    package?: {
      title: string
    }
  } | null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function PaymentsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchPaymentData = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1]

      console.log("[v0] Payments page - Token exists:", !!token)

      if (!token) {
        setError("Please log in to view payments")
        setLoading(false)
        return
      }

      try {
        // 1. Fetch payment stats
        const statsRes = await fetch(`${apiUrl}/operator/wallet/payment-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        let monthlyCollected = 0
        let pendingWithdrawals = 0
        let totalTransactions = 0
        let averageTransaction = 0

        if (statsRes.ok) {
          const data = await statsRes.json()
          monthlyCollected = data.monthlyCollected || 0
          pendingWithdrawals = data.pendingWithdrawals || 0
          totalTransactions = data.totalTransactions || 0
          averageTransaction = data.averageTransaction || 0
        } else {
          console.warn("Failed to fetch stats:", statsRes.status)
        }

        // 2. Fetch recent transactions
        const txRes = await fetch(`${apiUrl}/operator/wallet/transactions/filtered?limit=20&type=credit`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        let txData: Transaction[] = []
        if (txRes.ok) {
          txData = await txRes.json()
        }

        setStats({
          monthlyCollected,
          pendingWithdrawals,
          totalTransactions,
          averageTransaction,
        })
        setTransactions(txData)
      } catch (err) {
        console.error("Error fetching payment data:", err)
        setError("Failed to load payment data")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [apiUrl])

  // Revenue flow mock (you can later add a real endpoint for historical data)
  const revenueFlow = [
    { month: "May", revenue: 18500000 },
    { month: "Jun", revenue: 22000000 },
    { month: "Jul", revenue: 25000000 },
    { month: "Aug", revenue: 28000000 },
    { month: "Sep", revenue: 30500000 },
    { month: "Oct", revenue: stats?.monthlyCollected || 30000000 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments Overview</h1>
          <p className="text-muted-foreground">Track earnings, deposits, and payout requests from pilgrim payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            <span>This Month</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Revenue This Month */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">THIS MONTH REVENUE</span>
          </div>
          <div className="text-3xl font-bold mb-1">₦ {(stats?.monthlyCollected || 0) / 1000000}M</div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>From confirmed payments</span>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">PENDING PAYOUTS</span>
          </div>
          <div className="text-3xl font-bold mb-1">₦ {(stats?.pendingWithdrawals || 0) / 1000000}M</div>
          <div className="flex items-center gap-1 text-xs text-orange-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Awaiting bank transfer</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">TOTAL TRANSACTIONS</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalTransactions || 0}</div>
          <div className="text-xs text-muted-foreground">All time</div>
        </div>

        {/* Average Transaction */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">AVG TRANSACTION</span>
          </div>
          <div className="text-3xl font-bold mb-1">₦ {((stats?.averageTransaction || 0) / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground">Per booking payment</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Flow */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Revenue Flow</h2>
              <p className="text-sm text-muted-foreground">Monthly earnings trend</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₦ {((stats?.monthlyCollected || 0) / 1000000).toFixed(0)}M</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueFlow}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `₦${value / 1000000}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Types - Still mock until you add breakdown endpoint */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Payment Types</h2>
          <p className="text-sm text-muted-foreground mb-6">Estimated distribution</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Full Payment</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "45%" }} />
              </div>
              <p className="text-xs text-muted-foreground">₦ 69.3M</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Installments</span>
                <span className="font-semibold">40%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "40%" }} />
              </div>
              <p className="text-xs text-muted-foreground">₦ 61.6M</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Initial Deposit</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: "15%" }} />
              </div>
              <p className="text-xs text-muted-foreground">₦ 23.1M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search traveler..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead>TRAVELER</TableHead>
              <TableHead>PACKAGE</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>TYPE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((txn) => {
                const pilgrimName = txn.booking?.pilgrim?.fullName || "Unknown Pilgrim"
                const packageTitle = txn.booking?.package?.title || "Unknown Package"

                return (
                  <TableRow key={txn.id} className="border-b border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {pilgrimName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{pilgrimName}</p>
                          <p className="text-xs text-muted-foreground">ID: {txn.booking?.pilgrim?.id || "-"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{packageTitle}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(txn.createdAt)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          txn.status === "completed"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : txn.status === "pending"
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{txn.type === "credit" ? "Payment Received" : "Payout"}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}