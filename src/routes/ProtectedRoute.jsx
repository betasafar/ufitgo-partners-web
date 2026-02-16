import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { Spinner } from "../components/common/Spinner.jsx"

export const ProtectedRoute = () => {
  const { operator, loading } = useAuth()

  console.log("[v0] ProtectedRoute - loading:", loading)
  console.log("[v0] ProtectedRoute - operator:", operator)

  if (loading) {
    console.log("[v0] ProtectedRoute - showing spinner")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!operator) {
    console.log("[v0] ProtectedRoute - no operator, redirecting to login")
    return <Navigate to="/login" replace />
  }

  console.log("[v0] ProtectedRoute - authenticated, rendering outlet")
  return <Outlet />
}
