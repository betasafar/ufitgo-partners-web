// src/screens/Settlement/SettlementSetupScreen.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, CreditCard, Building2 } from "lucide-react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/common/Card"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"
import { useSettlement } from "../../hooks/useSettlement"

const NIGERIAN_BANKS = [
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "033", name: "United Bank for Africa" },
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Diamond Bank" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "084", name: "Enterprise Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "056", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "032", name: "Union Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "100", name: "SunTrust Bank" },
  { code: "302", name: "TajBank" },
  { code: "311", name: "Globus Bank" },
  { code: "501", name: "Fidelity Bank" },
]

export default function SettlementSetupScreen() {
  const navigate = useNavigate()
  const { bankAccount, loading, addBankAccount } = useSettlement()
  const [step, setStep] = useState(bankAccount ? "complete" : "form")
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [resolvedName, setResolvedName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBankName, setSelectedBankName] = useState("")

  if (loading) {
    return (
      <DashboardLayout title="Settlement Setup">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (bankAccount) {
    return (
      <DashboardLayout title="Settlement Setup">
        <div className="space-y-6 p-6">
          <Card>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Settlement Account Active</h2>
              <p className="text-gray-600 mb-6">
                Your settlement account has been configured. All payouts will be sent to this account.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
                <p className="text-sm"><span className="font-medium">Bank:</span> {bankAccount.bankName}</p>
                <p className="text-sm"><span className="font-medium">Account Name:</span> {bankAccount.accountName}</p>
                <p className="text-sm"><span className="font-medium">Account Number:</span> {bankAccount.accountNumber}</p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span className={bankAccount.isVerified ? "text-green-600" : "text-yellow-600"}>
                    {bankAccount.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </p>
              </div>
              <Button onClick={() => navigate("/dashboard")} className="mt-8">
                Go to Dashboard <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const handleBankSelect = (code) => {
    const bank = NIGERIAN_BANKS.find((b) => b.code === code)
    setBankCode(code)
    setSelectedBankName(bank?.name || "")
  }

  const handleSubmit = async () => {
    if (!bankCode || !accountNumber) {
      setError("Please select a bank and enter your account number")
      return
    }
    if (accountNumber.length !== 10) {
      setError("Account number must be 10 digits")
      return
    }

    setError(null)
    setSaving(true)
    try {
      const result = await addBankAccount({ accountNumber, bankCode })
      if (result?.accountName) {
        setResolvedName(result.accountName)
      }
      setStep("complete")
    } catch (err) {
      setError(err.message || "Failed to verify bank account. Please check details and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Settlement Setup">
      <div className="space-y-6 p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <CreditCard className="w-12 h-12 mx-auto text-primary mb-3" />
          <h2 className="text-2xl font-bold">Set Up Settlement Account</h2>
          <p className="text-gray-600 mt-2">
            Add your bank account to receive payouts from bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <Card>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bank <span className="text-red-500">*</span>
              </label>
              <select
                value={bankCode}
                onChange={(e) => handleBankSelect(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                <option value="">Select your bank</option>
                {NIGERIAN_BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Account Number *"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit account number"
              maxLength={10}
            />

            <p className="text-xs text-gray-500">
              Your account name will be automatically verified via Paystack. The name on the account must match your company name.
            </p>

            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Verifying..." : "Verify & Save Account"}
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
