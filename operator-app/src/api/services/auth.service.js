import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    if (response.access_token) {
      localStorage.setItem("auth_token", response.access_token)
      localStorage.setItem("operator", JSON.stringify(response.operator))
    }
    return response
  },

  register: async (data) => {
    try {
      const response = await apiClient.post("/auth/register", data); // Adjust endpoint if different
      // If backend returns token/operator immediately, store them
      if (response.data.access_token) {
        localStorage.setItem("auth_token", response.data.access_token);
      }
      if (response.data.operator) {
        localStorage.setItem("operator", JSON.stringify(response.data.operator));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
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
