import { useState, useCallback } from "react"
import { promosService } from "../api/services/promos.service.js"

export const usePromos = () => {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPromos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await promosService.getPromos()
      setPromos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || "Failed to fetch promos")
    } finally {
      setLoading(false)
    }
  }, [])

  const createPromo = async (promoData) => {
    setLoading(true)
    setError(null)
    try {
      const newPromo = await promosService.createPromo(promoData)
      setPromos((prev) => [newPromo, ...prev])
      return newPromo
    } catch (err) {
      setError(err.message || "Failed to create promo")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const togglePromoStatus = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const updatedPromo = await promosService.togglePromoStatus(id)
      setPromos((prev) =>
        prev.map((p) => (p.id === id ? updatedPromo : p))
      )
      return updatedPromo
    } catch (err) {
      setError(err.message || "Failed to toggle status")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    promos,
    loading,
    error,
    fetchPromos,
    createPromo,
    togglePromoStatus,
  }
}
