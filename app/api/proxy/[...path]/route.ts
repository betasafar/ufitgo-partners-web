import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:3001/api"

// Secure API proxy - all client-side API calls go through this
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest("GET", request, params.path)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest("POST", request, params.path)
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest("PUT", request, params.path)
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest("DELETE", request, params.path)
}

async function handleRequest(method: string, request: NextRequest, path: string[]) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized", message: "No authentication token" }, { status: 401 })
  }

  const endpoint = path.join("/")
  const url = `${API_BASE_URL}/${endpoint}`

  try {
    let body = undefined
    if (method !== "GET" && method !== "DELETE") {
      body = await request.text()
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    })

    const data = await response.json().catch(() => null)

    return NextResponse.json(data || { message: response.statusText }, {
      status: response.status,
    })
  } catch (error) {
    console.error("[v0] Proxy request failed:", error)
    return NextResponse.json({ error: "Internal Server Error", message: "Failed to proxy request" }, { status: 500 })
  }
}
