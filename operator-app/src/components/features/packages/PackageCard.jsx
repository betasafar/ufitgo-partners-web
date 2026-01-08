"use client"

export const PackageCard = ({ package: pkg, onEdit, onDelete, isDeleting }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const isActive = pkg.status === "active"

  return (
    <div
      className="
        bg-card border border-border rounded-2xl p-5
        transition-all duration-200
        hover:shadow-xl hover:shadow-black/20
      "
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-fg leading-tight">
            {pkg.title}
          </h3>

          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium capitalize
              ${isActive
                ? "bg-green-500/10 text-green-400"
                : "bg-muted text-fg/60"}
            `}
          >
            {pkg.status}
          </span>
        </div>

        <p className="text-sm text-fg/70 line-clamp-2">
          {pkg.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-5 text-sm">
        <div className="flex justify-between">
          <span className="text-fg/60">Price</span>
          <span className="font-semibold text-fg">
            {formatPrice(pkg.price)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-fg/60">Type</span>
          <span className="text-fg capitalize">{pkg.type}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-fg/60">Capacity</span>
          <span className="text-fg">
            {pkg.booked || 0}/{pkg.capacity} booked
          </span>
        </div>

        {pkg.departureDate && (
          <div className="flex justify-between">
            <span className="text-fg/60">Departure</span>
            <span className="text-fg">
              {formatDate(pkg.departureDate)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(pkg.id)}
          className="
            flex-1 rounded-lg px-4 py-2 text-sm font-medium
            bg-bg text-fg
            border border-border
            hover:bg-bg/70
            transition
          "
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(pkg.id)}
          disabled={isDeleting}
          className="
            flex-1 rounded-lg px-4 py-2 text-sm font-medium
            border border-red-500/30
            text-red-400
            hover:bg-red-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  )
}
