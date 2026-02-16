import { apiClient } from "../client.js"
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

  getFilteredTransactions: async (params) => { // optional, if you need filtering
    const response = await apiClient.get(ENDPOINTS.FINANCIAL.TRANSACTIONS_FILTERED, { params })
    return response.data
  },

  requestPayout: async (data) => {
    const response = await apiClient.post(ENDPOINTS.FINANCIAL.REQUEST_PAYOUT, data)
    return response.data
  },

  // ❌ REMOVE THESE — NO SUCH ENDPOINTS
  // getBankDetails: async () => { ... },
  // updateBankDetails: async (data) => { ... },
}