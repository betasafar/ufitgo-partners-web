"use client"

import { useEffect, useState } from "react"
import type { Package, DashboardStats } from "@/lib/types"
import { PackagesStats } from "@/components/packages-stats"
import { PackagesTable } from "@/components/packages-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/api-endpoints"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalBookings: 0,
    bookingsChange: 0,
    pendingPayments: 0,
    paymentsChange: 0,
    visaExpiring: 0,
    visaChange: 0,
    activePackages: 0,
    seatsFilled: 0,
    totalSeats: 0,
    revenueProjected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await api.get<Package[]>(ENDPOINTS.PACKAGES.LIST)
        setPackages(data)

        // Calculate stats from packages
        const activePackages = data.filter((p) => p.status === "active")
        const totalSeats = data.reduce((sum, p) => sum + p.capacity, 0)
        const seatsFilled = data.reduce((sum, p) => sum + p.booked, 0)
        const revenueProjected = data.reduce((sum, p) => sum + p.price * p.booked, 0)

        setStats({
          totalRevenue: revenueProjected,
          revenueChange: 12.5,
          totalBookings: seatsFilled,
          bookingsChange: 5.2,
          pendingPayments: 0,
          paymentsChange: -2.1,
          visaExpiring: 0,
          visaChange: 8.0,
          activePackages: activePackages.length,
          seatsFilled,
          totalSeats,
          revenueProjected,
        })
      } catch (error) {
        console.error("Failed to load packages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading packages...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Package Management</h1>
          <p className="text-muted-foreground">
            Overview of your current travel packages for religious pilgrimages and leisure tours.
          </p>
        </div>
        <Link href="/dashboard/packages/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Package
          </Button>
        </Link>
      </div>

      <PackagesStats stats={stats} />

      <PackagesTable packages={packages} />
    </div>
  )
}
