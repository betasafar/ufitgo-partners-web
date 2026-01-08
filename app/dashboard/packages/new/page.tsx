"use client"

import { useEffect, useState } from "react"
import { PackageForm } from "@/components/package-form"
import { api } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/api-endpoints"

export default function CreatePackagePage() {
  const [tierData, setTierData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTierData() {
      try {
        const data = await api.get(ENDPOINTS.TIER.INFO)
        setTierData(data)
      } catch (error) {
        console.error("Failed to load tier data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTierData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!tierData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg text-red-600">Failed to load operator data.</p>
        <p className="text-muted-foreground">Please refresh the page or log in again.</p>
      </div>
    )
  }

  const maxPilgrims = tierData.tierInfo?.maxPilgrimsPerPackage || 50
  const canSetFlexibleDates = tierData.tier !== "BRONZE"
  const canSetCustomPricing = tierData.tier === "GOLD"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Package</h1>
        <p className="text-muted-foreground">Set up a new travel package for pilgrims</p>
      </div>

      <PackageForm
        maxPilgrims={maxPilgrims}
        canSetFlexibleDates={canSetFlexibleDates}
        canSetCustomPricing={canSetCustomPricing}
      />
    </div>
  )
}
