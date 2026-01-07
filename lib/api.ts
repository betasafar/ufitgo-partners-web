import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || "http://localhost:5000/api"

interface ApiOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  // Get JWT token from cookies (server-side)
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  console.log("[v0] API Request:", endpoint, "Token exists:", !!token)

  // Build URL with params
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // Add Authorization header if token exists
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API Error Response:", response.status, errorText)

      if (response.status === 401) {
        throw new Error("Unauthorized")
      }

      const error = errorText ? JSON.parse(errorText) : { message: "Request failed" }
      throw new Error(error.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      console.log("[v0] API Request Timeout:", endpoint)
      throw new Error("Request timeout")
    }

    console.log("[v0] API Request Failed:", endpoint, error.message)
    throw error
  }
}

// Client-side API request (for use in client components)
export async function clientApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login"
      throw new Error("Unauthorized")
    }
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}
