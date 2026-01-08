"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Packages", href: "/packages", icon: "📦" },
  { name: "Bookings", href: "/bookings", icon: "📅" },
  { name: "Verification", href: "/verification", icon: "🛡️" },
  { name: "Financial", href: "/financial", icon: "💰" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
]

export const Sidebar = () => {
  const { logout } = useAuth()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">UfitGo</h1>
        <p className="text-sm text-gray-600">Operator Portal</p>
      </div>

      <nav className="flex-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
