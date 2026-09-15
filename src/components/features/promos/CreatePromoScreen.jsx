"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePromos } from "../../../hooks/usePromos"
import { usePackages } from "../../../hooks/usePackages"
import { useAuth } from "../../../context/AuthContext"
import { DashboardLayout } from "../../layout/DashboardLayout"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"
import { ArrowLeft } from "lucide-react"

export const CreatePromoScreen = () => {
  const navigate = useNavigate()
  const { createPromo } = usePromos()
  const { packages } = usePackages()
  const { user } = useAuth()
  const isFX = user?.partnerType === 'exchange-agent'

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage", // or fixed
    value: "",
    packageId: "", // empty means global
    validFrom: "",
    validUntil: "",
    maxUses: "",
    minPilgrimsRequired: "",
    isFirstTimeUserOnly: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        packageId: formData.packageId ? Number(formData.packageId) : null,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        minPilgrimsRequired: formData.minPilgrimsRequired ? Number(formData.minPilgrimsRequired) : null,
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
      }

      await createPromo(payload)
      navigate("/promos")
    } catch (err) {
      setError(err.message || "Failed to create promo code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Create Promo Code">
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/promos")}
          className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-fg hover:bg-border/50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-fg">Create Promo Code</h1>
          <p className="text-fg/60">Define discount rules and limits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-fg">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Promo Code *"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g RAMADAN2026"
              required
              className="uppercase"
            />
            
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Discount Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={formData.type === "percentage" ? "Discount Percentage * (%)" : "Discount Amount * (₦)"}
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              placeholder={formData.type === "percentage" ? "e.g 10" : "e.g 50000"}
              required
            />

            {!isFX && (
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Apply To</label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
                >
                  <option value="">All Packages (Global Promo)</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-fg">Validity & Limits (Optional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valid From"
              name="validFrom"
              type="date"
              value={formData.validFrom}
              onChange={handleChange}
            />
            <Input
              label="Valid Until"
              name="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Max Usage Count"
              name="maxUses"
              type="number"
              value={formData.maxUses}
              onChange={handleChange}
              placeholder="e.g 100 uses total"
            />
            {!isFX && (
              <Input
                label="Min Pilgrims Required"
                name="minPilgrimsRequired"
                type="number"
                value={formData.minPilgrimsRequired}
                onChange={handleChange}
                placeholder="e.g 2"
              />
            )}
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-bg rounded-xl border border-border mt-4">
            <input
              type="checkbox"
              id="isFirstTimeUserOnly"
              name="isFirstTimeUserOnly"
              checked={formData.isFirstTimeUserOnly}
              onChange={handleChange}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="isFirstTimeUserOnly" className="text-sm font-medium text-fg cursor-pointer select-none">
              Only valid for first-time users
            </label>
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">{error}</div>}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/promos")}
            className="px-6 py-3 rounded-xl border border-border text-fg hover:bg-border/50 font-medium transition"
          >
            Cancel
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Promo Code"}
          </Button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  )
}
