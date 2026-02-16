

import { useState, useEffect } from "react"
import { bookingsService } from "../api/services/bookings.service"

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingsService.getAll()
      setBookings(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      const updated = await bookingsService.updateStatus(id, status)
      setBookings((prev) => prev.map((booking) => (booking.id === id ? updated : booking)))
      return updated
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus,
  }
}
