// src/endpoint.js
// Centralized API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/operator/auth/login",
    LOGOUT: "/operator/auth/logout",
    REGISTER: "/operator/auth/register",
    PROFILE: "/operator/profile",
  },
  METRICS: {
    TRUST_SCORE: "/operator/metrics/trust-score",
    PERFORMANCE: "/operator/metrics/performance",
    UPGRADE_PROGRESS: "/operator/metrics/upgrade-progress",
  },
  TIER: {
    INFO: "/operator/tier/info",
    RESTRICTIONS: "/operator/tier/restrictions",
  },
  PACKAGES: {
    LIST: "/operator/packages",
    CREATE: "/operator/packages",
    UPDATE: (id) => `/operator/packages/${id}`,
    DELETE: (id) => `/operator/packages/${id}`,
    GET: (id) => `/operator/packages/${id}`,

    // 🔥 NEW
    TYPES: "/operator/packages/package-types",
    SERVICE_LEVELS: "/operator/packages/service-levels",
    SUGGEST: "/operator/packages/suggest",
  },
  EXTENSIONS: {
    LIST: "/operator/extensions",
  },
  BOOKINGS: {
    LIST: "/operator/bookings",
    URGENT_TASKS: "/operator/bookings/urgent-tasks",
    GET: (id) => `/operator/bookings/${id}`,
    UPDATE_STATUS: (id) => `/operator/bookings/${id}/status`,
  },
  DOCUMENTS: {
    LIST: "/operator/documents",
    UPLOAD: "/operator/documents/upload",
    GET: (id) => `/operator/documents/${id}`,
    DELETE: (id) => `/operator/documents/${id}`,
  },
  VERIFICATION: {
    STATUS: "/operator/profile/verification-status",
  },
  WALLET: {
    TRANSACTIONS: "/operator/wallet/transactions",
    REQUEST_PAYOUT: "/operator/wallet/payout",
    PAYMENT_STATS: "/operator/wallet/payment-stats",
  },
  REPORTS: {
    DASHBOARD_STATS: "/operator/reports/dashboard-stats",
    REVENUE: "/operator/reports/revenue",
    BOOKINGS: "/operator/reports/bookings",
  },
  SETTINGS: {
    CHANGE_PASSWORD: "/operator/settings/password",
    NOTIFICATIONS: "/operator/settings/notifications",
  },

  FINANCIAL: {
    SUMMARY: "/operator/wallet/payment-stats",
    TRANSACTIONS: "/operator/wallet/transactions",
    TRANSACTIONS_FILTERED: "/operator/wallet/transactions/filtered",
    REQUEST_PAYOUT: "/operator/wallet/payout",
  },
  COMMISSIONS: {
    SUMMARY: "/operator/commissions/summary",
    HISTORY: "/operator/commissions/history",
    CONFIG: "/operator/commissions/config",
    POLICY_STATUS: "/operator/commissions/policy/status",
    POLICY_ACKNOWLEDGE: "/operator/commissions/policy/acknowledge",
  },
  SETTLEMENT: {
    BANK_ACCOUNT: "/operator/bank-account",
    SETUP: "/operator/settlement/setup",
  },
}
