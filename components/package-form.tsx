"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/api-endpoints"

interface PackageFormProps {
  maxPilgrims?: number
  canSetFlexibleDates?: boolean
  canSetCustomPricing?: boolean
}

export function PackageForm({
  maxPilgrims = 50,
  canSetFlexibleDates = false,
  canSetCustomPricing = false,
}: PackageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    maxPilgrims: "",
    departureDate: "",
    returnDate: "",
    inclusions: "",
    exclusions: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await api.post(ENDPOINTS.PACKAGES.CREATE, {
        ...formData,
        price: Number.parseFloat(formData.price),
        duration: Number.parseInt(formData.duration),
        maxPilgrims: Number.parseInt(formData.maxPilgrims),
        inclusions: formData.inclusions.split("\n").filter(Boolean),
        exclusions: formData.exclusions.split("\n").filter(Boolean),
      })

      router.push("/dashboard/packages")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create package")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the main details of your package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., 14-Day Hajj Package 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what makes this package special..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 2500000"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (days) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 14"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates & Capacity</CardTitle>
          <CardDescription>Set your travel dates and group size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureDate">Departure Date *</Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                disabled={!canSetFlexibleDates}
                required
              />
            </div>

            <div>
              <Label htmlFor="returnDate">Return Date *</Label>
              <Input
                id="returnDate"
                name="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleChange}
                disabled={!canSetFlexibleDates}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxPilgrims">Maximum Pilgrims (up to {maxPilgrims}) *</Label>
            <Input
              id="maxPilgrims"
              name="maxPilgrims"
              type="number"
              value={formData.maxPilgrims}
              onChange={handleChange}
              max={maxPilgrims}
              placeholder={`e.g., ${maxPilgrims}`}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">Complete verification to increase your limit</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
          <CardDescription>What's included and excluded</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inclusions">Inclusions (one per line) *</Label>
            <Textarea
              id="inclusions"
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="Round-trip flights&#10;4-star accommodation&#10;Daily meals&#10;Transportation in Saudi Arabia"
              rows={5}
              required
            />
          </div>

          <div>
            <Label htmlFor="exclusions">Exclusions (one per line)</Label>
            <Textarea
              id="exclusions"
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              placeholder="Travel insurance&#10;Personal expenses&#10;Extra meals"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Package"}
        </Button>
      </div>
    </form>
  )
}
