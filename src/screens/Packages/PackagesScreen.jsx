"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Button } from "../../components/common/Button"
import { Spinner } from "../../components/common/Spinner"
import { usePackages } from "../../hooks/usePackages"
import { PackageCard } from "../../components/features/packages/PackageCard"

const PackagesScreen = () => {
  const navigate = useNavigate()

  console.log("[v0] PackagesScreen mounting...")

  const { packages, loading, error, deletePackage } = usePackages()

  console.log("[v0] PackagesScreen state:", { packages, loading, error })

  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        setDeleting(id)
        await deletePackage(id)
      } catch (err) {
        alert("Failed to delete package: " + err.message)
      } finally {
        setDeleting(null)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/packages/${id}/edit`)
  }

  if (loading) {
    return (
      <DashboardLayout title="My Packages">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="My Packages">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="My Packages">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          You have {packages.length} package{packages.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={() => navigate("/packages/create")}>Create New Package</Button>
      </div>

      {packages.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any packages yet</p>
          <Button onClick={() => navigate("/packages/create")}>Create Your First Package</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleting === pkg.id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default PackagesScreen
