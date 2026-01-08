"use client"

import { useState } from "react"
import { useVerification } from "../../hooks/useVerification"
import { Button } from "../../components/common/Button"
import { Card } from "../../components/common/Card"
import { DocumentUpload } from "../../components/features/verification/DocumentUpload"
import { DocumentCard } from "../../components/features/verification/DocumentCard"
import { VerificationProgress } from "../../components/features/verification/VerificationProgress"

export const VerificationScreen = () => {
  const { status, documents, loading, error, uploadDocument, refetch } = useVerification()
  const [uploadingDoc, setUploadingDoc] = useState(null)

  const handleUpload = async (documentType, files) => {
    try {
      setUploadingDoc(documentType)
      const formData = new FormData()
      formData.append("documentType", documentType)
      formData.append("file", files[0])

      await uploadDocument(formData)
      alert("Document uploaded successfully!")
    } catch (err) {
      alert("Failed to upload document: " + err.message)
    } finally {
      setUploadingDoc(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification</h1>
        <p className="text-gray-600 mt-2">Complete your verification to unlock full access</p>
      </div>

      <VerificationProgress status={status} documents={documents} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DocumentUpload
          title="Company Registration (CAC)"
          description="Upload your company registration certificate"
          documentType="cac"
          onUpload={(files) => handleUpload("cac", files)}
          uploading={uploadingDoc === "cac"}
          document={documents.find((doc) => doc.documentType === "cac")}
        />

        <DocumentUpload
          title="Valid ID"
          description="Government-issued ID (Driver's License, Passport, etc.)"
          documentType="id"
          onUpload={(files) => handleUpload("id", files)}
          uploading={uploadingDoc === "id"}
          document={documents.find((doc) => doc.documentType === "id")}
        />

        <DocumentUpload
          title="Bank Statement"
          description="Recent bank statement (last 3 months)"
          documentType="bank_statement"
          onUpload={(files) => handleUpload("bank_statement", files)}
          uploading={uploadingDoc === "bank_statement"}
          document={documents.find((doc) => doc.documentType === "bank_statement")}
        />
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
