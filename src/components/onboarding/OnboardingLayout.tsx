// src/components/onboarding/OnboardingLayout.tsx
import { CheckCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const STEP_LABELS = ["Partner Type", "Company Info", "Contact Info", "Account", "Documents", "Review"]

interface OnboardingLayoutProps {
  currentStep: number
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
  isSubmit?: boolean
}

export function OnboardingLayout({
  currentStep,
  children,
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  loading = false,
  isSubmit = false,
}: OnboardingLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Left Column: Branding */}
      <div className="relative flex flex-col justify-between bg-[#0a1c12] p-8 text-white md:w-5/12 lg:w-1/3 md:sticky md:top-0 md:h-screen lg:p-12">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />

        <div className="relative z-10">
          <div className="mb-16 flex items-center gap-3">
            <img src="/ufitgo-brand-mark.svg" alt="UfitGo" className="w-9 h-9" />
            <div>
              <h1 className="text-2xl font-bold">UfitGo</h1>
              <p className="text-xs text-white/60 mt-1">Operator Portal</p>
            </div>
          </div>

          <h2 className="font-serif text-4xl font-bold leading-tight mb-6 lg:text-5xl">
            Create with <br className="hidden md:block" />
            <span className="text-[#E5B611]">UfitGo</span>
          </h2>

          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Join Nigeria's fastest-growing Hajj and Umrah marketplace. List your services and reach thousands of pilgrims.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Reach More Pilgrims</h3>
                <p className="text-sm text-white/70 mt-1">Access a massive audience actively looking for trusted services.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Streamlined Bookings</h3>
                <p className="text-sm text-white/70 mt-1">Manage all your requests and payments in one unified dashboard.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Instant Payouts</h3>
                <p className="text-sm text-white/70 mt-1">Receive payouts instantly and securely to your bank account.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} UfitGo. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Column: The Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-32">
        <div className="mb-8">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Operator Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Join UfitGo to manage Hajj & Umrah services
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-300 -z-10"
                style={{ width: `${((currentStep) / (STEP_LABELS.length - 1)) * 100}%` }}
              />
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex-1 text-center">
                  <div
                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStep
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < currentStep ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <p className="text-[10px] mt-2 text-gray-500 hidden sm:block">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>

          {/* Navigation */}
          {(onBack || onNext) && (
            <div className="flex justify-between items-center mt-8">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {onNext && (
                <button
                  type={isSubmit ? "submit" : "button"}
                  onClick={onNext}
                  disabled={nextDisabled || loading}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm
                    hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Creating..."
                    : nextLabel || "Continue"}
                </button>
              )}
            </div>
          )}

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
