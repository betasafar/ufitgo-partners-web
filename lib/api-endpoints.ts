/**
 * Centralized API Endpoints Configuration
 *
 * This file serves as the single source of truth for all API endpoints
 * across the operator system. It provides type-safe endpoint access and
 * supports dynamic path parameters.
 *
 * Updated to include ALL endpoints from the latest API specification.
 *
 * Usage:
 * - Static endpoints: ENDPOINTS.AUTH.HEALTH
 * - Dynamic endpoints: buildEndpoint(ENDPOINTS.PACKAGES.BY_ID, { id: '123' })
 */

const OPERATOR_BASE = "/operator"
const AUTH_BASE = "/operator/auth"

/**
 * All API endpoints organized by feature domain
 */
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${AUTH_BASE}/login`,
    LOGOUT: `${AUTH_BASE}/logout`,
    REGISTER: `${AUTH_BASE}/register`,
    REFRESH: `${AUTH_BASE}/refresh`,
    VERIFY_EMAIL: `${AUTH_BASE}/verify-email`,
    RESET_PASSWORD: `${AUTH_BASE}/reset-password`,
  },

  // Operator Profile
  PROFILE: {
    GET: `${OPERATOR_BASE}/profile`,
    UPDATE: `${OPERATOR_BASE}/profile`,
    UPLOAD_LOGO: `${OPERATOR_BASE}/profile/logo`,
    VERIFICATION_STATUS: `${OPERATOR_BASE}/profile/verification-status`,
  },

  // Packages
  PACKAGES: {
    CREATE: `${OPERATOR_BASE}/packages`,
    LIST: `${OPERATOR_BASE}/packages`,
    BY_ID: `${OPERATOR_BASE}/packages/:id`,
    UPDATE: `${OPERATOR_BASE}/packages/:id`,
    DELETE: `${OPERATOR_BASE}/packages/:id`,
    TOGGLE_STATUS: `${OPERATOR_BASE}/packages/:id/status`,
    BOOKINGS: `${OPERATOR_BASE}/packages/:id/bookings`,
    PERFORMANCE: `${OPERATOR_BASE}/packages/:id/performance`,
    AVAILABILITY: `${OPERATOR_BASE}/packages/:id/availability`,
    AGGREGATE_PERFORMANCE: `${OPERATOR_BASE}/packages/performance`,
  },

  // Bookings
  BOOKINGS: {
    LIST: `${OPERATOR_BASE}/bookings`,
    URGENT_TASKS: `${OPERATOR_BASE}/bookings/urgent-tasks`,
    RECENT_TRAVELERS: `${OPERATOR_BASE}/bookings/recent`,
    BY_ID: `${OPERATOR_BASE}/bookings/:id`,
    DETAILED: `${OPERATOR_BASE}/bookings/:id/detailed`,
    ADJUST_PAYMENT: `${OPERATOR_BASE}/bookings/:id/adjust-payment`,
    APPROVE: `${OPERATOR_BASE}/bookings/:id/approve`,
    REJECT: `${OPERATOR_BASE}/bookings/:id/reject`,
    REFUND: `${OPERATOR_BASE}/bookings/:id/refund`,
  },

  // Wallet & Transactions
  WALLET: {
    TRANSACTIONS: `${OPERATOR_BASE}/wallet/transactions`,
    FILTERED_TRANSACTIONS: `${OPERATOR_BASE}/wallet/transactions/filtered`,
    REQUEST_PAYOUT: `${OPERATOR_BASE}/wallet/payout`,
    PAYMENT_STATS: `${OPERATOR_BASE}/wallet/payment-stats`,
  },

  // Notifications & Communications
  NOTIFICATIONS: {
    LIST: `${OPERATOR_BASE}/notifications`,
    MARK_READ: `${OPERATOR_BASE}/notifications/:id/read`,
    MARK_ALL_READ: `${OPERATOR_BASE}/notifications/read-all`,
    BROADCAST: `${OPERATOR_BASE}/notifications/broadcast`,
    COMMUNICATIONS_HISTORY: `${OPERATOR_BASE}/notifications/communications-history`,
    SEND: `${OPERATOR_BASE}/notifications/send`,
  },

  // Reports & Analytics
  REPORTS: {
    REVENUE: `${OPERATOR_BASE}/reports/revenue`,
    BOOKINGS: `${OPERATOR_BASE}/reports/bookings`,
    POPULAR_PACKAGES: `${OPERATOR_BASE}/reports/popular-packages`,
    MONTHLY_TREND: `${OPERATOR_BASE}/reports/monthly-trend`,
    DASHBOARD_STATS: `${OPERATOR_BASE}/reports/dashboard-stats`,
    REVENUE_FLOW: `${OPERATOR_BASE}/reports/revenue-flow`,
    EXPORT: `${OPERATOR_BASE}/reports/export`,
  },

  // Bank Account
  BANK_ACCOUNT: {
    ADD_AND_VERIFY: `${OPERATOR_BASE}/bank-account`,
    GET: `${OPERATOR_BASE}/bank-account`,
  },

  // Tier System
  TIER: {
    INFO: `${OPERATOR_BASE}/tier/info`,
    RESTRICTIONS: `${OPERATOR_BASE}/tier/restrictions`,
    COMPARISON: `${OPERATOR_BASE}/tier/comparison`,
    BADGES: `${OPERATOR_BASE}/tier/badges`,
    UPGRADE_ELIGIBILITY: `${OPERATOR_BASE}/tier/upgrade-eligibility`,
  },

  // Documents & Verification
  DOCUMENTS: {
    LIST: `${OPERATOR_BASE}/documents`,
    UPLOAD: `${OPERATOR_BASE}/documents/upload`,
    BY_ID: `${OPERATOR_BASE}/documents/:id`,
    DELETE: `${OPERATOR_BASE}/documents/:id`,
    RESUBMIT: `${OPERATOR_BASE}/documents/:id/resubmit`,
  },

   // Metrics & Performance
  METRICS: {
    OVERVIEW: `${OPERATOR_BASE}/metrics`,
    TRUST_SCORE: `${OPERATOR_BASE}/metrics/trust-score`,
    PERFORMANCE: `${OPERATOR_BASE}/metrics/performance`,
    BADGES: `${OPERATOR_BASE}/metrics/badges`,
  },
} as const

/**
 * Helper function to build endpoints with dynamic path parameters
 *
 * @example
 * buildEndpoint(ENDPOINTS.PACKAGES.BY_ID, { id: '123' })
 * // Returns: '/operator/packages/123'
 *
 * @example
 * buildEndpoint('/operator/bookings/:id/detailed', { id: '456' })
 * // Returns: '/operator/bookings/456/detailed'
 */
export function buildEndpoint(endpoint: string, params: Record<string, string | number>): string {
  let result = endpoint

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })

  // Verify all parameters were replaced
  const remainingParams = result.match(/:\w+/g)
  if (remainingParams) {
    console.warn(`[API] Missing parameters in endpoint: ${remainingParams.join(", ")}`, { endpoint, params })
  }

  return result
}

/**
 * Type-safe endpoint access
 */
export type EndpointKey = keyof typeof ENDPOINTS
export type SubEndpointKey<K extends EndpointKey> = keyof (typeof ENDPOINTS)[K]
export type EndpointPath = string // Covers all static and dynamic paths