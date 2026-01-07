import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || "http://localhost:5000/api"

interface ApiOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000) // Reduced timeout from 10s to 5s

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      next: { revalidate: 30 }, // Added cache control
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }

      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      throw new Error("Request timeout")
    }

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
