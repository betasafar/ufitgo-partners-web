"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface RevenueDataPoint {
  month: string
  revenue: number
}

interface RevenueFlowChartProps {
  data: RevenueDataPoint[]
  currentMonthRevenue: number
}

export function RevenueFlowChart({ data, currentMonthRevenue }: RevenueFlowChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Revenue Flow</h2>
          <p className="text-sm text-muted-foreground">Monthly earnings trend</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">₦ {((currentMonthRevenue || 0) / 1000000).toFixed(0)}M</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
  )
}
