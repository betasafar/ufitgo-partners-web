import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/operator/bookings/${params.id}/detailed`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch booking details")
    }

    const booking = await response.json()

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error fetching booking details:", error)
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 })
  }
}
