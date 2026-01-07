import { cookies } from "next/headers"
import { cache } from "react"
import { ENDPOINTS } from "./api-endpoints"

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
      return await apiRequest(ENDPOINTS.OPERATOR.PROFILE, {
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

export const getTierInfo = cache(async (): Promise<any | null> => {
  try {
    return await apiRequest(ENDPOINTS.TIER.INFO, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })
  } catch (error) {
    console.error("[v0] Failed to get tier info:", error)
    return null
  }
})

export const getVerificationDocuments = cache(async (): Promise<any[]> => {
  try {
    const response = await apiRequest(ENDPOINTS.DOCUMENTS.LIST, {
      next: { revalidate: 60 },
    })
    return response.documents || []
  } catch (error) {
    console.error("[v0] Failed to get verification documents:", error)
    return []
  }
})

export const getTrustBadges = cache(async (): Promise<any[]> => {
  try {
    const response = await apiRequest(ENDPOINTS.METRICS.BADGES, {
      next: { revalidate: 300 },
    })
    return response.badges || []
  } catch (error) {
    console.error("[v0] Failed to get trust badges:", error)
    return []
  }
})

export const getOperatorMetrics = cache(async () => {
  try {
    return await apiRequest(ENDPOINTS.METRICS.OVERVIEW, {
      next: { revalidate: 120 },
    })
  } catch (error) {
    console.error("[v0] Failed to get operator metrics:", error)
    return {
      totalBookings: 0,
      successfulBookings: 0,
      cancelledBookings: 0,
      monthlyBookingsCount: 0,
      activePackagesCount: 0,
      trustScore: 0,
    }
  }
})

export const getTierComparison = cache(async () => {
  try {
    return await apiRequest(ENDPOINTS.TIER.COMPARISON, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
  } catch (error) {
    console.error("[v0] Failed to get tier comparison:", error)
    return null
  }
})

export const getUpgradeEligibility = cache(async () => {
  try {
    return await apiRequest(ENDPOINTS.TIER.UPGRADE_ELIGIBILITY, {
      next: { revalidate: 300 },
    })
  } catch (error) {
    console.error("[v0] Failed to get upgrade eligibility:", error)
    return null
  }
})

export const getTierRestrictions = cache(async () => {
  try {
    return await apiRequest(ENDPOINTS.TIER.RESTRICTIONS, {
      next: { revalidate: 300 },
    })
  } catch (error) {
    console.error("[v0] Failed to get tier restrictions:", error)
    return null
  }
})

export { buildEndpoint, ENDPOINTS } from "./api-endpoints"
