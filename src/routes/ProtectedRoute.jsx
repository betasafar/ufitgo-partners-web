import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { Spinner } from "../components/common/Spinner.jsx"

export const ProtectedRoute = () => {
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

  return <Outlet />
}
