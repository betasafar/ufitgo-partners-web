

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
        price: Number.parseFloat(formData.price),
        duration: Number.parseInt(formData.duration),
        maxPilgrims: Number.parseInt(formData.maxPilgrims),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl">
      <Input label="Package Name" name="name" value={formData.name} onChange={handleChange} required />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="input-field"
        />
      </div>

      <Input
        label="Price (₦)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        min="0"
      />

      <Input
        label="Duration (days)"
        name="duration"
        type="number"
        value={formData.duration}
        onChange={handleChange}
        required
        min="1"
      />

      <Input
        label="Maximum Pilgrims"
        name="maxPilgrims"
        type="number"
        value={formData.maxPilgrims}
        onChange={handleChange}
        required
        min="1"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
        <textarea
          name="inclusions"
          value={formData.inclusions}
          onChange={handleChange}
          placeholder="List what's included in this package..."
          rows="4"
          className="input-field"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving..." : initialData ? "Update Package" : "Create Package"}
        </Button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}
