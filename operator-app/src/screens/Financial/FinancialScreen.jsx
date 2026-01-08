

import { useState } from "react"
import { useFinancial } from "../../hooks/useFinancial"
import { Button } from "../../components/common/Button"
import { Card } from "../../components/common/Card"
import { Input } from "../../components/common/Input"
import { TransactionCard } from "../../components/features/financial/TransactionCard"
import { BankDetailsForm } from "../../components/features/financial/BankDetailsForm"
import { DashboardLayout } from "../../components/layout/DashboardLayout"

const FinancialScreen = () => {
  const { summary, transactions, bankDetails, loading, error, requestPayout, updateBankDetails, refetch } =
    useFinancial()

  const [showPayoutForm, setShowPayoutForm] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")
  const [requesting, setRequesting] = useState(false)

  const [showBankForm, setShowBankForm] = useState(false)

  const handleRequestPayout = async () => {
    if (!payoutAmount || Number.parseFloat(payoutAmount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    try {
      setRequesting(true)
      await requestPayout(Number.parseFloat(payoutAmount))
      alert("Payout request submitted successfully!")
      setShowPayoutForm(false)
      setPayoutAmount("")
    } catch (err) {
      alert("Failed to request payout: " + err.message)
    } finally {
      setRequesting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Financial Dashboard">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Financial Dashboard">
        <div className="p-6">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <DashboardLayout title="Financial Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1> */}
            <p className="text-gray-600 mt-2">Manage your earnings and payouts</p>
          </div>
          <Button onClick={() => setShowPayoutForm(true)}>Request Payout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(summary?.totalEarnings || 0)}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Available Balance</h3>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary?.availableBalance || 0)}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Payouts</h3>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(summary?.pendingPayouts || 0)}</p>
          </Card>
        </div>

        {summary?.escrowHeld > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h3 className="font-semibold text-blue-900">Escrow Protection Active</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {formatCurrency(summary.escrowHeld)} is held in escrow for pilgrim protection. Complete verification to
                  receive payments immediately.
                </p>
              </div>
            </div>
          </Card>
        )}

        {showPayoutForm && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Request Payout</h2>
            <div className="space-y-4">
              <Input
                label="Amount (NGN)"
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <p className="text-sm text-gray-600">Available balance: {formatCurrency(summary?.availableBalance || 0)}</p>
              <div className="flex gap-3">
                <Button onClick={handleRequestPayout} disabled={requesting}>
                  {requesting ? "Requesting..." : "Submit Request"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPayoutForm(false)
                    setPayoutAmount("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bank Details</h2>
            <Button variant="secondary" onClick={() => setShowBankForm(!showBankForm)}>
              {showBankForm ? "Cancel" : bankDetails ? "Update" : "Add Bank Details"}
            </Button>
          </div>

          {showBankForm ? (
            <BankDetailsForm
              bankDetails={bankDetails}
              onSubmit={async (data) => {
                await updateBankDetails(data)
                setShowBankForm(false)
              }}
            />
          ) : bankDetails ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Bank:</span> {bankDetails.bankName}
              </p>
              <p>
                <span className="font-medium">Account Name:</span> {bankDetails.accountName}
              </p>
              <p>
                <span className="font-medium">Account Number:</span> {bankDetails.accountNumber}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No bank details added yet</p>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default FinancialScreen
