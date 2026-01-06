"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    // Step 1
    agencyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2
    cacNumber: "",
    services: "all",
    country: "nigeria",
    agreeTerms: false,
  })

  const progress = (step / 2) * 100

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.agencyName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          cacNumber: formData.cacNumber,
          services: formData.services,
          country: formData.country,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-between mb-6">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <span className="text-sm font-medium">Step {step} of 2</span>
        </div>

        <div className="mb-6">
          <div className="mb-2 text-xs uppercase text-muted-foreground font-semibold">Registration Progress</div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-4xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">Let's get started with your basic information</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Tell us about your Business</h1>
            <p className="text-muted-foreground">
              We need a few legal details to verify your travel agency and activate your account.
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                type="text"
                placeholder="e.g., Al-Barakah Tours & Travels"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Official Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="operations@yourcompany.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 803 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters with letters and numbers</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cacNumber">CAC Registration Number</Label>
              <div className="relative">
                <Input
                  id="cacNumber"
                  type="text"
                  placeholder="e.g., RC-123456"
                  value={formData.cacNumber}
                  onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
                  required
                />
                {formData.cacNumber && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your Corporate Affairs Commission number for verification.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Which travel services do you offer?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.services === "religious" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFormData({ ...formData, services: "religious" })}
                >
                  Religious Pilgrimages
                </Button>
                <Button
                  type="button"
                  variant={formData.services === "leisure" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFormData({ ...formData, services: "leisure" })}
                >
                  Leisure Travel
                </Button>
                <Button
                  type="button"
                  variant={formData.services === "all" ? "default" : "outline"}
                  className="w-full col-span-2"
                  onClick={() => setFormData({ ...formData, services: "all" })}
                >
                  All Travel Services
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country of Operation</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="south-africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I confirm that the information provided is accurate and I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Platform Terms & Conditions
                </Link>
                .
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Step 1
            </Button>
          )}

          {step < 2 ? (
            <Button type="button" onClick={handleNext} className="flex-1">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading || !formData.agreeTerms} className="flex-1">
              {loading ? "Creating Account..." : "Complete Registration"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {step === 2 && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🔒</span>
            <span>Your data is encrypted and secure.</span>
          </div>
        )}
      </form>

      {step === 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      )}
    </div>
  )
}
