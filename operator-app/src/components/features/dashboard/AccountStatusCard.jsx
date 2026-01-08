import { Card } from "../../common/Card"

export const AccountStatusCard = ({ verification, metrics }) => {
  const getStatusMessage = () => {
    if (verification?.status === "approved") {
      return {
        title: "Account Verified",
        message: "You have full access to all features",
        color: "green",
      }
    }
    if (verification?.status === "pending") {
      return {
        title: "Verification In Progress",
        message: "Your documents are being reviewed",
        color: "blue",
      }
    }
    return {
      title: "Complete Verification",
      message: "Upload your documents to unlock more features",
      color: "yellow",
    }
  }

  const status = getStatusMessage()

  return (
    <Card>
      <div className={`p-4 bg-${status.color}-50 border border-${status.color}-200 rounded-lg mb-4`}>
        <h4 className={`font-semibold text-${status.color}-900`}>{status.title}</h4>
        <p className={`text-sm text-${status.color}-700 mt-1`}>{status.message}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Bookings</span>
          <span className="font-semibold">{metrics?.totalBookings || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Active Packages</span>
          <span className="font-semibold">{metrics?.activePackages || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">This Month</span>
          <span className="font-semibold">{metrics?.monthlyBookings || 0} bookings</span>
        </div>
      </div>
    </Card>
  )
}
