"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { PasswordStrengthMeter } from "../../components/common/PasswordStrengthMeter"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"

const steps = ["Account", "Organization", "Security"]

export default function SignupScreen() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [showPassword, setShowPassword] = useState(false)

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        company: "",
        country: "",
        password: "",
        confirmPassword: "",
    })

    const update = (k, v) => setForm({ ...form, [k]: v })

    const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
    const prev = () => setStep((s) => Math.max(s - 1, 0))

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
            <div className="w-full max-w-xl">

                {/* Card */}
                <div className="bg-card border border-border rounded-2xl shadow-card p-8">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-sm opacity-70 mt-1">
                            Operator onboarding
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex justify-between mb-8">
                        {steps.map((label, i) => (
                            <div key={label} className="flex-1 text-center">
                                <div
                                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${i <= step
                                            ? "bg-primary text-primary-contrast"
                                            : "bg-border text-fg/60"
                                        }`}
                                >
                                    {i < step ? <CheckCircle size={16} /> : i + 1}
                                </div>
                                <p className="text-xs mt-2 opacity-70">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Steps */}
                    <div className="space-y-5">

                        {/* STEP 1 */}
                        {step === 0 && (
                            <>
                                <Input
                                    label="Full Name"
                                    value={form.fullName}
                                    onChange={(e) => update("fullName", e.target.value)}
                                    placeholder="John Doe"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="you@company.com"
                                />
                            </>
                        )}

                        {/* STEP 2 */}
                        {step === 1 && (
                            <>
                                <Input
                                    label="Company / Operator Name"
                                    value={form.company}
                                    onChange={(e) => update("company", e.target.value)}
                                    placeholder="Hajj Ops Ltd"
                                />
                                <Input
                                    label="Country"
                                    value={form.country}
                                    onChange={(e) => update("country", e.target.value)}
                                    placeholder="Saudi Arabia"
                                />
                            </>
                        )}

                        {/* STEP 3 */}
                        {step === 2 && (
                            <>
                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => update("password", e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <PasswordStrengthMeter password={password} />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => update("confirmPassword", e.target.value)}
                                />



                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-8">
                        {step > 0 ? (
                            <button
                                onClick={prev}
                                className="text-sm text-fg/70 hover:underline"
                            >
                                Back
                            </button>
                        ) : (
                            <span />
                        )}

                        {step < steps.length - 1 ? (
                            <Button onClick={next}>
                                Continue
                            </Button>
                        ) : (
                            <Button>
                                Create Account
                            </Button>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm mt-6 opacity-70">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-primary font-medium hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
