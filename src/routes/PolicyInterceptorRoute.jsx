import { useState, useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Spinner } from "../components/common/Spinner"
import { commissionService } from "../api/services/commission.service"
import { useAuth } from "../context/AuthContext"

export const PolicyInterceptorRoute = () => {
  const { operator } = useAuth()
  const location = useLocation()
  
  const [loading, setLoading] = useState(true)
  const [hasAcceptedLatest, setHasAcceptedLatest] = useState(true)

  useEffect(() => {
    if (operator) {
      checkPolicyStatus()
    } else {
      setLoading(false)
    }
  }, [operator, location.pathname])

  const checkPolicyStatus = async () => {
    try {
      // Don't intercept if they are already on the policy-agreement page
      if (location.pathname === "/policy-agreement") {
        setLoading(false)
        return
      }

      const status = await commissionService.getPolicyStatus()
      setHasAcceptedLatest(status.hasAcceptedLatest)
    } catch (err) {
      console.error("Failed to check policy status", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (operator && !hasAcceptedLatest && location.pathname !== "/policy-agreement") {
    return <Navigate to="/policy-agreement" replace />
  }

  return <Outlet />
}
