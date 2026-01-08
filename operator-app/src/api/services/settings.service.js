import { apiClient } from "../client"
import { ENDPOINTS } from "../endpoints"

export const settingsService = {
  updateProfile: async (data) => {
    const response = await apiClient.put(ENDPOINTS.AUTH.PROFILE, data)
    return response.data
  },

  changePassword: async (data) => {
    const response = await apiClient.post(ENDPOINTS.SETTINGS.CHANGE_PASSWORD, data)
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
