export interface Operator {
  id: string
  companyName: string
  email: string
  phone: string
  logo?: string
  verified: boolean
  verificationStatus: "pending" | "approved" | "rejected"
  cacRegistration: string
  nahconLicense: string
  role: "operator"
  tier: TierLevel
  tierInfo: TierInfo
  trustScore: number
  trustBadges: TrustBadge[]
  documents: VerificationDocument[]
  totalBookings: number
  successfulBookings: number
  cancelledBookings: number
  monthlyBookingsCount: number
  activePackagesCount: number
}

export interface Package {
  id: string
  operatorId: string
  title: string
  description: string
  type: "hajj" | "umrah" | "tour"
  season: string
  price: number
  deposit: number
  capacity: number
  booked: number
  status: "active" | "paused" | "closed"
  images: string[]
  itinerary: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  packageId: string
  pilgrimId: string
  pilgrimName: string
  pilgrimEmail: string
  packageTitle: string
  amount: number
  paymentStatus: "pending" | "partial" | "completed"
  travelDate: string
  createdAt: string
}

export interface Payout {
  id: string
  operatorId: string
  amount: number
  status: "pending" | "processing" | "completed" | "rejected"
  requestedAt: string
  processedAt?: string
}

export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalBookings: number
  bookingsChange: number
  pendingPayments: number
  paymentsChange: number
  visaExpiring: number
  visaChange: number
  activePackages: number
  seatsFilled: number
  totalSeats: number
  revenueProjected: number
}

export interface RevenueDataPoint {
  week: string
  revenue: number
}

export interface Applicant {
  id: string
  name: string
  passport: string
  email: string
  phone: string
  bookingId: string
  bookingDate: string
  package: string
  packageId: string
  status: "approved" | "confirmed" | "reviewing" | "issue_flagged"
  visaStatus: "processing" | "issued" | "pending_info" | "rejected"
  paymentProgress: number
  amountPaid: number
  totalAmount: number
  avatar: string
  nationality: string
  gender: string
  age: number
  occupation: string
  state: string
}

export interface Transaction {
  id: string
  date: string
  refId: string
  description: string
  method: string
  amount: number
  status: "paid" | "pending"
  applicantId: string
}

export interface Document {
  id: string
  name: string
  size: string
  uploadedAt: string
  type: string
  url: string
}

export interface PaymentStats {
  totalRevenue: number
  revenueChange: number
  totalDeposits: number
  depositsChange: number
  pendingBalance: number
  paymentsDue: number
  successRate: number
  successChange: number
}

export type TierLevel = "BRONZE" | "SILVER" | "GOLD"
export type VerificationStatus = "pending" | "under_review" | "approved" | "rejected"

export interface TierInfo {
  level: TierLevel
  maxPilgrimsPerBooking: number
  maxActivePackages: number
  maxMonthlyBookings: number
  requiresEscrow: boolean
  canCreateCustomPackages: boolean
  hasAnalyticsAccess: boolean
  hasPrioritySupport: boolean
  features: string[]
}

export interface VerificationDocument {
  id: number
  type: "HAJJ_LICENSE" | "CAC_CERTIFICATE" | "TAX_CLEARANCE" | "BANK_STATEMENT"
  status: VerificationStatus
  fileUrl: string
  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface TrustBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  category: "performance" | "milestone" | "special"
}

export interface OperatorWithTier extends Operator {
  tier: TierLevel
  tierInfo: TierInfo
  trustScore: number
  trustBadges: TrustBadge[]
  documents: VerificationDocument[]
  totalBookings: number
  successfulBookings: number
  cancelledBookings: number
  monthlyBookingsCount: number
  activePackagesCount: number
}

export interface TierUpgradeRequirement {
  id: string
  description: string
  completed: boolean
  progress?: number
  total?: number
}
