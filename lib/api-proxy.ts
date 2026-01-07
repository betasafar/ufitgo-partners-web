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

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies()

    // First, try to get operator data from cookie (stored during login)
    const operatorDataCookie = cookieStore.get("operator_data")?.value

    if (operatorDataCookie) {
      try {
        const operatorData = JSON.parse(operatorDataCookie)
        console.log("[v0] User loaded from cookie:", {
          email: operatorData.email,
          company: operatorData.companyName,
        })
        return operatorData
      } catch (parseError) {
        console.error("[v0] Failed to parse operator_data cookie:", parseError)
      }
    }

    // Fallback: Try to fetch from API if cookie not available
    const token = cookieStore.get("auth_token")?.value
    if (token) {
      console.log("[v0] No cookie data, attempting to fetch from API")
      return await apiRequest("/operator/profile", {
        next: { revalidate: 300 }, // Cache for 5 minutes
      })
    }

    console.warn("[v0] No authentication token or operator data found")
    return null
  } catch (error) {
    console.error("[v0] Failed to get current user:", error)
    return null
  }
})

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
