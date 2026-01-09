"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"

/* ---------- CONSTANTS ---------- */

export const PACKAGE_TYPES = [
  { label: "Hajj", value: "hajj" },
  { label: "Umrah", value: "umrah" },
  { label: "Tour", value: "tour" },
  { label: "Leisure Travel", value: "leisure" },
  { label: "Adventure Travel", value: "adventure" },
  { label: "Cultural Tour", value: "cultural" },
  { label: "Eco Tourism", value: "eco_tourism" },
  { label: "Wildlife Safari", value: "wildlife" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Others", value: "others" },
]

const SERVICE_LEVELS = [
  { label: "Standard", value: "standard" },
  { label: "Family", value: "family" },
  { label: "VIP", value: "vip" },
  { label: "Economy", value: "economy" },
  { label: "Budget", value: "budget" },
  { label: "Premium", value: "premium" },
  { label: "Luxury", value: "luxury" },
]

const INCLUSIONS_LIST = [
  { key: "visa", label: "Visa Processing" },
  { key: "flight", label: "Return Flight Ticket" },
  { key: "meals", label: "Full Board Meals" },
  { key: "ziyarah", label: "Ziyarah Tours" },
  { key: "hotel", label: "Hotel Accommodation" },
  { key: "transfers", label: "Airport Transfers" },
]

/* ---------- HUMANIZE HELPER ---------- */
const humanize = (str) => {
  if (!str) return ""
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/* ---------- MAIN COMPONENT ---------- */
export const PackageForm = ({ initialData, onSubmit, onCancel }) => {
  const [dateError, setDateError] = useState("")

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    itinerary: initialData?.itinerary || "",

    packageType: initialData?.packageType || "umrah",
    serviceLevel: initialData?.serviceLevel || "standard",

    isGroupPackage: initialData?.isGroupPackage ?? true,

    prices: {
      adult: initialData?.prices?.adult || "",
      child: initialData?.prices?.child || "",
      individual: initialData?.prices?.individual || "",
    },

    departureDate: initialData?.departureDate || "",
    returnDate: initialData?.returnDate || "",
    duration: initialData?.duration || "",

    maxPilgrims: initialData?.maxPilgrims || "",

    installmentsEnabled: initialData?.installmentsEnabled || false,
    installments: {
      registrationFee: initialData?.installments?.registrationFee || "",
      firstDeposit: initialData?.installments?.firstDeposit || "",
      balance: initialData?.installments?.balance || "",
    },

    inclusions: {
      visa: initialData?.inclusions?.visa ?? true,
      flight: initialData?.inclusions?.flight ?? true,
      meals: initialData?.inclusions?.meals ?? true,
      ziyarah: initialData?.inclusions?.ziyarah ?? false,
      hotel: initialData?.inclusions?.hotel ?? true,
      transfers: initialData?.inclusions?.transfers ?? false,
    },
  })

  /* ---------- AUTO-CALCULATE DURATION ---------- */
  useEffect(() => {
    const { departureDate, returnDate } = formData

    if (!departureDate || !returnDate) {
      setFormData((p) => ({ ...p, duration: "" }))
      setDateError("")
      return
    }

    const start = new Date(departureDate)
    const end = new Date(returnDate)

    if (end < start) {
      setDateError("Return date cannot be earlier than departure date")
      setFormData((p) => ({ ...p, duration: "" }))
      return
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    setDateError("")
    setFormData((p) => ({ ...p, duration: diffDays }))
  }, [formData.departureDate, formData.returnDate])

  /* ---------- TOTAL PRICE CALCULATION ---------- */
  const totalPrice = useMemo(() => {
    return formData.isGroupPackage
      ? Number(formData.prices.adult || 0)
      : Number(formData.prices.individual || 0)
  }, [formData.isGroupPackage, formData.prices])

  /* ---------- INSTALLMENT VALIDATION ---------- */
  const installmentTotal =
    Number(formData.installments.registrationFee || 0) +
    Number(formData.installments.firstDeposit || 0) +
    Number(formData.installments.balance || 0)

  const installmentValid =
    !formData.installmentsEnabled || installmentTotal === totalPrice

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [field]: value },
    }))
  }

  const handleInstallmentChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      installments: { ...prev.installments, [name]: value },
    }))
  }

  const toggleInclusion = (key) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: { ...prev.inclusions, [key]: !prev.inclusions[key] },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!installmentValid) return

    await onSubmit({
      ...formData,
      price: totalPrice,
      duration: Number(formData.duration),
      maxPilgrims: Number(formData.maxPilgrims) || null,
      installments: formData.installmentsEnabled
        ? {
          registrationFee: Number(formData.installments.registrationFee),
          firstDeposit: Number(formData.installments.firstDeposit),
          balance: Number(formData.installments.balance),
        }
        : null,
    })
  }

  /* ---------- RENDER ---------- */
  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-32">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* Package Details */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">🟡 Package Details</h2>

            <Input
              label="Package Name *"
              placeholder="e.g Trip to Mecca"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* PACKAGE TYPE */}
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Package Type</label>
                <select
                  value={formData.packageType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, packageType: e.target.value }))}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
                >
                  {PACKAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* SERVICE LEVEL */}
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Service Level</label>
                <select
                  value={formData.serviceLevel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceLevel: e.target.value }))}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
                >
                  {SERVICE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Departure Date *"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Return Date *"
                name="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>

            {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Duration (Days)"
                value={formData.duration}
                readOnly
                className="bg-bg/40 cursor-not-allowed"
              />
              <Input
                label="Maximum Pilgrims"
                name="maxPilgrims"
                type="number"
                value={formData.maxPilgrims}
                onChange={handleChange}
                placeholder="e.g 50"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-fg mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a brief overview of the package..."
                rows={4}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
              />
            </div>
          </section>

          {/* Itinerary */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
              🧭 Itinerary Highlights
            </h2>
            <textarea
              name="itinerary"
              value={formData.itinerary}
              onChange={handleChange}
              rows={6}
              placeholder={`Day 1: Arrival in Jeddah\nDay 2: Umrah rituals\nDay 3: Ziyarah...`}
              className="w-full rounded-xl bg-bg border border-border px-4 py-3 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-fg/60 mt-2">
              Provide a quick summary. Full itinerary can be uploaded later.
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Pricing */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">💰 Pricing</h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-fg">Group Package?</span>
              <input
                type="checkbox"
                checked={formData.isGroupPackage}
                onChange={() => setFormData((p) => ({ ...p, isGroupPackage: !p.isGroupPackage }))}
                className="w-5 h-5"
              />
            </div>

            {formData.isGroupPackage ? (
              <>
                <Input
                  label="Price per Adult (₦)"
                  type="number"
                  value={formData.prices.adult}
                  onChange={(e) => handlePriceChange("adult", e.target.value)}
                  placeholder="e.g 1,000,000"
                  required
                />
                <Input
                  label="Price per Child (₦)"
                  type="number"
                  value={formData.prices.child}
                  onChange={(e) => handlePriceChange("child", e.target.value)}
                  placeholder="e.g 950,000"
                />
              </>
            ) : (
              <Input
                label="Price per Person (₦)"
                type="number"
                placeholder="e.g 1,200,000"
                value={formData.prices.individual}
                onChange={(e) => handlePriceChange("individual", e.target.value)}
                required
              />
            )}
          </section>

          {/* Installments */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">💳 Installments</h2>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-fg">Enable Installments?</span>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    installmentsEnabled: !p.installmentsEnabled,
                  }))
                }
                className={`w-12 h-6 rounded-full transition ${formData.installmentsEnabled ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full transform transition ${formData.installmentsEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {formData.installmentsEnabled && (
              <div className="mt-4 space-y-3">
                <Input
                  label="Registration Fee (₦)"
                  name="registrationFee"
                  placeholder="e.g 100000"
                  type="number"
                  value={formData.installments.registrationFee}
                  onChange={handleInstallmentChange}
                />
                <Input
                  label="First Deposit (₦)"
                  name="firstDeposit"
                  placeholder="e.g 300000"
                  type="number"
                  value={formData.installments.firstDeposit}
                  onChange={handleInstallmentChange}
                />
                <Input
                  label="Balance (₦)"
                  name="balance"
                  type="number"
                  placeholder="e.g 600000"
                  value={formData.installments.balance}
                  onChange={handleInstallmentChange}
                />
                {!installmentValid && totalPrice > 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Total installments must equal ₦{totalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Inclusions */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">✅ Inclusions</h2>
            <div className="space-y-3">
              {INCLUSIONS_LIST.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => toggleInclusion(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${formData.inclusions[item.key]
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-fg/70"
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${formData.inclusions[item.key] ? "bg-primary text-white" : "border-border"
                      }`}
                  >
                    {formData.inclusions[item.key] && "✓"}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </form>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] md:ml-64 bg-card border-t border-border px-6 py-4 flex justify-between items-center z-20">
        <span className="font-semibold text-lg">
          Total: ₦{totalPrice.toLocaleString()}
        </span>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-border text-fg hover:bg-border/50"
          >
            Cancel
          </button>
          <Button disabled={!installmentValid || !totalPrice} onClick={handleSubmit}>
            {initialData ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </div>
    </>
  )
}