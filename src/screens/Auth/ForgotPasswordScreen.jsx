"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // TODO: call forgot password API
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">

          <img src="/ufitgo-brand-mark.svg" alt="UfitGo" className="w-12 h-12 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-center">
            Forgot Password
          </h1>
          <p className="text-sm text-center opacity-70 mt-2">
            Enter your email to receive a reset link
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-sm text-success">
                ✅ Reset link sent to <strong>{email}</strong>
              </p>
              <p className="text-xs opacity-70 mt-2">
                Please check your inbox and spam folder.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-primary font-medium hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
