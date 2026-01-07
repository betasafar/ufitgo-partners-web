/**
 * Centralized API Endpoints Configuration
 *
 * This file serves as the single source of truth for all API endpoints
 * across the operator system. It provides type-safe endpoint access and
 * supports dynamic path parameters.
 *
 * Usage:
 * - Static endpoints: ENDPOINTS.TIER.INFO
 * - Dynamic endpoints: buildEndpoint(ENDPOINTS.DOCUMENTS.BY_ID, { id: '123' })
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
  OPERATOR: {
    PROFILE: `${OPERATOR_BASE}/profile`,
    UPDATE_PROFILE: `${OPERATOR_BASE}/profile`,
    CHANGE_PASSWORD: `${OPERATOR_BASE}/change-password`,
  },

  // Tier System
  TIER: {
    INFO: `${OPERATOR_BASE}/tier`,
    COMPARISON: `${OPERATOR_BASE}/tier/comparison`,
    UPGRADE_ELIGIBILITY: `${OPERATOR_BASE}/tier/upgrade-eligibility`,
    RESTRICTIONS: `${OPERATOR_BASE}/tier/restrictions`,
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

  // Packages
  PACKAGES: {
    LIST: `${OPERATOR_BASE}/packages`,
    CREATE: `${OPERATOR_BASE}/packages`,
    BY_ID: `${OPERATOR_BASE}/packages/:id`,
    UPDATE: `${OPERATOR_BASE}/packages/:id`,
    DELETE: `${OPERATOR_BASE}/packages/:id`,
    PERFORMANCE: `${OPERATOR_BASE}/packages/performance`,
    AGGREGATE_PERFORMANCE: `${OPERATOR_BASE}/packages/aggregate-performance`,
  },

  // Bookings
  BOOKINGS: {
    LIST: `${OPERATOR_BASE}/bookings`,
    CREATE: `${OPERATOR_BASE}/bookings`,
    BY_ID: `${OPERATOR_BASE}/bookings/:id`,
    UPDATE: `${OPERATOR_BASE}/bookings/:id`,
    CANCEL: `${OPERATOR_BASE}/bookings/:id/cancel`,
    CONFIRM: `${OPERATOR_BASE}/bookings/:id/confirm`,
    STATISTICS: `${OPERATOR_BASE}/bookings/statistics`,
  },

  // Applicants
  APPLICANTS: {
    LIST: `${OPERATOR_BASE}/applicants`,
    BY_ID: `${OPERATOR_BASE}/applicants/:id`,
    UPDATE_STATUS: `${OPERATOR_BASE}/applicants/:id/status`,
    DOCUMENTS: `${OPERATOR_BASE}/applicants/:id/documents`,
  },

  // Payments & Financial
  PAYMENTS: {
    LIST: `${OPERATOR_BASE}/payments`,
    BY_ID: `${OPERATOR_BASE}/payments/:id`,
    INITIATE: `${OPERATOR_BASE}/payments/initiate`,
    VERIFY: `${OPERATOR_BASE}/payments/verify`,
    STATISTICS: `${OPERATOR_BASE}/payments/statistics`,
    TOP_PACKAGES: `${OPERATOR_BASE}/payments/top-packages`,
  },

  // Wallet & Transactions
  WALLET: {
    BALANCE: `${OPERATOR_BASE}/wallet/balance`,
    TRANSACTIONS: `${OPERATOR_BASE}/wallet/transactions`,
    WITHDRAW: `${OPERATOR_BASE}/wallet/withdraw`,
    ESCROW_STATUS: `${OPERATOR_BASE}/wallet/escrow`,
  },

  // Bank Accounts
  BANK_ACCOUNTS: {
    LIST: `${OPERATOR_BASE}/bank-accounts`,
    CREATE: `${OPERATOR_BASE}/bank-accounts`,
    BY_ID: `${OPERATOR_BASE}/bank-accounts/:id`,
    DELETE: `${OPERATOR_BASE}/bank-accounts/:id`,
    SET_PRIMARY: `${OPERATOR_BASE}/bank-accounts/:id/set-primary`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: `${OPERATOR_BASE}/notifications`,
    MARK_READ: `${OPERATOR_BASE}/notifications/:id/read`,
    MARK_ALL_READ: `${OPERATOR_BASE}/notifications/mark-all-read`,
    PREFERENCES: `${OPERATOR_BASE}/notifications/preferences`,
  },

  // Analytics & Reports
  ANALYTICS: {
    OVERVIEW: `${OPERATOR_BASE}/analytics/overview`,
    BOOKINGS: `${OPERATOR_BASE}/analytics/bookings`,
    REVENUE: `${OPERATOR_BASE}/analytics/revenue`,
    PERFORMANCE: `${OPERATOR_BASE}/analytics/performance`,
  },
} as const

/**
 * Helper function to build endpoints with dynamic path parameters
 *
 * @example
 * buildEndpoint(ENDPOINTS.DOCUMENTS.BY_ID, { id: '123' })
 * // Returns: '/operator/documents/123'
 *
 * @example
 * buildEndpoint('/operator/packages/:packageId/items/:itemId', {
 *   packageId: '1',
 *   itemId: '2'
 * })
 * // Returns: '/operator/packages/1/items/2'
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
 * Type-safe endpoint builder with autocomplete
 */
export type EndpointKey = keyof typeof ENDPOINTS
export type EndpointValue<K extends EndpointKey> = (typeof ENDPOINTS)[K]

/**
 * Extract all endpoint paths as a union type for type safety
 */
export type EndpointPath = (typeof ENDPOINTS)[EndpointKey][keyof (typeof ENDPOINTS)[EndpointKey]] | string
