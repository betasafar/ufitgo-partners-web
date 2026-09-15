// src/pages/SignupSuccess.tsx
"use client"

import { useEffect, useState } from "react"
import { CheckCircle, ArrowRight, MessageCircle, CreditCard } from "lucide-react"
import { Button } from "../../components/common/Button"
import { useNavigate } from "react-router-dom"

export default function SignupSuccess() {
  const navigate = useNavigate()
  const [continuation, setContinuation] = useState<{
    url: string
    message: string
  } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("signupContinuation")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setContinuation(data)
        localStorage.removeItem("signupContinuation")
      } catch (err) {
        console.error("Failed to parse continuation data", err)
      }
    }
  }, [])

  const handleContinueWhatsApp = () => {
    if (continuation?.url) {
      window.open(continuation.url, "_blank")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Account Created!</h1>
          <p className="text-lg opacity-80">
            Your operator account has been successfully created and is pending admin approval.
          </p>
        </div>

        {continuation ? (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <MessageCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Continue on WhatsApp</h2>
            <p className="text-sm opacity-80 mb-4">
              {continuation.message ||
                "Click below to return to your WhatsApp chat and instantly verify your account."}
            </p>
            <Button
              onClick={handleContinueWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Continue on WhatsApp
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        ) : (
          <div className="mb-8 space-y-4">
            <p className="opacity-70">
              We've sent your virtual account details via email. Fund your wallet to start creating packages.
            </p>

            {/* Settlement Account CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <CreditCard className="w-10 h-10 mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Set Up Your Settlement Account</h3>
              <p className="text-sm opacity-70 mb-4">
                Add your bank account to receive payouts from bookings. You can do this now or later from your dashboard.
              </p>
              <Button
                onClick={() => navigate("/settlement/setup")}
                className="w-full"
              >
                Set Up Settlement Account
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {!continuation && (
            <Button onClick={() => navigate("/login")} className="w-full">
              Continue to Login
              <ArrowRight className="ml-2" size={18} />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Go to Dashboard
          </Button>

          <p className="text-sm opacity-60 mt-6">
            Need help? Contact support at{" "}
            <a href="mailto:support@ufitgo.com" className="text-primary underline">
              support@ufitgo.com
            </a>
          </p>
          <p className="text-center text-[11px] opacity-40 mt-4">
            Powered by Betaday Logistic Limited.
          </p>
        </div>
      </div>
    </div>
  )
}
