import { useState } from "react"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"

const SERVICE_LEVELS = [
  { label: "Economy", value: "economy" },
  { label: "Standard", value: "standard" },
  { label: "VIP", value: "vip" },
  { label: "Luxury", value: "luxury" },
]

const PACKAGE_TYPES = [
  { label: "Hajj", value: "hajj" },
  { label: "Umrah", value: "umrah" },
  { label: "Jerusalem Pilgrimage", value: "jerusalem" },
  { label: "Romantic Travel", value: "romantic" },
  { label: "Tour", value: "tour" },
  { label: "Others", value: "others" },
]

const INCLUSIONS_LIST = [
  { key: "visa", label: "Visa Processing" },
  { key: "flight", label: "Return Flight Ticket" },
  { key: "meals", label: "Full Board Meals" },
  { key: "ziyarah", label: "Ziyarah Tours" },
  { key: "hotel", label: "Hotel Accommodation" },
  { key: "transfers", label: "Airport Transfers" },
]

export const PackageForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",

    packageType: initialData?.packageType || "umrah",
    serviceLevel: initialData?.serviceLevel || "standard",

    duration: initialData?.duration || "",
    departureDate: initialData?.departureDate || "",
    arrivalDate: initialData?.arrivalDate || "",

    maxPilgrims: initialData?.maxPilgrims || "",
    price: initialData?.price || "",

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleInstallments = () => {
    setFormData((prev) => ({
      ...prev,
      installmentsEnabled: !prev.installmentsEnabled,
    }))
  }

  const handleInstallmentChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      installments: {
        ...prev.installments,
        [name]: value,
      },
    }))
  }

  const toggleInclusion = (key) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: {
        ...prev.inclusions,
        [key]: !prev.inclusions[key],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onSubmit({
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      maxPilgrims: Number(formData.maxPilgrims),
      installments: formData.installmentsEnabled
        ? {
          registrationFee: Number(formData.installments.registrationFee),
          firstDeposit: Number(formData.installments.firstDeposit),
          balance: Number(formData.installments.balance),
        }
        : null,
    })
  }

  return (
    <>
      {/* FORM CONTENT */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-28"
      >
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">
              🟡 Package Details
            </h2>

            <Input
              label="Package Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Package Type & Service Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Package Type
                </label>
                <select
                  value={formData.packageType}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      packageType: e.target.value,
                    }))
                  }
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg"
                >
                  {PACKAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Service Level
                </label>
                <select
                  value={formData.serviceLevel}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      serviceLevel: e.target.value,
                    }))
                  }
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

            {/* Duration & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">


              <Input
                label="Departure Date"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />

              <Input
                label="Arrival Date"
                name="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Duration (Days)"
                placeholder="e.g., 7"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <Input
                label="Maximum Pilgrims"
                name="maxPilgrims"
                type="number"
                value={formData.maxPilgrims}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-fg mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
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
              placeholder={`Day 1: Arrival in Jeddah
Day 2: Umrah rituals
Day 3: Ziyarah...`}
              className="
                w-full rounded-xl bg-bg border border-border
                px-4 py-3 text-sm text-fg
                focus:outline-none focus:ring-2 focus:ring-primary/50
              "
            />
            <p className="text-xs text-fg/60 mt-2">
              Provide a quick summary. Full itinerary can be uploaded later.
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Pricing & Installments */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">
              💰 Pricing & Installments
            </h2>

            <Input
              label="Price per Adult (₦)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-medium text-fg">
                Enable Installments?
              </span>
              <button
                type="button"
                onClick={toggleInstallments}
                className={`w-12 h-6 rounded-full transition ${formData.installmentsEnabled
                  ? "bg-primary"
                  : "bg-border"
                  }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full transform transition ${formData.installmentsEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {formData.installmentsEnabled && (
              <div className="mt-4 space-y-3">
                <Input
                  label="Registration Fee (₦)"
                  name="registrationFee"
                  type="number"
                  value={formData.installments.registrationFee}
                  onChange={handleInstallmentChange}
                />
                <Input
                  label="First Deposit (₦)"
                  name="firstDeposit"
                  type="number"
                  value={formData.installments.firstDeposit}
                  onChange={handleInstallmentChange}
                />
                <Input
                  label="Balance (₦)"
                  name="balance"
                  type="number"
                  value={formData.installments.balance}
                  onChange={handleInstallmentChange}
                />
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
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${formData.inclusions[item.key]
                      ? "bg-primary text-white"
                      : "border-border"
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
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3 z-10">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-border text-fg"
        >
          Cancel
        </button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </>
  )
}
