import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Packages", href: "/packages", icon: "📦" },
  { name: "Pilgrims", href: "/bookings", icon: "👤" },
  { name: "Verification", href: "/verification", icon: "🛡️" },
  { name: "Financial", href: "/financial", icon: "💰" },
  { name: "Commissions", href: "/financial/commissions", icon: "🤝" },
  { name: "Promos & Discounts", href: "/promos", icon: "🏷️" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
]

export const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/50 z-40 lg:hidden
          ${open ? "block" : "hidden"}
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[var(--sidebar-width)]
          bg-card border-r border-border
          flex flex-col
          transition-transform duration-200
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ "--sidebar-width": "16rem" }}
      >
        {/* Header (fixed) */}
        <div className="h-16 px-6 flex items-center border-b border-border shrink-0">
          <div>
            <h1 className="text-xl font-bold text-primary">UfitGo</h1>
            <p className="text-xs text-fg/70">Operator Portal</p>
          </div>
        </div>

        {/* Scrollable menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                  ? "bg-primary text-white"
                  : "text-fg hover:bg-bg/60"}
                `
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer (fixed) */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                       text-fg hover:bg-bg/60 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
