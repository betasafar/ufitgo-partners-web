

import { useState } from "react"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"

export const BankDetailsForm = ({ bankDetails, onSubmit }) => {
  const [formData, setFormData] = useState({
    bankName: bankDetails?.bankName || "",
    accountName: bankDetails?.accountName || "",
    accountNumber: bankDetails?.accountNumber || "",
  })

  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await onSubmit(formData)
      alert("Bank details saved successfully!")
    } catch (err) {
      alert("Failed to save bank details: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Bank Name"
        value={formData.bankName}
        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
        placeholder="e.g. First Bank"
        required
      />

      <Input
        label="Account Name"
        value={formData.accountName}
        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
        placeholder="Account holder name"
        required
      />

      <Input
        label="Account Number"
        value={formData.accountNumber}
        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        placeholder="10-digit account number"
        required
        maxLength={10}
      />

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Bank Details"}
      </Button>
    </form>
  )
}
