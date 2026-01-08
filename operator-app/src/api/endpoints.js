// Centralized API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/operator/login",
    LOGOUT: "/operator/logout",
    PROFILE: "/operator/profile",
  },
  TIER: {
    INFO: "/operator/tier",
    METRICS: "/operator/metrics",
  },
  PACKAGES: {
    LIST: "/operator/packages",
    CREATE: "/operator/packages",
    UPDATE: (id) => `/operator/packages/${id}`,
    DELETE: (id) => `/operator/packages/${id}`,
    GET: (id) => `/operator/packages/${id}`,
  },
  BOOKINGS: {
    LIST: "/operator/bookings",
    GET: (id) => `/operator/bookings/${id}`,
    UPDATE_STATUS: (id) => `/operator/bookings/${id}/status`,
  },
  DOCUMENTS: {
    LIST: "/operator/documents",
    UPLOAD: "/operator/documents/upload",
    GET: (id) => `/operator/documents/${id}`,
  },
  VERIFICATION: {
    STATUS: "/operator/verification/status",
  },
  FINANCIAL: {
    SUMMARY: "/operator/financial/summary",
    TRANSACTIONS: "/operator/financial/transactions",
    REQUEST_PAYOUT: "/operator/financial/payout-request",
    BANK_DETAILS: "/operator/financial/bank-details",
  },
  SETTINGS: {
    CHANGE_PASSWORD: "/operator/settings/password",
    NOTIFICATIONS: "/operator/settings/notifications",
  },
}
