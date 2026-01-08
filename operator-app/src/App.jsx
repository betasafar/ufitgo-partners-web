import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { AuthProvider } from "./context/AuthContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx"

/* Auth Screens */
import LoginScreen from "./screens/Auth/LoginScreen.jsx"
import SignupScreen from "./screens/Auth/SignupScreen.jsx"
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen.jsx"
import ResetPasswordScreen from "./screens/Auth/ResetPasswordScreen.jsx"

/* App Screens */
import DashboardScreen from "./screens/Dashboard/DashboardScreen.jsx"
import PackagesScreen from "./screens/Packages/PackagesScreen.jsx"
import CreatePackageScreen from "./screens/Packages/CreatePackageScreen.jsx"
import EditPackageScreen from "./screens/Packages/EditPackageScreen.jsx"
import BookingsScreen from "./screens/Bookings/BookingsScreen.jsx"
import VerificationScreen from "./screens/Verification/VerificationScreen.jsx"
import FinancialScreen from "./screens/Financial/FinancialScreen.jsx"
import SettingsScreen from "./screens/Settings/SettingsScreen.jsx"
import Profile from "./screens/Settings/Profile.jsx"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ===================== */}
            {/* AUTH ROUTES */}
            {/* ===================== */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />

            {/* ===================== */}
            {/* PROTECTED APP ROUTES */}
            {/* ===================== */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/packages" element={<PackagesScreen />} />
              <Route path="/packages/create" element={<CreatePackageScreen />} />
              <Route path="/packages/:id/edit" element={<EditPackageScreen />} />
              <Route path="/bookings" element={<BookingsScreen />} />
              <Route path="/verification" element={<VerificationScreen />} />
              <Route path="/financial" element={<FinancialScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/settings/profile" element={<Profile />} />
            </Route>

            {/* ===================== */}
            {/* DEFAULT REDIRECT */}
            {/* ===================== */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ===================== */}
            {/* 404 */}
            {/* ===================== */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-bg text-fg">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="opacity-70 mb-6">Page not found</p>
                    <a
                      href="/dashboard"
                      className="text-primary font-medium hover:underline"
                    >
                      Go back to dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
