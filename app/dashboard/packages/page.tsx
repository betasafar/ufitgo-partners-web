import type { Package, DashboardStats } from "@/lib/types"
import { PackagesStats } from "@/components/packages-stats"
import { PackagesTable } from "@/components/packages-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getPackagesData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || "http://localhost:5000/api"
    const response = await fetch(`${apiUrl}/packages`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch packages")

    const packages: Package[] = await response.json()

    // Calculate stats from the packages data
    const activePackages = packages.filter((p) => p.status === "active")
    const totalSeats = packages.reduce((sum, p) => sum + p.capacity, 0)
    const seatsFilled = packages.reduce((sum, p) => sum + p.booked, 0)
    const revenueProjected = packages.reduce((sum, p) => sum + p.price * p.booked, 0)

    const stats: DashboardStats = {
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
    }

    return { packages, stats }
  } catch (error) {
    console.error("[v0] Failed to fetch packages:", error)
    // Return empty data on error
    return {
      packages: [],
      stats: {
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
      },
    }
  }
}

export default async function PackagesPage() {
  const { packages, stats } = await getPackagesData()

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
