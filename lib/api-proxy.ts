// Client-side API proxy functions
import { ENDPOINTS, buildEndpoint } from "./api-endpoints"

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

// Client-side API request through Next.js proxy
export async function apiClientRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Route through Next.js API proxy for secure cookie handling
    const url = `/api/proxy${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new APIError("Unauthorized", 401)
      }

      const error = await response.json().catch(() => ({
        message: response.statusText,
      }))

      throw new APIError(error.message || `API Error: ${response.status}`, response.status, error)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) throw error

    console.error("[API] Request failed:", {
      endpoint,
      error: error instanceof Error ? error.message : String(error),
    })

    throw new APIError("Network request failed", 500)
  }
}

// Re-export for convenience
export { buildEndpoint, ENDPOINTS }
