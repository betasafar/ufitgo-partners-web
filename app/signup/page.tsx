import { SignupForm } from "@/components/signup-form"
import Link from "next/link"

export const metadata = {
  title: "Register - TravelOps",
  description: "Create your operator account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2c4f52] to-[#1a2f31] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">✈️</span>
            </div>
            <span className="text-2xl font-bold text-white">TravelOps</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white leading-relaxed">Join the Leading Travel Management Platform</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary">✓</span>
              </div>
              <div className="text-white/90">
                <div className="font-semibold">Licensed & Accredited</div>
                <div className="text-sm text-white/70">Complete compliance and regulatory integration</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary">✓</span>
              </div>
              <div className="text-white/90">
                <div className="font-semibold">End-to-End Management</div>
                <div className="text-sm text-white/70">From booking to departure, all in one platform</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary">✓</span>
              </div>
              <div className="text-white/90">
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-white/70">Dedicated assistance for your travel operations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">Trusted by 500+ travel operators worldwide</div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignupForm />
      </div>
    </div>
  )
}
