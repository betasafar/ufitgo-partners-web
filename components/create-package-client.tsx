"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SoftLimitMessage } from "@/components/soft-limit-message"
import { ArrowLeft, Save, Upload, Plus, X, Info, Loader2 } from "lucide-react"

// Import centralized endpoints
import { ENDPOINTS } from "@/lib/api-endpoints"

// Use your secure client-side API requester (assumes it handles auth token)
import { apiClientRequest } from "@/lib/api-client-secure"

import type { OperatorWithTier } from "@/lib/types"

interface Props {
  operator: OperatorWithTier
  canCreateInitially: boolean
}

type PackageFormData = {
  title: string
  description: string
  price: string
  capacity: string
  departureDate: string
  returnDate: string
  durationDays: string
  packageType: "hajj" | "umrah" | ""
  includes: string[]
  images: File[]
}

const INCLUDE_OPTIONS = [
  "Flights (Return)",
  "Visa Processing",
  "Accommodation (Makkah & Madinah)",
  "Air-conditioned Transportation",
  "Daily Meals",
  "Ziyarat Tours",
  "Religious Guidance",
  "24/7 Support",
]

export default function CreatePackageClient({ operator, canCreateInitially }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    description: "",
    price: "",
    capacity: "",
    departureDate: "",
    returnDate: "",
    durationDays: "",
    packageType: "",
    includes: [],
    images: [],
  })

  const { tierInfo, activePackagesCount = 0, verificationStatus } = operator
  const canCreatePackage = canCreateInitially
  const isVerified = verificationStatus === "approved"

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 10) {
      alert("Maximum 10 images allowed")
      return
    }

    const newFiles = [...formData.images, ...files]
    setFormData((prev) => ({ ...prev, images: newFiles }))

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canCreatePackage) {
      setSubmitError("You have reached your active package limit.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log("[CreatePackage] Starting package creation...")
      console.log("[CreatePackage] Form data:", {
        title: formData.title,
        price: formData.price,
        capacity: formData.capacity,
        packageType: formData.packageType,
        imagesCount: formData.images.length,
        includes: formData.includes,
      })

      const form = new FormData()

      // Required fields
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("price", formData.price)
      form.append("capacity", formData.capacity)
      form.append("packageType", formData.packageType)

      // Optional fields
      if (formData.departureDate) form.append("departureDate", formData.departureDate)
      if (formData.returnDate) form.append("returnDate", formData.returnDate)
      if (formData.durationDays) form.append("durationDays", formData.durationDays)

      // Includes as array
      formData.includes.forEach((item) => {
        form.append("includes[]", item)
      })

      // Images
      formData.images.forEach((image, index) => {
        console.log(`[CreatePackage] Appending image ${index + 1}:`, image.name, image.size)
        form.append("images", image)
      })

      console.log("[CreatePackage] Calling API:", ENDPOINTS.PACKAGES.CREATE)
      console.log("[CreatePackage] Request method: POST")
      console.log("[CreatePackage] Total FormData entries:", form.entries.length)

      const response = await apiClientRequest(ENDPOINTS.PACKAGES.CREATE, {
        method: "POST",
        body: form,
        // Important: Do NOT set Content-Type header when using FormData — browser sets it automatically with boundary
      })

      console.log("[CreatePackage] SUCCESS! API Response:", response)

      // Success feedback
      alert("Package created successfully!")
      router.push("/dashboard/packages")
      router.refresh() // Ensures server components reload fresh data

    } catch (error: any) {
      console.error("[CreatePackage] API CALL FAILED:", error)

      const message =
        error.message ||
        error.data?.message ||
        "Failed to create package. Please check your connection and try again."

      setSubmitError(message)
      console.log("[CreatePackage] Error message shown to user:", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Package</h1>
          <p className="text-muted-foreground">Design and publish your Hajj or Umrah package</p>
        </div>
      </div>

      <SoftLimitMessage
        current={activePackagesCount}
        limit={tierInfo.maxActivePackages}
        feature="active packages"
        upgradeAction={isVerified ? "Contact support for upgrade" : "Complete verification"}
        upgradeLink={isVerified ? "/dashboard/support" : "/dashboard/verification"}
      />

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error:</p>
          <p>{submitError}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Required details for your package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Package Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Premium Hajj 2026 - 5 Star"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Package Type *</Label>
                  <Select
                    value={formData.packageType}
                    onValueChange={(v) => setFormData((p) => ({ ...p, packageType: v as any }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hajj">Hajj</SelectItem>
                      <SelectItem value="umrah">Umrah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Person (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="5000000"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description including itinerary, hotels, services..."
                  className="min-h-32"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates & Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Departure Date *</Label>
                  <Input
                    id="departure"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData((p) => ({ ...p, departureDate: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return">Return Date</Label>
                  <Input
                    id="return"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData((p) => ({ ...p, returnDate: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="14"
                    value={formData.durationDays}
                    onChange={(e) => setFormData((p) => ({ ...p, durationDays: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Max Pilgrims *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max={tierInfo.maxPilgrimsPerPackage || 100}
                    placeholder={`Max: ${tierInfo.maxPilgrimsPerPackage}`}
                    value={formData.capacity}
                    onChange={(e) => setFormData((p) => ({ ...p, capacity: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Included Services</CardTitle>
              <CardDescription>Select what&apos;s included</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {INCLUDE_OPTIONS.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={formData.includes.includes(item)}
                      onCheckedChange={(checked) => {
                        setFormData((p) => ({
                          ...p,
                          includes: checked
                            ? [...p.includes, item]
                            : p.includes.filter((i) => i !== item),
                        }))
                      }}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={item}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Images</CardTitle>
              <CardDescription>Add up to 10 high-quality photos (first = cover)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 10 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-2">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200x800px. First image becomes cover photo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canCreatePackage || isSubmitting} className="gap-2 min-w-48">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Package...
            </>
          ) : canCreatePackage ? (
            <>
              <Save className="h-4 w-4" />
              Create & Publish Package
            </>
          ) : (
            "Package Limit Reached"
          )}
        </Button>
      </div>
    </form>
  )
}
