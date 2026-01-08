"use client"

export const PackageCard = ({ package: pkg, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-gray-900">₦{pkg.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="text-gray-900">{pkg.duration} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Max Pilgrims:</span>
          <span className="text-gray-900">{pkg.maxPilgrims}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(pkg.id)} className="btn-secondary flex-1">
          Edit
        </button>
        <button
          onClick={() => onDelete(pkg.id)}
          disabled={isDeleting}
          className="btn-secondary flex-1 text-red-600 hover:bg-red-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
}
