import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api"

interface ApiOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  console.log("[v0] API Request:", endpoint, "Token exists:", !!token)

  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // Build headers as a plain object first (fully mutable)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Merge any custom headers from fetchOptions
  if (fetchOptions.headers) {
    const existingHeaders = fetchOptions.headers as Record<string, string>
    Object.assign(headers, existingHeaders)
  }

  // Add Authorization if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers, // This is now Record<string, string> → compatible with HeadersInit
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API Error Response:", response.status, errorText)

      if (response.status === 401) {
        throw new Error("Unauthorized")
      }

      try {
        const error = JSON.parse(errorText)
        throw new Error(error.message || `Request failed with status ${response.status}`)
      } catch {
        throw new Error(`Request failed with status ${response.status}`)
      }
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
