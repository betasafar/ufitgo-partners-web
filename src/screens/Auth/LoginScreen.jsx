"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Quote, Star } from "lucide-react"
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
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-[#faf7f0] rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left: Form panel */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8">
              <img src="/ufitgo-brand-mark.svg" alt="UfitGo" className="w-8 h-8" />
              <span className="font-bold text-lg text-[#1a2e22]">UfitGo</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a2e22]">Sign In</h1>
            <p className="text-sm text-[#1a2e22]/60 mt-2">Welcome back! Please enter your details to continue.</p>
          </div>

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
                className="absolute right-3 top-[38px] text-[#1a2e22]/50 hover:text-[#1a2e22]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#1a2e22]/70 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-[#1a2e22]/40 mt-8">
            Need help? Contact support
          </p>
          <p className="text-center text-[11px] text-[#1a2e22]/30 mt-1">
            Powered by Betaday Logistic Limited.
          </p>
        </div>

        {/* Right: Testimonial panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#f0ead9] p-12 relative overflow-hidden">
          <div className="relative z-10">
            <Quote className="w-9 h-9 text-primary" fill="currentColor" />
            <p className="text-xl font-medium text-[#1a2e22] leading-relaxed mt-4">
              Onboarding on UfitGo was seamless. Bookings, payouts, and package
              management all live in one place — it's completely changed how
              we run our pilgrimage packages.
            </p>

            <div className="flex items-center gap-3 mt-8">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-[#1a2e22] text-sm">Aisha Bello</p>
                <p className="text-xs text-[#1a2e22]/60">Al-Amin Travels, Lagos</p>
              </div>
            </div>

            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-primary" fill="currentColor" />
              ))}
            </div>
          </div>

          {/* Decorative skyline motif */}
          <div className="relative z-10 flex items-end gap-3 opacity-80 mt-10">
            {[38, 60, 46, 70, 30, 54].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-primary/20 border border-primary/30"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/10" />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-primary/10" />
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
