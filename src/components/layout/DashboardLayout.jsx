"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className="min-h-screen bg-bg"
      style={{
        "--sidebar-width": "16rem",
        "--header-height": "4rem",
      }}
    >
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <Header
        title={title}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main content */}
      <main
        className="
          pt-24
          transition-[margin-left] duration-200
          ml-0
          lg:ml-[var(--sidebar-width)]
          px-4 lg:px-6
        "
      >
        {children}
      </main>
    </div>
  )
}
