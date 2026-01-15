// src/pages/SignupSuccess.tsx
"use client"

import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "../../components/common/Button"
import { useNavigate } from "react-router-dom"

export default function SignupSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Account Created!</h1>
          <p className="text-lg opacity-80">
            Your operator account has been successfully created.
          </p>
          <p className="mt-4 opacity-70">
            We've sent your virtual account details via WhatsApp and email.
            <br />
            Fund your wallet to start creating packages.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => navigate("/login")} className="w-full">
            Continue to Login
            <ArrowRight className="ml-2" size={18} />
          </Button>

          <p className="text-sm opacity-60">
            Need help? Contact support at{" "}
            <a href="mailto:support@ufitgo.com" className="text-primary underline">
              support@ufitgo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}