// src/components/common/PhoneInput.tsx
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
  disabled?: boolean              // ← New: support disabling the field
  value?: string                  // ← New: support prefill from query param
}

export function PhoneInputField({
  label,
  name,
  setValue,
  error,
  disabled = false,
  value: initialValue,
}: PhoneInputFieldProps) {
  // Use controlled value if provided (prefill), otherwise let react-phone-number-input manage it
  const controlledValue = initialValue ?? undefined

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
        // Controlled value (prefilled from WhatsApp query param)
        value={controlledValue}
        // Disable editing when coming from WhatsApp
        disabled={disabled}
        // Only update form value when user manually changes it (not on prefill)
        onChange={(newValue) => {
          // Only set if not disabled (prevents overriding prefill)
          if (!disabled) {
            setValue(name as keyof SignupFormData, newValue ?? "", {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        }}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Visual hint when disabled/prefilled */}
      {disabled && initialValue && (
        <p className="mt-1 text-xs text-gray-500 italic">
          Phone number pre-filled from WhatsApp
        </p>
      )}
    </div>
  )
}