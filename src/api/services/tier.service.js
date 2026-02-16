import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const tierService = {
  getTierInfo: async () => {
    return await apiClient.get(ENDPOINTS.TIER.INFO)
  },

  getTrustScore: async () => {
    return await apiClient.get(ENDPOINTS.METRICS.TRUST_SCORE)
  },

  getPerformance: async () => {
    return await apiClient.get(ENDPOINTS.METRICS.PERFORMANCE)
  },

  getUpgradeProgress: async () => {
    return await apiClient.get(ENDPOINTS.METRICS.UPGRADE_PROGRESS)
  },
}
