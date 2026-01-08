"use client"

import { useState, useEffect } from "react"
import { verificationService } from "../api/services/verification.service"

export const useVerification = () => {
  const [status, setStatus] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const data = await verificationService.getStatus()
      setStatus(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const data = await verificationService.getDocuments()
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    }
  }

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
    fetchStatus()
    fetchDocuments()
  }, [])

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
