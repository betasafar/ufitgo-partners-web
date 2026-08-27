// SignupScreen.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout"
import { StepPartnerType } from "../../components/onboarding/StepPartnerType"
import { StepCompanyInfo } from "../../components/onboarding/StepCompanyInfo"
import { StepDirectorInfo } from "../../components/onboarding/StepDirectorInfo"
import { StepAuthCredentials } from "../../components/onboarding/StepAuthCredentials"
import { StepDocuments } from "../../components/onboarding/StepDocuments"
import { StepReview } from "../../components/onboarding/StepReview"
import {
  onboardingService,
  initialOnboardingData,
  type OnboardingFormData,
} from "../../api/services/auth.service"

const STEPS = ["Partner Type", "Company Info", "Contact Info", "Account", "Documents", "Review"]

export default function SignupScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isFromWhatsApp, setIsFromWhatsApp] = useState(false)
  const [waPhone, setWaPhone] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState<OnboardingFormData>(initialOnboardingData)

  const updateForm = useCallback((fields: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }, [])

  // Detect WhatsApp origin
  useEffect(() => {
    const source = searchParams.get("source")
    let phoneFromQuery = searchParams.get("wa_phone")

    if (source === "whatsapp" && phoneFromQuery) {
      if (!phoneFromQuery.startsWith("+")) {
        phoneFromQuery = "+" + phoneFromQuery
      }
      setIsFromWhatsApp(true)
      setWaPhone(phoneFromQuery)
      setFormData((prev) => ({ ...prev, phone: phoneFromQuery }))
    }
  }, [searchParams])

  // Prevent Enter key on early steps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && step < STEPS.length - 1) {
        e.preventDefault()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step])

  const safeTrim = (val: string | undefined) => (val ?? "").trim()

  const validateStep = (): { valid: boolean; error?: string } => {
    if (step === 0) {
      if (!formData.partnerType) return { valid: false, error: "Please select a partner type" }
    }

    if (step === 1) {
      if (!safeTrim(formData.companyName)) return { valid: false, error: "Company name is required" }
      if (formData.partnerType !== "tour-guide" && !safeTrim(formData.rcNumber)) {
        return { valid: false, error: "RC / CAC number is required" }
      }
      if (!safeTrim(formData.officeAddress)) return { valid: false, error: "Office address is required" }
      if (formData.partnerType === "tour-operator" && formData.country === "Nigeria" && !safeTrim(formData.nahconLicense)) {
        return { valid: false, error: "NAHCON license number is required for Tour Operators in Nigeria" }
      }
    }

    if (step === 2) {
      if (!safeTrim(formData.directorPhone)) return { valid: false, error: "Phone number is required" }
      if (formData.partnerType !== "tour-guide" && !safeTrim(formData.directorName)) {
        return { valid: false, error: "Director name is required" }
      }
      if (!safeTrim(formData.email)) return { valid: false, error: "Email is required" }
    }

    if (step === 3) {
      const email = safeTrim(formData.email)
      if (!email) return { valid: false, error: "Email is required" }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: "Invalid email address" }

      const phone = safeTrim(formData.phone)
      if (!phone) return { valid: false, error: "Phone number is required" }

      const pw = safeTrim(formData.password)
      if (!pw || pw.length < 8) return { valid: false, error: "Password must be at least 8 characters" }
      if (pw !== safeTrim(formData.confirmPassword)) return { valid: false, error: "Passwords do not match" }
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
    if (step < STEPS.length - 1) setStep((s) => s + 1)
  }

  const prev = () => {
    setFormError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    if (step !== STEPS.length - 1) return
    if (!agreed) {
      setFormError("You must agree to the terms before submitting")
      return
    }

    setFormError(null)
    setLoading(true)
    try {
      await onboardingService.register(formData, {
        source: isFromWhatsApp ? "whatsapp" : "web",
        waPhone: waPhone ?? undefined,
      })
      navigate("/signup-success")
    } catch (err: any) {
      setFormError(err || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={step}
      onBack={step > 0 ? prev : undefined}
      onNext={step < STEPS.length - 1 ? next : handleSubmit}
      nextLabel={step === STEPS.length - 1 ? "Submit Application" : undefined}
      nextDisabled={step === STEPS.length - 1 ? !agreed : false}
      loading={loading}
      isSubmit={step === STEPS.length - 1}
    >
      {formError && (
        <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
          {formError}
        </p>
      )}

      {step === 0 && (
        <StepPartnerType
          selected={formData.partnerType}
          onSelect={(type) => updateForm({ partnerType: type })}
        />
      )}

      {step === 1 && (
        <StepCompanyInfo data={formData} update={updateForm} />
      )}

      {step === 2 && (
        <StepDirectorInfo data={formData} update={updateForm} />
      )}

      {step === 3 && (
        <StepAuthCredentials
          data={formData}
          update={updateForm}
          isFromWhatsApp={isFromWhatsApp}
          waPhone={waPhone}
        />
      )}

      {step === 4 && (
        <StepDocuments data={formData} />
      )}

      {step === 5 && (
        <StepReview data={formData} agreed={agreed} onAgreedChange={setAgreed} />
      )}
    </OnboardingLayout>
  )
}
