"use client"

import { useState, useEffect } from "react"
import { packagesService } from "../api/services/packages.service"

export const usePackages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await packagesService.getAll()
      setPackages(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPackage = async (packageData) => {
    try {
      const newPackage = await packagesService.create(packageData)
      setPackages((prev) => [...prev, newPackage])
      return newPackage
    } catch (err) {
      throw err
    }
  }

  const updatePackage = async (id, packageData) => {
    try {
      const updated = await packagesService.update(id, packageData)
      setPackages((prev) => prev.map((pkg) => (pkg.id === id ? updated : pkg)))
      return updated
    } catch (err) {
      throw err
    }
  }

  const deletePackage = async (id) => {
    try {
      await packagesService.delete(id)
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
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
