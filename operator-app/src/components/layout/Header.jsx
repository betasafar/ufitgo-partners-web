import { useAuth } from "../../context/AuthContext"

export const Header = ({ title }) => {
  const { operator } = useAuth()

  const getVerificationBadge = () => {
    if (operator?.verificationStatus === "approved") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                         bg-green-500/10 text-green-600">
          ✅ Verified Operator
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                       bg-blue-500/10 text-blue-600">
        🛡️ New Operator (Escrow Protected)
      </span>
    )
  }

  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold text-fg">
          {title}
        </h1>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {getVerificationBadge()}

          <div className="text-right">
            <p className="text-sm font-medium text-fg">
              {operator?.companyName}
            </p>
            <p className="text-xs text-fg/70">
              {operator?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
