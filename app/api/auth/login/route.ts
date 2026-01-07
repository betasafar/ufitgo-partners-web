import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const backendUrl = process.env.BACKEND_API_URL
    const apiUrl = `${backendUrl}/operator/auth/login`

    console.log("[v0] Attempting login to:", apiUrl)
    

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    let response
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        console.error("[v0] Backend connection error:", fetchError.message)

        // Check if it's a connection refused error
        if (fetchError.message.includes("ECONNREFUSED") || fetchError.message.includes("fetch failed")) {
          return NextResponse.json(
            {
              message: "Unable to connect to authentication server. Please ensure the backend service is running.",
              error: "CONNECTION_REFUSED",
              details: `Backend URL: ${apiUrl}`,
            },
            { status: 503 },
          )
        }

        // Check if it's a timeout
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            {
              message: "Authentication server is not responding. Please try again later.",
              error: "TIMEOUT",
            },
            { status: 504 },
          )
        }
      }

      throw fetchError
    }

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Backend error:", error)
      return NextResponse.json({ message: error.message || "Login failed" }, { status: response.status })
    }

    const data = await response.json()
    const { access_token, operator } = data

    if (!access_token || !operator) {
      console.error("[v0] Invalid response structure:", data)
      return NextResponse.json({ message: "Invalid response from authentication server" }, { status: 500 })
    }

    console.log("[v0] Login successful, user:", {
      id: operator.id,
      email: operator.email,
      company: operator.companyName,
      status: operator.verificationStatus,
    })

    // Set httpOnly cookie with the access_token
    const cookieStore = await cookies()
    cookieStore.set("auth_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    cookieStore.set("operator_data", JSON.stringify(operator), {
      httpOnly: false, // Allow client-side access for display purposes
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      operator: operator,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
        error: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}
