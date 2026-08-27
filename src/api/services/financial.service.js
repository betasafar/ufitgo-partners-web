// src/api/services/financial.service.js
import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints"

export const financialService = {
  getSummary: async () => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.SUMMARY)
    // apiClient interceptor already unwraps to response.data
    return response.data ?? response
  },

  getTransactions: async () => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.TRANSACTIONS)
    return response.data ?? response
  },

  getFilteredTransactions: async (params) => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.TRANSACTIONS_FILTERED, { params })
    return response.data ?? response
  },

  requestPayout: async (data) => {
    const response = await apiClient.post(ENDPOINTS.FINANCIAL.REQUEST_PAYOUT, data)
    return response.data ?? response
  },
}
