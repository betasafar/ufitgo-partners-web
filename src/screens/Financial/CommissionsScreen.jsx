import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/common/Card"
import { Link } from "react-router-dom"
import { useCommissions } from "../../hooks/useCommissions"
import { CommissionCard } from "../../components/features/financial/CommissionCard"

const CommissionsScreen = () => {
  const { summary, transactions, config, loading, error, refetch } = useCommissions()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (loading) {
    return (
      <DashboardLayout title="Commissions & Fees">
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
      <DashboardLayout title="Commissions & Fees">
        <div className="p-6">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button onClick={refetch} className="px-4 py-2 bg-primary text-white rounded">
                Try Again
              </button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Commissions & Fees">
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 mt-2">
            Track your agreed platform commissions and payment processing fees across booking stages.
          </p>
        </div>

        {/* Current Agreement Banner */}
        <div className={`p-4 rounded-lg border ${config?.isCustom ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className={`font-semibold ${config?.isCustom ? 'text-purple-900' : 'text-blue-900'}`}>
                Current Commercial Agreement
              </h3>
              <p className={`text-sm mb-2 ${config?.isCustom ? 'text-purple-700' : 'text-blue-700'}`}>
                {config?.isCustom 
                  ? `You are on a negotiated Partner Agreement (${config.type === 'PERCENTAGE' ? `${config.value}%` : `₦${config.value}`} commission).`
                  : `You are on the standard Platform Agreement (10% commission).`
                }
              </p>
              <Link 
                to="/policy-agreement" 
                state={{ isVoluntary: true }}
                className={`text-sm font-medium hover:underline ${config?.isCustom ? 'text-purple-700' : 'text-blue-700'}`}
              >
                View Refund & Commission Dispute Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Commission Agreed</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary?.totalAgreed || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Expected lifetime commission on all bookings</p>
          </Card>

          <Card className="bg-white">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Collected</h3>
            <p className="text-3xl font-bold text-emerald-600">
              {formatCurrency(summary?.totalCollected || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Total platform fees successfully deducted</p>
          </Card>

          <Card className="bg-white">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Outstanding</h3>
            <p className="text-3xl font-bold text-amber-600">
              {formatCurrency(summary?.totalOutstanding || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">To be deducted from final payments</p>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-white">
          <h2 className="text-xl font-semibold mb-6">Commission History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-gray-500">No commission transactions found.</p>
              <p className="text-sm text-gray-400 mt-1">Transactions will appear here when customers make payments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <CommissionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default CommissionsScreen
