"use client"

import { Card } from "@/components/ui/card"
import type { RevenueDataPoint } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, point) => sum + point.revenue, 0)
  const formattedTotal = (totalRevenue / 1000000).toFixed(1)

  const growth =
    data.length > 1 ? (((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100).toFixed(1) : "0"

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Revenue Trajectory</h3>
            <p className="text-sm text-muted-foreground">Tracking income over recent bookings.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₦ {formattedTotal}M</div>
            <div className={`text-sm ${Number(growth) >= 0 ? "text-success" : "text-destructive"}`}>
              {Number(growth) >= 0 ? "+" : ""}
              {growth}% trend
            </div>
          </div>
        </div>

        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No revenue data available</p>
          </div>
        )}
      </div>
    </Card>
  )
}
