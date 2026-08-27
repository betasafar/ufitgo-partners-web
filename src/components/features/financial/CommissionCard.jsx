import { Card } from "../../common/Card"

export const CommissionCard = ({ transaction }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const isRegistration = transaction.paymentStage === 'REGISTRATION';

  return (
    <Card className="p-5 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              Booking #{transaction.bookingId}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isRegistration 
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {transaction.paymentStage.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(transaction.createdAt).toLocaleDateString()} &middot; Ref: {transaction.paymentReference}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Customer Paid</p>
          <p className="font-bold text-gray-900">
            {formatCurrency(Number(transaction.operatorSettlement) + Number(transaction.ufitgoSettlement) + Number(transaction.pspFeeAmount))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 rounded-lg p-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">UfitGo Commission</p>
          <p className={`font-semibold ${isRegistration ? 'text-gray-900' : 'text-red-600'}`}>
            {isRegistration ? '₦0.00' : `- ${formatCurrency(transaction.commissionCollected)}`}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Payment Processing (PSP)</p>
          <p className="font-semibold text-orange-600">
            - {formatCurrency(transaction.pspFeeAmount)}
          </p>
        </div>

        <div className="col-span-2 text-right">
          <p className="text-xs text-gray-500 mb-1">Your Net Settlement</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatCurrency(transaction.operatorSettlement)}
          </p>
        </div>
      </div>
    </Card>
  )
}
