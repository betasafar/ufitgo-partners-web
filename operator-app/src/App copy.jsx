import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { LoginScreen } from "./screens/Auth/LoginScreen"
import { DashboardScreen } from "./screens/Dashboard/DashboardScreen"
import { PackagesScreen } from "./screens/Packages/PackagesScreen"
import { CreatePackageScreen } from "./screens/Packages/CreatePackageScreen"
import { EditPackageScreen } from "./screens/Packages/EditPackageScreen"
import { BookingsScreen } from "./screens/Bookings/BookingsScreen"
import { VerificationScreen } from "./screens/Verification/VerificationScreen"
import { FinancialScreen } from "./screens/Financial/FinancialScreen"
import { SettingsScreen } from "./screens/Settings/SettingsScreen"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <ProtectedRoute>
                <PackagesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages/create"
            element={
              <ProtectedRoute>
                <CreatePackageScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages/edit/:id"
            element={
              <ProtectedRoute>
                <EditPackageScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <ProtectedRoute>
                <VerificationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial"
            element={
              <ProtectedRoute>
                <FinancialScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
