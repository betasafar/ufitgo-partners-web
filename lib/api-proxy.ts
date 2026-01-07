import { cookies } from "next/headers"
import { cache } from "react"

const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:3001/api"

// Centralized error handler
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Secure server-side API request handler with caching
export const apiRequest = cache(async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    throw new APIError("No authentication token found", 401)
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      cache: options.cache || "no-store",
      next: options.next || { revalidate: 30 }, // 30 second cache by default
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new APIError(error.message || `API Error: ${response.status}`, response.status, error)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) throw error

    console.error("[v0] API Request failed:", error)
    throw new APIError("Network request failed", 500)
  }
})

// Get current user with aggressive caching (reduces layout overhead)
export const getCurrentUser = cache(async () => {
  try {
    return await apiRequest("/operator/profile", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 401) {
      return null
    }
    throw error
  }
})
