"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { PackageForm } from "../../components/features/packages/PackageForm"
import { usePackages } from "../../hooks/usePackages"

export const CreatePackageScreen = () => {
  const navigate = useNavigate()
  const { createPackage } = usePackages()
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    try {
      setError(null)
      await createPackage(data)
      navigate("/packages")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <DashboardLayout title="Create New Package">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <PackageForm onSubmit={handleSubmit} onCancel={() => navigate("/packages")} />
    </DashboardLayout>
  )
}
