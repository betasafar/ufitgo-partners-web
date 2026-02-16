"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { StatCard } from "../../components/features/dashboard/StatCard"
import { AccountStatusCard } from "../../components/features/dashboard/AccountStatusCard"
import { Spinner } from "../../components/common/Spinner"
import { tierService } from "../../api/services/tier.service.js"
import { bookingsService } from "../../api/services/bookings.service.js"
import { packagesService } from "../../api/services/packages.service.js"

export default function DashboardScreen() {
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

      const [
        tierData,
        bookingsData,
        packagesData,
        trustScoreData,
        performanceData,
      ] = await Promise.allSettled([
        tierService.getTierInfo(),
        bookingsService.getAll(),
        packagesService.getAll(),
        tierService.getTrustScore(),
        tierService.getPerformance(),
      ])

      if (tierData.status === "fulfilled") {
        setVerification(tierData.value.data || tierData.value)
      }

      if (bookingsData.status === "fulfilled") {
        const bookingsArray = bookingsData.value.data || bookingsData.value
        setBookings(Array.isArray(bookingsArray) ? bookingsArray : [])
      }

      if (packagesData.status === "fulfilled") {
        const packagesArray = packagesData.value.data || packagesData.value
        setPackages(Array.isArray(packagesArray) ? packagesArray : [])
      }

      setMetrics({
        trustScore:
          trustScoreData.status === "fulfilled"
            ? trustScoreData.value.data || trustScoreData.value
            : null,
        performance:
          performanceData.status === "fulfilled"
            ? performanceData.value.data || performanceData.value
            : null,
      })
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
  const totalBookings = metrics?.performance?.totalBookings || 0
  const monthlyBookings = metrics?.performance?.currentMonthBookings || 0
  const activePackages = metrics?.performance?.activePackages || packages.length

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Bookings" value={totalBookings} subtitle="All time" icon="📅" />
        <StatCard
          title="Active Packages"
          value={activePackages}
          subtitle={`${pendingBookings} pending approval`}
          icon="📦"
        />
        <StatCard
          title="This Month"
          value={monthlyBookings}
          subtitle={`${confirmedBookings} confirmed`}
          icon="📊"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Recent Activity
            </h3>

            {bookings.length === 0 ? (
              <p className="text-fg/70">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center p-3 rounded-lg
                               bg-bg border border-border"
                  >
                    <div>
                      <p className="font-medium text-fg">
                        {booking.pilgrimName}
                      </p>
                      <p className="text-sm text-fg/70">
                        {booking.numberOfPilgrims} pilgrim(s) • ₦
                        {Number(booking.totalAmount).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${booking.status === "confirmed"
                          ? "bg-green-500/10 text-green-600"
                          : booking.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : booking.status === "deposit_paid"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-gray-500/10 text-gray-600"
                        }`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div>
          <AccountStatusCard verification={verification} metrics={metrics} />
        </div>
      </div>
    </DashboardLayout>
  )
}
