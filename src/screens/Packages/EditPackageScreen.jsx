

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { PackageForm } from "../../components/features/packages/PackageForm"
import { Spinner } from "../../components/common/Spinner"
import { packagesService } from "../../api/services/packages.service"
import { usePackages } from "../../hooks/usePackages"

const EditPackageScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updatePackage } = usePackages()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    try {
      setLoading(true)
      const data = await packagesService.getById(id)
      setPackageData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data) => {
    try {
      setError(null)
      await updatePackage(id, data)
      navigate("/packages")
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Edit Package">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error && !packageData) {
    return (
      <DashboardLayout title="Edit Package">
        <div className="card text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate("/packages")} className="btn-secondary">
            Back to Packages
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Edit Package">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <PackageForm initialData={packageData} onSubmit={handleSubmit} onCancel={() => navigate("/packages")} />
    </DashboardLayout>
  )
}
export default EditPackageScreen
