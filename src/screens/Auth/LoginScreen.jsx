"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/AuthContext.jsx"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button.jsx"

function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      localStorage.setItem("login_time", Date.now().toString())
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">UfitGo</h1>
            <p className="text-sm opacity-70 mt-2">Operator Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            {/* Password + Toggle */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* CTAs */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-primary hover:underline"
            >
              Forgot password?
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline font-medium"
            >
              Create account
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs opacity-60 mt-6">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
