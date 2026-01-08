import type React from "react"
export const metadata = {
  title: "Dashboard - TravelOps",
  description: "Operator dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
