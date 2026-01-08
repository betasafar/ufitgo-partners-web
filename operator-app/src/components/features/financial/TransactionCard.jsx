import { Card } from "../../common/Card"

export const TransactionCard = ({ transaction }) => {
  const isCredit = transaction.type === "credit"

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{transaction.description}</h3>
          <p className="text-sm text-gray-600 mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
          {transaction.referenceNumber && (
            <p className="text-xs text-gray-500 mt-1">Ref: {transaction.referenceNumber}</p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              transaction.status === "completed"
                ? "bg-green-100 text-green-800"
                : transaction.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>
    </Card>
  )
}
