"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { StatCard } from "../../components/features/dashboard/StatCard"
import { AccountStatusCard } from "../../components/features/dashboard/AccountStatusCard"
import { Spinner } from "../../components/common/Spinner"
import { Button } from "../../components/common/Button"
import { tierService } from "../../api/services/tier.service.js"
import { bookingsService } from "../../api/services/bookings.service.js"
import { packagesService } from "../../api/services/packages.service.js"
import { settlementService } from "../../api/services/settlement.service.js"
import { useAuth } from "../../context/AuthContext"

export default function DashboardScreen() {
  const navigate = useNavigate()
  const { operator } = useAuth()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [verification, setVerification] = useState(null)
  const [bookings, setBookings] = useState([])
  const [packages, setPackages] = useState([])
  const [hasBankAccount, setHasBankAccount] = useState(false)

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
        bankData,
      ] = await Promise.allSettled([
        tierService.getTierInfo(),
        bookingsService.getAll(),
        packagesService.getAll(),
        tierService.getTrustScore(),
        tierService.getPerformance(),
        settlementService.getBankAccount(),
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

      if (bankData.status === "fulfilled" && bankData.value) {
        setHasBankAccount(true)
      }
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
      {/* Settlement Account Prompt */}
      {!hasBankAccount && (
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <div>
              <p className="font-semibold">Set Up Your Settlement Account</p>
              <p className="text-sm opacity-70">Add your bank account to receive payouts from bookings.</p>
            </div>
          </div>
          <Button onClick={() => navigate("/settlement/setup")} size="sm">
            Set Up
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Bookings" value={totalBookings} subtitle="All time" icon="📅" to="/bookings" />
        <StatCard
          title="Active Packages"
          value={activePackages}
          subtitle={`${pendingBookings} pending approval`}
          icon="📦"
          to="/packages"
        />
        <StatCard
          title="This Month"
          value={monthlyBookings}
          subtitle={`${confirmedBookings} confirmed`}
          icon="📊"
          to="/bookings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg">
                Recent Activity
              </h3>
              {bookings.length > 0 && (
                <button onClick={() => navigate("/bookings")} className="text-sm font-medium text-primary hover:underline">
                  View all →
                </button>
              )}
            </div>

            {bookings.length === 0 ? (
              <p className="text-fg/70">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => navigate("/bookings")}
                    className="flex justify-between items-center p-3 rounded-lg
                               bg-bg border border-border cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-fg">
                        {booking.pilgrimName}
                      </p>
                      <p className="text-sm text-fg/70">
                        {booking.numberOfPilgrims} pilgrim(s) - N
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
        <div onClick={() => navigate("/verification")} className="cursor-pointer">
          <AccountStatusCard verification={verification} metrics={metrics} />
        </div>
      </div>
    </DashboardLayout>
  )
}
