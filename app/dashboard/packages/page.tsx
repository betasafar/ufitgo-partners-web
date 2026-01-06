import type { Package, DashboardStats } from "@/lib/types"
import { PackagesStats } from "@/components/packages-stats"
import { PackagesTable } from "@/components/packages-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { mockPackages } from "@/lib/mock-data"

async function getPackagesData() {
  const packages: Package[] = mockPackages

  const stats: DashboardStats = {
    totalRevenue: 45000000,
    revenueChange: 12.5,
    totalBookings: 342,
    bookingsChange: 5.2,
    pendingPayments: 2150000,
    paymentsChange: -2.1,
    visaExpiring: 12,
    visaChange: 8.0,
    activePackages: packages.filter((p) => p.status === "active").length,
    seatsFilled: packages.reduce((sum, p) => sum + p.booked, 0),
    totalSeats: packages.reduce((sum, p) => sum + p.capacity, 0),
    revenueProjected: 52000000,
  }

  return { packages, stats }
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
