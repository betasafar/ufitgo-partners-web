import { Card } from "../../common/Card"

export const VerificationProgress = ({ status, documents }) => {
  const totalDocs = 3
  const approvedDocs = documents.filter((doc) => doc.status === "approved").length
  const progress = (approvedDocs / totalDocs) * 100

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <h2 className="text-xl font-semibold mb-4">Verification Progress</h2>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">
            {approvedDocs} of {totalDocs} documents approved
          </span>
          <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-primary rounded-full h-3 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{approvedDocs >= 1 ? "✅" : "⏳"}</span>
          <p className="text-sm">Company Registration (CAC)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{approvedDocs >= 2 ? "✅" : "⏳"}</span>
          <p className="text-sm">Valid ID</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{approvedDocs >= 3 ? "✅" : "⏳"}</span>
          <p className="text-sm">Bank Statement</p>
        </div>
      </div>

      {approvedDocs === totalDocs && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-medium text-center">🎉 Verification Complete! You now have full access.</p>
        </div>
      )}
    </Card>
  )
}
