import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints"

export const settingsService = {
  updateProfile: async (operatorId, data) => {
    const response = await apiClient.put(ENDPOINTS.AUTH.PROFILE, data, { params: { operatorId } })
    return response.data
  },

  changePassword: async (operatorId, data) => {
    const response = await apiClient.post(ENDPOINTS.SETTINGS.CHANGE_PASSWORD, { id: operatorId, ...data })
    return response.data
  },

  getNotificationSettings: async () => {
    const response = await apiClient.get(ENDPOINTS.SETTINGS.NOTIFICATIONS)
    return response.data
  },

  updateNotificationSettings: async (data) => {
    const response = await apiClient.put(ENDPOINTS.SETTINGS.NOTIFICATIONS, data)
    return response.data
  },
}
