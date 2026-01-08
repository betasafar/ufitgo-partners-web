"use client"

import { useState } from "react"
import { Card } from "../../common/Card"
import { Button } from "../../common/Button"

export const DocumentUpload = ({ title, description, documentType, onUpload, uploading, document }) => {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files)
    }
  }

  const getStatusColor = () => {
    if (!document) return "gray"
    switch (document.status) {
      case "approved":
        return "green"
      case "rejected":
        return "red"
      case "pending":
        return "yellow"
      default:
        return "gray"
    }
  }

  const statusColor = getStatusColor()

  return (
    <Card>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {document && (
        <div
          className={`mb-4 p-3 rounded-lg border-2 ${
            statusColor === "green"
              ? "bg-green-50 border-green-300"
              : statusColor === "red"
                ? "bg-red-50 border-red-300"
                : "bg-yellow-50 border-yellow-300"
          }`}
        >
          <p className="text-sm font-medium">
            Status:{" "}
            <span className="capitalize">
              {document.status === "approved"
                ? "✅ Approved"
                : document.status === "rejected"
                  ? "❌ Rejected"
                  : "⏳ Under Review"}
            </span>
          </p>
          {document.rejectionReason && <p className="text-sm text-red-700 mt-1">Reason: {document.rejectionReason}</p>}
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          id={`file-${documentType}`}
          onChange={handleChange}
          className="hidden"
          accept="image/*,.pdf"
          disabled={uploading}
        />
        <label htmlFor={`file-${documentType}`} className="cursor-pointer">
          <div className="space-y-2">
            <p className="text-4xl">📄</p>
            <p className="text-sm text-gray-600">{uploading ? "Uploading..." : "Click or drag file to upload"}</p>
            <p className="text-xs text-gray-500">PNG, JPG or PDF (max. 5MB)</p>
          </div>
        </label>
      </div>

      {document?.status === "rejected" && (
        <Button className="w-full mt-4" disabled={uploading}>
          {uploading ? "Uploading..." : "Reupload Document"}
        </Button>
      )}
    </Card>
  )
}
