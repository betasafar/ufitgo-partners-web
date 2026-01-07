import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const backendUrl = process.env.BACKEND_API_URL
    // console.log("[v0] Environment check:", {
    //   BACKEND_API_URL: backendUrl,
    //   NODE_ENV: process.env.NODE_ENV,
    //   allEnvKeys: Object.keys(process.env).filter((k) => k.includes("BACKEND")),
    // })

    const apiUrl = `${backendUrl}/operator/auth/login`
    console.log("[v0] Attempting login to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Backend error:", error)
      return NextResponse.json({ message: error.message || "Login failed" }, { status: response.status })
    }

    const data = await response.json()
    const { access_token, operator } = data

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
      httpOnly: false, // Allow client-side access
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
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
