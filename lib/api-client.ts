const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api"

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  const cookies = document.cookie.split("; ")
  const authCookie = cookies.find((row) => row.startsWith("auth_token="))
  return authCookie ? authCookie.split("=")[1] : null
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Unauthorized - Please log in again")
    }

    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint: string, data?: any) => apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint: string, data?: any) => apiRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: "DELETE" }),
}
