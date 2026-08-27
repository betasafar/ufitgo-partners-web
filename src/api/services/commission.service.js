import { apiClient } from "../client"
import { ENDPOINTS } from "../endpoints"

export const commissionService = {
  getSummary: async () => {
    const response = await apiClient.get(ENDPOINTS.COMMISSIONS.SUMMARY)
    return response.data ?? response
  },

  getHistory: async (params) => {
    const response = await apiClient.get(ENDPOINTS.COMMISSIONS.HISTORY, { params })
    return response.data ?? response
  },

  getConfig: async () => {
    const response = await apiClient.get(ENDPOINTS.COMMISSIONS.CONFIG)
    return response.data ?? response
  },

  getPolicyStatus: async () => {
    const response = await apiClient.get(ENDPOINTS.COMMISSIONS.POLICY_STATUS)
    return response.data ?? response
  },

  acknowledgePolicy: async () => {
    const response = await apiClient.post(ENDPOINTS.COMMISSIONS.POLICY_ACKNOWLEDGE)
    return response.data ?? response
  },
}
