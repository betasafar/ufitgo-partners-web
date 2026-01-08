import { useAuth } from "../../context/AuthContext"

export const Header = ({ title, onMenuClick }) => {
  const { operator } = useAuth()

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
          >
            ☰
          </button>

          <h1 className="text-lg lg:text-xl font-bold text-fg truncate">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-right max-w-[180px] hidden sm:block">
            <p className="text-sm font-medium text-fg truncate">
              {operator?.companyName}
            </p>
            <p className="text-xs text-fg/70 truncate">
              {operator?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
