import { useNavigate } from "react-router-dom"

export const StatCard = ({ title, value, subtitle, icon, trend, to }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={to ? () => navigate(to) : undefined}
      className={`card ${to ? "cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <p className="text-sm font-medium text-fg/70">
            {title}
          </p>

          {/* Value */}
          <p className="text-3xl font-bold text-fg mt-2">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-fg/60 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="text-4xl">
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-fg/70">
            {trend}
          </p>
        </div>
      )}
    </div>

  )
}
