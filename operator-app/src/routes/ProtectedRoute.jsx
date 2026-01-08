"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Spinner } from "../components/common/Spinner"

export const ProtectedRoute = ({ children }) => {
  const { operator, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!operator) {
    return <Navigate to="/login" replace />
  }

  return children
}
