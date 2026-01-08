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
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">UfitGo</h1>
        <p className="text-sm text-fg/70">Operator Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-fg hover:bg-bg/60",
              ].join(" ")
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                     text-fg hover:bg-bg/60"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
