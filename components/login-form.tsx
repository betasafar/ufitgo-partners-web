"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, User, Lock } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<"error" | "warning" | "info">("error")
  const [formData, setFormData] = useState({
    email: "elite@travels.com",
    password: "user@123",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setErrorType("error")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 503 && data.error === "CONNECTION_REFUSED") {
          setErrorType("warning")
          setError(
            "Backend service is not running. Please start the backend server at " +
              (data.details || "http://localhost:3001"),
          )
        } else if (response.status === 504 && data.error === "TIMEOUT") {
          setErrorType("warning")
          setError("The server is taking too long to respond. Please check if the backend is running.")
        } else if (response.status === 401) {
          setError("Invalid email or password. Please try again.")
        } else {
          setError(data.message || "Login failed. Please try again.")
        }
        setLoading(false)
        return
      }

      if (data.success) {
        setErrorType("info")
        setError("Login successful! Redirecting to dashboard...")

        setTimeout(() => {
          router.push("/dashboard")
        }, 500)
      } else {
        setError("Login failed - Invalid response from server")
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Login form error:", err)
      setError(
        err instanceof Error ? err.message : "Network error. Please check your internet connection and try again.",
      )
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to manage your travel packages and bookings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or username"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.remember}
              onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Remember me on this device
            </label>
          </div>
        </div>

        {error && (
          <div
            className={`p-3 border rounded-lg text-sm ${
              errorType === "warning"
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                : errorType === "info"
                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            <div className="flex gap-2">
              {errorType === "warning" && (
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {errorType === "info" && (
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="flex-1">{error}</span>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Signing in..." : "Log in to Dashboard"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="w-full bg-transparent">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button type="button" variant="outline" className="w-full bg-transparent">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            SSO
          </Button>
        </div>
      </form>

      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">New to TravelOps?</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Register your travel agency to start managing packages and bookings
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full bg-transparent"
            onClick={() => router.push("/signup")}
          >
            Create Operator Account
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Protected by reCAPTCHA and subject to the TravelOps{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>
        .
      </p>
    </div>
  )
}
