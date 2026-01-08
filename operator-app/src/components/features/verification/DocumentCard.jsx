import { Card } from "../../common/Card"

export const DocumentCard = ({ document }) => {
  const getStatusBadge = () => {
    switch (document.status) {
      case "approved":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✅ Approved</span>
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">❌ Rejected</span>
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">⏳ Pending</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Unknown</span>
    }
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold capitalize">{document.documentType.replace("_", " ")}</h3>
          <p className="text-sm text-gray-600 mt-1">Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}</p>
          {document.rejectionReason && (
            <p className="text-sm text-red-600 mt-2">
              <strong>Reason:</strong> {document.rejectionReason}
            </p>
          )}
        </div>
        {getStatusBadge()}
      </div>
    </Card>
  )
}
