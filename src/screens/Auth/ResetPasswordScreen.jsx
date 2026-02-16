"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { PasswordStrengthMeter } from "../../components/common/PasswordStrengthMeter"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"

export default function ResetPasswordScreen() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState(false)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) return

        // TODO: call reset password API
        setSuccess(true)

        setTimeout(() => {
            navigate("/login")
        }, 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl shadow-card p-8">

                    <h1 className="text-2xl font-bold text-center">
                        Reset Password
                    </h1>
                    <p className="text-sm text-center opacity-70 mt-2">
                        Choose a new secure password
                    </p>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                            <div className="relative">
                                <Input
                                    label="New Password"
                                    type={show ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <PasswordStrengthMeter password={password} />

                            <Input
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <Button type="submit" className="w-full">
                                Reset Password
                            </Button>
                        </form>
                    ) : (
                        <div className="mt-6 text-center">
                            <p className="text-success text-sm font-medium">
                                ✅ Password reset successfully
                            </p>
                            <p className="text-xs opacity-70 mt-2">
                                Redirecting to login…
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
