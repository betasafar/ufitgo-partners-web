"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { StatCard } from "../../components/features/dashboard/StatCard"
import { AccountStatusCard } from "../../components/features/dashboard/AccountStatusCard"
import { Spinner } from "../../components/common/Spinner"
import { tierService } from "../../api/services/tier.service"
import { bookingsService } from "../../api/services/bookings.service"
import { packagesService } from "../../api/services/packages.service"

export const DashboardScreen = () => {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [verification, setVerification] = useState(null)
  const [bookings, setBookings] = useState([])
  const [packages, setPackages] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [metricsData, tierData, bookingsData, packagesData] = await Promise.all([
        tierService.getMetrics(),
        tierService.getTierInfo(),
        bookingsService.getAll(),
        packagesService.getAll(),
      ])

      setMetrics(metricsData)
      setVerification(tierData)
      setBookings(bookingsData)
      setPackages(packagesData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Bookings" value={metrics?.totalBookings || 0} subtitle="All time" icon="📅" />
        <StatCard
          title="Active Packages"
          value={packages.length}
          subtitle={`${pendingBookings} pending approval`}
          icon="📦"
        />
        <StatCard
          title="This Month"
          value={metrics?.monthlyBookings || 0}
          subtitle={`${confirmedBookings} confirmed`}
          icon="📊"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {bookings.length === 0 ? (
              <p className="text-gray-600">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.packageName}</p>
                      <p className="text-sm text-gray-600">{booking.pilgrimName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <AccountStatusCard verification={verification} metrics={metrics} />
        </div>
      </div>
    </DashboardLayout>
  )
}
