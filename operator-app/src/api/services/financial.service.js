import { apiClient } from "../client"
import { ENDPOINTS } from "../endpoints"

export const financialService = {
  getSummary: async () => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.SUMMARY)
    return response.data
  },

  getTransactions: async () => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.TRANSACTIONS)
    return response.data
  },

  requestPayout: async (data) => {
    const response = await apiClient.post(ENDPOINTS.FINANCIAL.REQUEST_PAYOUT, data)
    return response.data
  },

  getBankDetails: async () => {
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.BANK_DETAILS)
    return response.data
  },

  updateBankDetails: async (data) => {
    const response = await apiClient.put(ENDPOINTS.FINANCIAL.BANK_DETAILS, data)
    return response.data
  },
}
