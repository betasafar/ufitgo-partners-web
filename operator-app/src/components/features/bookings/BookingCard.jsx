

export const BookingCard = ({ booking, onStatusUpdate, isUpdating }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.packageName}</h3>
          <p className="text-sm text-gray-600">Pilgrim: {booking.pilgrimName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Contact</p>
          <p className="text-sm font-medium text-gray-900">{booking.pilgrimEmail}</p>
          <p className="text-sm font-medium text-gray-900">{booking.pilgrimPhone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="text-lg font-semibold text-gray-900">₦{booking.amount?.toLocaleString()}</p>
        </div>
      </div>

      {booking.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusUpdate(booking.id, "confirmed")}
            disabled={isUpdating}
            className="btn-primary flex-1"
          >
            {isUpdating ? "Processing..." : "Accept"}
          </button>
          <button
            onClick={() => onStatusUpdate(booking.id, "cancelled")}
            disabled={isUpdating}
            className="btn-secondary flex-1 text-red-600 hover:bg-red-50"
          >
            Decline
          </button>
        </div>
      )}

      {booking.status === "confirmed" && (
        <button
          onClick={() => onStatusUpdate(booking.id, "completed")}
          disabled={isUpdating}
          className="btn-primary w-full"
        >
          {isUpdating ? "Processing..." : "Mark as Completed"}
        </button>
      )}
    </div>
  )
}
