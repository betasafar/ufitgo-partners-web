// src/components/onboarding/StepAuthCredentials.tsx
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../common/Input"
import { PhoneInputField } from "../common/PhoneInput"
import { PasswordStrengthMeter } from "../common/PasswordStrengthMeter"
import { OnboardingFormData } from "../../api/services/auth.service"

interface StepAuthCredentialsProps {
  data: OnboardingFormData
  update: (fields: Partial<OnboardingFormData>) => void
  isFromWhatsApp: boolean
  waPhone: string | null
}

export function StepAuthCredentials({
  data,
  update,
  isFromWhatsApp,
  waPhone,
}: StepAuthCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Account Credentials</h2>
        <p className="text-sm opacity-70 mt-1">
          Set up your login email, phone, and password
        </p>
      </div>

      <Input
        label="Email Address *"
        type="email"
        value={data.email}
        onChange={(e) => update({ email: e.target.value })}
        placeholder="operator@company.com"
      />

      <PhoneInputField
        label="Phone Number *"
        name="phone"
        value={isFromWhatsApp && waPhone ? waPhone : data.phone}
        onChange={(val) => update({ phone: val })}
        disabled={isFromWhatsApp}
      />

      <div className="relative">
        <Input
          label="Password *"
          type={showPassword ? "text" : "password"}
          value={data.password}
          onChange={(e) => update({ password: e.target.value })}
          placeholder="Min. 8 characters"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-fg/60 hover:text-fg"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {data.password && <PasswordStrengthMeter password={data.password} />}

      <Input
        label="Confirm Password *"
        type="password"
        value={data.confirmPassword}
        onChange={(e) => update({ confirmPassword: e.target.value })}
        placeholder="Re-enter password"
      />
    </div>
  )
}
