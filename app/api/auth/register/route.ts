import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = process.env.BACKEND_API_URL
    console.log("[v0] Registration - Environment check:", {
      BACKEND_API_URL: backendUrl,
      NODE_ENV: process.env.NODE_ENV,
    })

    const apiUrl = `${backendUrl}/operator/auth/register`
    console.log("[v0] Attempting registration to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Backend error:", error)
      return NextResponse.json({ message: error.message || "Registration failed" }, { status: response.status })
    }

    const data = await response.json()
    const { token } = data

    // Set httpOnly cookie with session
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Registration successful, token set")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
