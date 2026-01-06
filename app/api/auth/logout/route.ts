import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")

    if (token) {
      try {
        const backendUrl = process.env.BACKEND_API_URL
        const apiUrl = `${backendUrl}/operator/auth/logout`

        console.log("[v0] Attempting logout to:", apiUrl)

        await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
          },
        })

        console.log("[v0] Backend logout successful")
      } catch (error) {
        console.error("[v0] Backend logout error:", error)
      }
    }

    cookieStore.delete("auth_token")

    console.log("[v0] Auth token cleared from cookies")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
