import { useState, useEffect } from "react"
import { commissionService } from "../api/services/commission.service"

export const useCommissions = () => {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [summaryData, historyData, configData] = await Promise.all([
        commissionService.getSummary(),
        commissionService.getHistory(),
        commissionService.getConfig()
      ])
      
      setSummary(summaryData)
      setTransactions(historyData || [])
      setConfig(configData)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to load commission data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    summary,
    transactions,
    config,
    loading,
    error,
    refetch: fetchData,
  }
}
