// src/hooks/useSettlement.js
import { useState, useEffect, useCallback } from "react"
import { settlementService } from "../api/services/settlement.service"

export const useSettlement = () => {
  const [bankAccount, setBankAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBankAccount = useCallback(async () => {
    try {
      setLoading(true)
      const data = await settlementService.getBankAccount()
      setBankAccount(data)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to load bank account")
      setBankAccount(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const addBankAccount = useCallback(
    async ({ accountNumber, bankCode }) => {
      const result = await settlementService.addBankAccount({ accountNumber, bankCode })
      setBankAccount(result.data || result)
      return result
    },
    []
  )

  useEffect(() => {
    fetchBankAccount()
  }, [fetchBankAccount])

  return {
    bankAccount,
    loading,
    error,
    addBankAccount,
    refetch: fetchBankAccount,
  }
}
