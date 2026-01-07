import { cookies } from "next/headers"
import { cache } from "react"

const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:3001/api"

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

export const apiRequest = cache(async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      console.warn("[v0] No authentication token found")
      throw new APIError("No authentication token found", 401)
    }

    const url = `${API_BASE_URL}${endpoint}`

    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }

    // Apply caching strategy - only use one approach
    if (options.next?.revalidate) {
      fetchOptions.next = options.next
    } else {
      fetchOptions.cache = options.cache || "no-store"
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }))

      console.error("[v0] API Error:", {
        endpoint,
        status: response.status,
        error: error.message || error,
      })

      throw new APIError(error.message || `API Error: ${response.status}`, response.status, error)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) throw error

    console.error("[v0] API Request failed:", {
      endpoint,
      error: error instanceof Error ? error.message : String(error),
    })

    throw new APIError("Network request failed", 500)
  }
})

export const getCurrentUser = cache(async () => {
  try {
    return await apiRequest("/operator/profile", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })
  } catch (error) {
    console.error("[v0] Failed to get current user:", error)
    return null
  }
})
