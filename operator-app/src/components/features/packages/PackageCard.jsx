"use client"

export const PackageCard = ({ package: pkg, onEdit, onDelete, isDeleting }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${pkg.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
          >
            {pkg.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-gray-900">{formatPrice(pkg.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="text-gray-900 capitalize">{pkg.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Capacity:</span>
          <span className="text-gray-900">
            {pkg.booked || 0}/{pkg.capacity} booked
          </span>
        </div>
        {pkg.departureDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Departure:</span>
            <span className="text-gray-900">{formatDate(pkg.departureDate)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(pkg.id)} className="btn-secondary flex-1">
          Edit
        </button>
        <button
          onClick={() => onDelete(pkg.id)}
          disabled={isDeleting}
          className="btn-secondary flex-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
}
