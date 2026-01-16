// SignupScreen.tsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"

import { PasswordStrengthMeter } from "../../components/common/PasswordStrengthMeter"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"
import { onboardingService } from "../../api/services/auth.service"
import { PhoneInputField } from "../../components/common/PhoneInput"

const steps = ["Personal", "Organization", "Security"]

type SignupFormData = {
  email?: string
  phone?: string
  companyName?: string
  cacNumber?: string
  password?: string
  confirmPassword?: string
}

export default function SignupScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isFromWhatsApp, setIsFromWhatsApp] = useState(false)
  const [waPhone, setWaPhone] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      phone: "",
      companyName: "",
      cacNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  // Detect WhatsApp origin on mount
 useEffect(() => {
  const source = searchParams.get("source")
  let phoneFromQuery = searchParams.get("wa_phone")

  if (source === "whatsapp" && phoneFromQuery) {
    // Make sure it starts with + (in case URL decoding removed it)
    if (!phoneFromQuery.startsWith("+")) {
      phoneFromQuery = "+" + phoneFromQuery
    }

    setIsFromWhatsApp(true)
    setWaPhone(phoneFromQuery)
    setValue("phone", phoneFromQuery, { shouldValidate: true, shouldDirty: false })
  }
}, [searchParams, setValue])

  // Prevent Enter key submit on early steps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && step !== steps.length - 1) {
        e.preventDefault()
        next()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step])

  const safeTrim = (val: string | undefined) => (val ?? "").trim()

  const validateStep = (): { valid: boolean; error?: string } => {
    const values = getValues()

    if (step === 0) {
      const email = safeTrim(values.email)
      if (!email) return { valid: false, error: "Email is required" }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { valid: false, error: "Invalid email address" }

      const phone = safeTrim(values.phone)
      if (!phone) return { valid: false, error: "Phone number is required" }
      if (!/^\+\d{8,15}$/.test(phone.replace(/\s/g, "")))
        return { valid: false, error: "Invalid phone number format (use international format)" }
    }

    if (step === 1) {
      const companyName = safeTrim(values.companyName)
      if (!companyName) return { valid: false, error: "Company name is required" }
      if (companyName.length < 2)
        return { valid: false, error: "Company name is too short" }

      const cacNumber = safeTrim(values.cacNumber)
      if (!cacNumber) return { valid: false, error: "CAC number is required" }
      if (cacNumber.length < 5)
        return { valid: false, error: "CAC number is too short" }
    }

    if (step === 2) {
      const passwordVal = safeTrim(values.password)
      if (!passwordVal) return { valid: false, error: "Password is required" }
      if (passwordVal.length < 8)
        return { valid: false, error: "Password must be at least 8 characters" }
      if (!/[A-Z]/.test(passwordVal))
        return { valid: false, error: "Password must contain at least one uppercase letter" }
      if (!/[a-z]/.test(passwordVal))
        return { valid: false, error: "Password must contain at least one lowercase letter" }
      if (!/[0-9]/.test(passwordVal))
        return { valid: false, error: "Password must contain at least one number" }

      const confirm = safeTrim(values.confirmPassword)
      if (!confirm) return { valid: false, error: "Please confirm your password" }
      if (passwordVal !== confirm)
        return { valid: false, error: "Passwords do not match" }
    }

    return { valid: true }
  }

  const next = () => {
    setFormError(null)
    const { valid, error } = validateStep()

    if (!valid) {
      setFormError(error || "Please fill all required fields correctly")
      return
    }

    if (step < steps.length - 1) {
      setStep((s) => s + 1)
    }
  }

  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = async (data: SignupFormData) => {
    if (step !== steps.length - 1) return

    setFormError(null)

    const { valid, error } = validateStep()
    if (!valid) {
      setFormError(error || "Form validation failed")
      return
    }

    const cleanedData = {
      email: safeTrim(data.email),
      phone: safeTrim(data.phone),
      companyName: safeTrim(data.companyName),
      cacNumber: safeTrim(data.cacNumber),
      password: safeTrim(data.password),
    }

    setLoading(true)
    try {
      const response = await onboardingService.register(cleanedData, {
        source: isFromWhatsApp ? "whatsapp" : "web",
        waPhone: waPhone ?? undefined,
      })

      // Store continuation data for success page
      if (response.continuationUrl) {
        localStorage.setItem(
          "signupContinuation",
          JSON.stringify({
            url: response.continuationUrl,
            message: response.continuationMessage || "Return to WhatsApp to verify instantly",
          })
        )
      }

      navigate("/signup-success")
    } catch (err: any) {
      setFormError(err || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-xl">
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">UfitGo</h1>
            <h2 className="text-2xl font-bold mt-2">Create Operator Account</h2>
            <p className="text-sm opacity-70 mt-1">
              {isFromWhatsApp
                ? "Continuing from WhatsApp – let's finish your registration"
                : "Join UfitGo to manage Hajj & Umrah packages"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {steps.map((label, i) => (
              <div key={label} className="flex-1 text-center">
                <div
                  className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
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

          <form
            onSubmit={(e) => {
              if (step !== steps.length - 1) {
                e.preventDefault()
                return
              }
              handleSubmit(onSubmit)(e)
            }}
            className="space-y-5"
          >
            {formError && (
              <p className="text-red-600 text-sm text-center">{formError}</p>
            )}

            {/* STEP 1 */}
            {step === 0 && (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="operator@company.com"
                  {...register("email")}
                  error={errors.email?.message}
                />

                <PhoneInputField
                  label="Phone Number"
                  name="phone"
                  setValue={setValue}
                  error={errors.phone?.message}
                  disabled={isFromWhatsApp} // ← Disable if from WhatsApp
                  value={waPhone ?? undefined} // ← Prefill
                />
                {isFromWhatsApp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Phone number pre-filled from WhatsApp
                  </p>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <>
                <Input
                  label="Company / Operator Name"
                  placeholder="Hajj & Umrah Services Ltd"
                  {...register("companyName")}
                  error={errors.companyName?.message}
                />

                <Input
                  label="CAC Number"
                  placeholder="RC-1234567"
                  {...register("cacNumber")}
                  error={errors.cacNumber?.message}
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
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password?.message}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {password && <PasswordStrengthMeter password={password} />}

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </>
            )}

            <div className="flex justify-between items-center mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="text-sm text-fg/70 hover:underline"
                >
                  Back
                </button>
              )}

                <Button
                type={step === steps.length - 1 ? "submit" : "button"}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (step < steps.length - 1) {
                  e.preventDefault()
                  next()
                  }
                }}
                disabled={loading}
                >
                {loading
                  ? "Creating..."
                  : step < steps.length - 1
                  ? "Continue"
                  : "Create Account"}
                </Button>
            </div>
          </form>

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