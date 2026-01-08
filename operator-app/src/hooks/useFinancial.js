"use client"

import { useState, useEffect } from "react"
import { financialService } from "../api/services/financial.service"

export const useFinancial = () => {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [bankDetails, setBankDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const data = await financialService.getSummary()
      setSummary(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const data = await financialService.getTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchBankDetails = async () => {
    try {
      const data = await financialService.getBankDetails()
      setBankDetails(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const requestPayout = async (amount) => {
    try {
      const result = await financialService.requestPayout({ amount })
      await fetchSummary()
      await fetchTransactions()
      return result
    } catch (err) {
      throw err
    }
  }

  const updateBankDetails = async (data) => {
    try {
      const result = await financialService.updateBankDetails(data)
      setBankDetails(result)
      return result
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchSummary()
    fetchTransactions()
    fetchBankDetails()
  }, [])

  return {
    summary,
    transactions,
    bankDetails,
    loading,
    error,
    requestPayout,
    updateBankDetails,
    refetch: () => {
      fetchSummary()
      fetchTransactions()
      fetchBankDetails()
    },
  }
}
