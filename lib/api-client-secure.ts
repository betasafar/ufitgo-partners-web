// Secure client-side API calls through Next.js proxy
export async function apiClientRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // All requests go through Next.js API proxy
  const url = `/api/proxy${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    // Handle 401 by redirecting to login
    if (response.status === 401) {
      window.location.href = "/login"
      throw new Error("Unauthorized")
    }

    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return await response.json()
}
