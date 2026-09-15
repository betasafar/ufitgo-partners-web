

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { PackageForm } from "../../components/features/packages/PackageForm"
import { Spinner } from "../../components/common/Spinner"
import { packagesService } from "../../api/services/packages.service"
import { usePackages } from "../../hooks/usePackages"
import { mapApiPackageToFormInitialData } from "../../utils/packageMapper"

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
      setPackageData(mapApiPackageToFormInitialData(data))
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/packages")}
          className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-fg hover:bg-border/50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-fg">Edit Package</h1>
          <p className="text-fg/60">Update your package details</p>
        </div>
      </div>

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
