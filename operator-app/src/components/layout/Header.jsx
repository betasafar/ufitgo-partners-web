"use client"

import { useAuth } from "../../context/AuthContext"

export const Header = ({ title }) => {
  const { operator } = useAuth()

  const getVerificationBadge = () => {
    if (operator?.verificationStatus === "approved") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ✅ Verified Operator
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        🛡️ New Operator (Escrow Protected)
      </span>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {getVerificationBadge()}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{operator?.companyName}</p>
            <p className="text-xs text-gray-600">{operator?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
