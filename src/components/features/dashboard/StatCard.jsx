export const StatCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="card">
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
