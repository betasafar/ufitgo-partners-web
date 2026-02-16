import { Card } from "../../common/Card"

export const DocumentCard = ({ document }) => {
  // Early return if document is invalid
  if (!document || !document.documentType) {
    return null; // or return a placeholder
  }

  const getStatusBadge = () => {
    const status = document.status || 'unknown';
    switch (status.toLowerCase()) {
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

  const formatDocumentType = (type) => {
    return type ? type.replace(/_/g, " ") : "Unknown Document";
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold capitalize">
            {formatDocumentType(document.documentType)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Uploaded: {formatDate(document.uploadedAt)}
          </p>
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