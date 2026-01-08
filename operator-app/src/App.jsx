import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx"
import LoginScreen from "./screens/Auth/LoginScreen.jsx"
import DashboardScreen from "./screens/Dashboard/DashboardScreen.jsx"
import PackagesScreen from "./screens/Packages/PackagesScreen.jsx"
import CreatePackageScreen from "./screens/Packages/CreatePackageScreen.jsx"
import EditPackageScreen from "./screens/Packages/EditPackageScreen.jsx"
import BookingsScreen from "./screens/Bookings/BookingsScreen.jsx"
import VerificationScreen from "./screens/Verification/VerificationScreen.jsx"
import FinancialScreen from "./screens/Financial/FinancialScreen.jsx"
import SettingsScreen from "./screens/Settings/SettingsScreen.jsx"

function App() {
  console.log("[v0] App component rendering")

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/packages" element={<PackagesScreen />} />
            <Route path="/packages/create" element={<CreatePackageScreen />} />
            <Route path="/packages/:id/edit" element={<EditPackageScreen />} />
            <Route path="/bookings" element={<BookingsScreen />} />
            <Route path="/verification" element={<VerificationScreen />} />
            <Route path="/financial" element={<FinancialScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
