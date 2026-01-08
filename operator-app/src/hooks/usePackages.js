"use client"

import { useState, useEffect } from "react"
import { packagesService } from "../api/services/packages.service.js"

export const usePackages = () => {
  console.log("[v0] usePackages hook initializing...")
  console.log("[v0] packagesService:", packagesService)

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPackages = async () => {
    try {
      console.log("[v0] Starting fetchPackages...")
      setLoading(true)
      setError(null)

      console.log("[v0] Calling packagesService.getAll()...")
      const data = await packagesService.getAll()
      console.log("[v0] Packages fetched successfully:", data)

      setPackages(data)
    } catch (err) {
      console.error("[v0] Error in fetchPackages:", err)
      setError(err.message || "Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  const createPackage = async (packageData) => {
    try {
      console.log("[v0] Creating package:", packageData)
      const newPackage = await packagesService.create(packageData)
      setPackages((prev) => [...prev, newPackage])
      return newPackage
    } catch (err) {
      console.error("[v0] Error creating package:", err)
      throw err
    }
  }

  const updatePackage = async (id, packageData) => {
    try {
      console.log("[v0] Updating package:", id, packageData)
      const updated = await packagesService.update(id, packageData)
      setPackages((prev) => prev.map((pkg) => (pkg.id === id ? updated : pkg)))
      return updated
    } catch (err) {
      console.error("[v0] Error updating package:", err)
      throw err
    }
  }

  const deletePackage = async (id) => {
    try {
      console.log("[v0] Deleting package:", id)
      await packagesService.delete(id)
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting package:", err)
      throw err
    }
  }

  useEffect(() => {
    console.log("[v0] usePackages useEffect running...")
    fetchPackages()
  }, [])

  return {
    packages,
    loading,
    error,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
  }
}
