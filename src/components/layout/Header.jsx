import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const Header = ({ title, onMenuClick }) => {
  const { operator, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") setOpen(false) }
    if (open) document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
  }

  const handleProfile = () => {
    setOpen(false)
    navigate("/settings")
  }

  /** Derive initials from company name or email */
  const initials = (() => {
    const name = operator?.companyName || operator?.email || ""
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  })()

  return (
    <header
      className="
        fixed top-0 right-0 z-30
        h-16
        bg-card border-b border-border
        flex items-center
        px-4 lg:px-6
        transition-[left] duration-200
        left-0
        lg:left-[var(--sidebar-width)]
      "
      style={{ "--sidebar-width": "16rem" }}
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-fg text-xl"
            aria-label="Open menu"
          >
            ☰
          </button>

          <h1 className="text-lg lg:text-xl font-bold text-fg truncate">
            {title}
          </h1>
        </div>

        {/* Right — profile */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* Name + email (desktop) */}
          <div className="text-right max-w-[180px] hidden sm:block">
            <p className="text-sm font-medium text-fg truncate leading-tight">
              {operator?.companyName}
            </p>
            <p className="text-xs text-fg/60 truncate">
              {operator?.email}
            </p>
          </div>

          {/* Avatar button */}
          <button
            id="profile-menu-button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="
              relative flex-shrink-0
              w-9 h-9 rounded-full
              bg-primary text-white
              flex items-center justify-center
              text-sm font-semibold
              ring-2 ring-transparent
              hover:ring-primary/40
              focus:outline-none focus:ring-primary/60
              transition-all duration-150
              select-none cursor-pointer
            "
          >
            {initials}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              id="profile-dropdown"
              role="menu"
              aria-labelledby="profile-menu-button"
              className="
                absolute top-[calc(100%+10px)] right-0
                w-64
                bg-card border border-border
                rounded-xl shadow-xl
                overflow-hidden
                animate-scale-in
                origin-top-right
              "
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border bg-bg/50">
                <p className="text-sm font-semibold text-fg truncate">
                  {operator?.companyName || "Operator"}
                </p>
                <p className="text-xs text-fg/60 truncate mt-0.5">
                  {operator?.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button
                  role="menuitem"
                  onClick={handleProfile}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-2.5
                    text-sm text-fg
                    hover:bg-primary/10 hover:text-primary
                    transition-colors duration-100
                    text-left
                  "
                >
                  {/* Person icon */}
                  <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profile Settings
                </button>

                <div className="my-1 mx-3 border-t border-border" />

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-2.5
                    text-sm text-red-500
                    hover:bg-red-50
                    transition-colors duration-100
                    text-left
                  "
                >
                  {/* Logout icon */}
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
