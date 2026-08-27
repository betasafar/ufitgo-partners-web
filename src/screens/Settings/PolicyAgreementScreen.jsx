import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/common/Card"
import commissionService from "../../api/services/commission.service"

const PolicyAgreementScreen = () => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Are they here voluntarily from Settings, or forced via interceptor?
  const isVoluntary = location.state?.isVoluntary || false

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const res = await commissionService.getPolicyStatus()
      setStatus(res)
    } catch (err) {
      console.error("Failed to fetch policy status:", err)
      setError("Failed to load policy status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!agreed) return
    try {
      setSubmitting(true)
      setError(null)
      await commissionService.acknowledgePolicy()
      // If forced, navigate to dashboard root after accepting.
      // If voluntary, just refetch status.
      if (!isVoluntary) {
        navigate("/")
      } else {
        await fetchStatus()
      }
    } catch (err) {
      console.error("Failed to accept policy:", err)
      setError(err.message || "Failed to accept policy. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="animate-pulse space-y-4 max-w-md w-full">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const Content = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <span className="text-3xl">📜</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Commission Dispute Policy</h1>
        <p className="text-gray-500">
          Please review and accept our commercial terms regarding commissions and disputes.
        </p>
      </div>

      <Card className="p-8 shadow-sm border border-gray-100">
        <div className="space-y-6 text-gray-700">
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Registration is Yours</h3>
              <p className="text-sm">Registration and onboarding fees paid by customers are non-commissionable. These belong entirely to you.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">When We Earn</h3>
              <p className="text-sm">UfitGo commission is earned strictly on qualifying successful payments processed through our infrastructure.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Your Responsibility</h3>
              <p className="text-sm">UfitGo is a marketplace platform. You remain fully responsible for delivering the booked service and managing ordinary customer refunds or service disputes.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Voluntary Refunds</h3>
              <p className="text-sm">If you voluntarily refund a customer for a service, UfitGo's already earned commission is not automatically reversed.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">5</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Evidence Required</h3>
              <p className="text-sm">Any claims for commission reversals require verifiable evidence (e.g., official refund receipts, payment gateway logs). A mere allegation is insufficient.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">6</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Chargebacks & Reversals</h3>
              <p className="text-sm">If a payment is subject to a formal chargeback or reversal by the customer's bank, we may reverse our commission after an investigation.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">7</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Platform Protection</h3>
              <p className="text-sm">We reserve the right to suspend or withhold amounts if there is credible, verifiable evidence of fraud, payment abuse, unauthorized transactions, or material misrepresentation.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">8</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Set-off Rights</h3>
              <p className="text-sm">UfitGo reserves the right to recover verified amounts owed through set-off against future settlements or commissions payable to you.</p>
            </div>
          </div>

        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {status?.hasAcceptedLatest ? (
          <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">
              ✓
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900">Policy Accepted</h4>
              <p className="text-sm text-emerald-700">
                You acknowledged and accepted Version {status.acceptedVersion} on {new Date(status.acceptedAt).toLocaleDateString()}.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center pt-1">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-colors"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                I have read and agree to the UfitGo Refund & Commission Dispute Policy. I understand that my acceptance is legally binding and governs my use of the platform's payment infrastructure.
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!agreed || submitting}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                agreed && !submitting 
                  ? 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Recording Acceptance...' : 'I Acknowledge and Accept'}
            </button>
          </div>
        )}
      </Card>
    </div>
  )

  // If forced (not voluntary) and they haven't accepted, render without DashboardLayout so they can't click menu items
  if (!isVoluntary && !status?.hasAcceptedLatest) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <Content />
      </div>
    )
  }

  // If voluntary (accessed from settings) or they already accepted, render within the Dashboard
  return (
    <DashboardLayout title="Policy Agreement">
      <div className="p-6">
        <Content />
      </div>
    </DashboardLayout>
  )
}

export default PolicyAgreementScreen
