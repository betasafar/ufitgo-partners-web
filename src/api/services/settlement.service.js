// src/api/services/settlement.service.js
import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const settlementService = {
  getBankAccount: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTLEMENT.BANK_ACCOUNT)
      return response.data || response
    } catch (err) {
      if (err.status === 404) return null
      throw err
    }
  },

  addBankAccount: async ({ accountNumber, bankCode }) => {
    const response = await apiClient.post(ENDPOINTS.SETTLEMENT.BANK_ACCOUNT, {
      accountNumber,
      bankCode,
    })
    return response.data || response
  },

  setupSettlement: async ({ settlementBank, accountNumber, businessName }) => {
    const response = await apiClient.post(ENDPOINTS.SETTLEMENT.SETUP, {
      settlementBank,
      accountNumber,
      businessName,
    })
    return response.data || response
  },
}
