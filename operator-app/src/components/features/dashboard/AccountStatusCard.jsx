import { Card } from "../../common/Card"

const STATUS_STYLES = {
  approved: {
    title: "✅ Account Verified",
    message: "You have full access to all features",
    wrapper: "bg-green-50 border-green-200",
    titleText: "text-green-900",
    bodyText: "text-green-700",
  },
  pending: {
    title: "⏳ Verification In Progress",
    message: "Your documents are being reviewed",
    wrapper: "bg-blue-50 border-blue-200",
    titleText: "text-blue-900",
    bodyText: "text-blue-700",
  },
  unverified: {
    title: "📋 Complete Verification",
    message: "Upload your documents to unlock more features",
    wrapper: "bg-yellow-50 border-yellow-200",
    titleText: "text-yellow-900",
    bodyText: "text-yellow-700",
  },
}

export const AccountStatusCard = ({ verification, metrics }) => {
  const verificationStatus =
    verification?.verificationStatus ||
    verification?.status ||
    "pending"

  const tier =
    verification?.tier ||
    metrics?.performance?.tier ||
    "BRONZE"

  const trustScore =
    verification?.trustScore ||
    metrics?.trustScore?.currentScore ||
    0

  const status =
    verificationStatus === "approved"
      ? STATUS_STYLES.approved
      : verificationStatus === "pending"
        ? STATUS_STYLES.pending
        : STATUS_STYLES.unverified

  return (
    <Card>
      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg border mb-4 ${status.wrapper}`}
      >
        <h4 className={`font-semibold ${status.titleText}`}>
          {status.title}
        </h4>
        <p className={`text-sm mt-1 ${status.bodyText}`}>
          {status.message}
        </p>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-fg/70">Account Level</span>
          <span className="font-semibold text-primary">
            {tier}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-fg/70">Trust Score</span>
          <span className="font-semibold text-fg">
            {trustScore}/100
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-fg/70">Total Bookings</span>
          <span className="font-semibold text-fg">
            {metrics?.performance?.totalBookings || 0}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-fg/70">Active Packages</span>
          <span className="font-semibold text-fg">
            {metrics?.performance?.activePackages || 0}
          </span>
        </div>
      </div>
    </Card>
  )
}
