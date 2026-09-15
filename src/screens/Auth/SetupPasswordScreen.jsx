import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import apiClient from "../../api/client"
import { PasswordStrengthMeter } from "../../components/common/PasswordStrengthMeter"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"

export default function SetupPasswordScreen() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [complete, setComplete] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!token) {
      setError("This password setup link is incomplete. Please use the link from your welcome email.")
      return
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await apiClient.post("/operator/auth/setup-password", { token, password })
      setComplete(true)
    } catch (requestError) {
      setError(requestError.message || "Unable to create your password. The link may have expired.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-fg px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-primary">UfitGo Partner Portal</p>
          <h1 className="text-2xl font-bold mt-2">Create your password</h1>
          <p className="text-sm opacity-70 mt-2">Secure your account to complete your portal activation.</p>
        </div>

        {complete ? (
          <div className="text-center space-y-5">
            <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Your password has been created successfully.
            </div>
            <Link to="/login" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-white">
              Continue to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="New password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
            <Input
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? "Creating password..." : "Create password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}