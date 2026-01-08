"use client"

import { useState } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Spinner } from "../../components/common/Spinner"
import { useBookings } from "../../hooks/useBookings"
import { BookingCard } from "../../components/features/bookings/BookingCard"

export const BookingsScreen = () => {
  const { bookings, loading, error, updateBookingStatus } = useBookings()
  const [filter, setFilter] = useState("all")
  const [updating, setUpdating] = useState(null)

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdating(id)
      await updateBookingStatus(id, status)
    } catch (err) {
      alert("Failed to update booking: " + err.message)
    } finally {
      setUpdating(null)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  if (loading) {
    return (
      <DashboardLayout title="Bookings">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Bookings">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Bookings">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "pending" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending ({bookings.filter((b) => b.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "confirmed" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Confirmed ({bookings.filter((b) => b.status === "confirmed").length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "completed" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Completed ({bookings.filter((b) => b.status === "completed").length})
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No {filter !== "all" ? filter : ""} bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updating === booking.id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
