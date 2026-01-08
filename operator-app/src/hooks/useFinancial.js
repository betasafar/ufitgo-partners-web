import { useState, useEffect } from "react"
import { financialService } from "../api/services/financial.service"

export const useFinancial = () => {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const data = await financialService.getSummary()
      setSummary(data)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to load summary")
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const data = await financialService.getTransactions()
      setTransactions(data || []) // ensure array
    } catch (err) {
      setError(err.message || "Failed to load transactions")
      setTransactions([])
    }
  }

  const requestPayout = async (amount) => {
    try {
      const result = await financialService.requestPayout({ amount })
      await fetchSummary()
      await fetchTransactions()
      return result
    } catch (err) {
      throw new Error(err.message || "Payout request failed")
    }
  }

  useEffect(() => {
    fetchSummary()
    fetchTransactions()
  }, [])

  return {
    summary,
    transactions,
    loading,
    error,
    requestPayout,
    refetch: () => {
      fetchSummary()
      fetchTransactions()
    },
  }
}