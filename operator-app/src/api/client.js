// src/client.js
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error.response?.status
    const url = error.response?.config?.url

    if (status === 401 && !url?.includes("/auth/login")) {
      // Give 2 second grace period after login to prevent race conditions
      const loginTime = localStorage.getItem("login_time")
      const now = Date.now()

      if (!loginTime || now - Number.parseInt(loginTime) > 2000) {
        console.warn("[v0] Session expired, redirecting to login")
        localStorage.removeItem("auth_token")
        localStorage.removeItem("operator")
        localStorage.removeItem("login_time")

        if (window.location.pathname !== "/login") {
          window.location.replace("/login")
        }
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: status,
      data: error.response?.data,
    })
  },
)

export { apiClient }
export default apiClient
