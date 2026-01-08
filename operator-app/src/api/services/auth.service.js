import apiClient from "../client"
import { ENDPOINTS } from "../endpoints"

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    if (response.token) {
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("operator", JSON.stringify(response.operator))
    }
    return response
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("operator")
    }
  },

  getProfile: async () => {
    return await apiClient.get(ENDPOINTS.AUTH.PROFILE)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token")
  },

  getStoredOperator: () => {
    const operator = localStorage.getItem("operator")
    return operator ? JSON.parse(operator) : null
  },
}
