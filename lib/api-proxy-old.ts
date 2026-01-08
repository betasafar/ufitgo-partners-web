// lib/api-proxy.ts
// This file is now a SERVER-ONLY module. It uses "next/headers" which is server-only.
// Do NOT import it directly in Client Components ("use client").
// Instead, use Server Components, Route Handlers, or Server Actions to fetch data.

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

export const apiRequest = cache(
  async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const cookieStore = await cookies() // Use sync cookies() in server context
      const token = cookieStore.get("auth_token")?.value

      if (!token) {
        console.warn("[api-proxy] No authentication token found")
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

        console.error("[api-proxy] API Error:", {
          endpoint,
          status: response.status,
          error: error.message || error,
        })

        throw new APIError(error.message || `API Error: ${response.status}`, response.status, error)
      }

      return await response.json() as T
    } catch (error) {
      if (error instanceof APIError) throw error

      console.error("[api-proxy] API Request failed:", {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
      })

      throw new APIError("Network request failed", 500)
    }
  }
)

// All other functions remain server-only
export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies()

    const operatorDataCookie = cookieStore.get("operator_data")?.value

    if (operatorDataCookie) {
      try {
        const operatorData = JSON.parse(operatorDataCookie)
        console.log("[api-proxy] User loaded from cookie:", {
          email: operatorData.email,
          company: operatorData.companyName,
        })
        return operatorData
      } catch (parseError) {
        console.error("[api-proxy] Failed to parse operator_data cookie:", parseError)
      }
    }

    const token = cookieStore.get("auth_token")?.value
    if (token) {
      console.log("[api-proxy] No cookie data, attempting to fetch from API")
      return await apiRequest(ENDPOINTS.PROFILE.GET, {
        next: { revalidate: 300 },
      })
    }

    console.warn("[api-proxy] No authentication token or operator data found")
    return null
  } catch (error) {
    console.error("[api-proxy] Failed to get current user:", error)
    return null
  }
})

export const getTierInfo = cache(async (): Promise<any | null> => {
  try {
    return await apiRequest(ENDPOINTS.TIER.INFO, {
      next: { revalidate: 300 },
    })
  } catch (error) {
    console.error("[api-proxy] Failed to get tier info:", error)
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