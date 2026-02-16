// src/api/services/auth.service.ts
import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const authService = {
  // Also removed localStorage saving here since AuthContext handles it
  login: async (email: string, password: string) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    // response is already { access_token, operator } - no need to access .data
    return response
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error("Logout error:", error)
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

export const onboardingService =  {
  register: async (
    data: {
      email: string
      phone: string
      companyName: string
      cacNumber?: string
      password: string
    },
    options?: {
      source?: "web" | "whatsapp"
      waPhone?: string
    }
  ) => {
    try {
      // Prepare query params for WhatsApp context
      const params = new URLSearchParams()
      if (options?.source) {
        params.set("source", options.source)
      }
      if (options?.waPhone) {
        params.set("wa_phone", options.waPhone)
      }

      const response = await apiClient.post(
        ENDPOINTS.AUTH.REGISTER,
        data,
        {
          params, // ← sends ?source=whatsapp&wa_phone=+234... as query string
        }
      )

      // Handle successful response (adjust based on your backend response shape)
      if (response.data.access_token) {
        localStorage.setItem("auth_token", response.data.access_token)
      }
      if (response.data.operator) {
        localStorage.setItem("operator", JSON.stringify(response.data.operator))
      }

      // Return full response so SignupScreen can access continuationUrl etc.
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed. Please try again."
    }
  },
}
