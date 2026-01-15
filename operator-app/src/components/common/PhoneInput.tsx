// PhoneInput.tsx (or src/components/common/PhoneInput.tsx)
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { UseFormSetValue } from "react-hook-form"

type SignupFormData = {
  email?: string
  phone?: string
  companyName?: string
  cacNumber?: string
  password?: string
  confirmPassword?: string
}

interface PhoneInputFieldProps {
  label: string
  name: string
  setValue: UseFormSetValue<SignupFormData>
  error?: string
}

export function PhoneInputField({
  label,
  name,
  setValue,
  error,
}: PhoneInputFieldProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <PhoneInput
        international
        defaultCountry="NG"
        placeholder="Enter phone number"
        className="ufitgo-phone-input input-field"
        onChange={(value) => {
          setValue(name as keyof SignupFormData, value ?? "")
        }}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}