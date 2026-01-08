import { useState } from "react"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"

export const PackageForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    duration: initialData?.duration || "",
    maxPilgrims: initialData?.maxPilgrims || "",
    inclusions: initialData?.inclusions || "",
    itinerary: initialData?.itinerary || "",
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxPilgrims: Number(formData.maxPilgrims),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg">
            {initialData ? "Edit Package" : "Create Package"}
          </h1>
          <p className="text-sm text-fg/70 mt-1">
            Fields marked with <span className="text-primary">*</span> are mandatory
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border text-fg hover:bg-bg/60"
          >
            Cancel
          </button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* Package Details */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
              🟡 Package Details
            </h2>

            <Input
              label="Package Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Premium Hajj 2024 – 14 Days"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Duration (days) *"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <Input
                label="Maximum Pilgrims *"
                name="maxPilgrims"
                type="number"
                min="1"
                value={formData.maxPilgrims}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-fg mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the package benefits and spiritual value..."
                className="
                  w-full rounded-xl bg-bg border border-border
                  px-4 py-3 text-sm text-fg
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                "
                required
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
          {/* Pricing */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
              💰 Pricing & Seats
            </h2>

            <Input
              label="Price per Adult (₦) *"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </section>

          {/* Inclusions */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
              ✅ Inclusions
            </h2>

            <textarea
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              rows={6}
              placeholder="Visa processing, accommodation, meals, transport..."
              className="
                w-full rounded-xl bg-bg border border-border
                px-4 py-3 text-sm text-fg
                focus:outline-none focus:ring-2 focus:ring-primary/50
              "
            />
          </section>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-border text-fg hover:bg-bg/60"
        >
          Cancel
        </button>
        <Button type="submit" disabled={submitting}>
          {initialData ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </form>
  )
}
