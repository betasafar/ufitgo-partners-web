import apiClient from "../client"
import { ENDPOINTS } from "../endpoints"

export const tierService = {
  getTierInfo: async () => {
    return await apiClient.get(ENDPOINTS.TIER.INFO)
  },

  getMetrics: async () => {
    return await apiClient.get(ENDPOINTS.TIER.METRICS)
  },
}
