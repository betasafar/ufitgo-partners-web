"use client"

import { useState, useEffect } from "react"
import { verificationService } from "../api/services/verification.service"
import { useAuth } from "../context/AuthContext"

export const useVerification = () => {
  const { operator } = useAuth()
  const [status, setStatus] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStatus = async () => {
    if (!operator?.id) {
      setError("Operator ID not found")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await verificationService.getStatus(operator.id)

      // Extract the actual status string
      setStatus(response?.status || 'pending')

      // If documents are included in this response, normalize them too
      if (response?.documents) {
        const normalized = Array.isArray(response.documents)
          ? response.documents
          : (typeof response.documents === 'object' ? Object.values(response.documents) : [])
        setDocuments(normalized.filter(doc => doc && typeof doc === 'object'))
      }

      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  const fetchDocuments = async () => {
    try {
      const data = await verificationService.getDocuments();

      let docs = [];
      if (Array.isArray(data)) {
        docs = data;
      } else if (data && typeof data === 'object') {
        docs = Object.values(data);
      }

      // STRICT FILTER: Only keep valid document objects
      const validDocs = docs.filter(doc =>
        doc &&
        typeof doc === 'object' &&
        doc.id &&                  // must have id for key
        doc.documentType &&        // must have documentType
        doc.uploadedAt             // must have uploadedAt
      );

      setDocuments(validDocs);
    } catch (err) {
      setError(err.message);
      setDocuments([]);
    }
  };
  const uploadDocument = async (formData) => {
    try {
      const result = await verificationService.uploadDocument(formData)
      await fetchDocuments()
      return result
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    if (operator?.id) {
      fetchStatus()
      fetchDocuments()
    }
  }, [operator?.id])

  return {
    status,
    documents,
    loading,
    error,
    uploadDocument,
    refetch: () => {
      fetchStatus()
      fetchDocuments()
    },
  }
}
