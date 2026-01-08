# API Endpoints Migration Guide

## Summary of Changes

We've implemented a centralized API endpoints system to improve maintainability, type safety, and consistency across the application.

## What Changed?

### Before (Old Approach)
\`\`\`typescript
// Hardcoded endpoints scattered across files
const response = await fetch('/operator/tier', ...)
const response = await fetch(`/operator/documents/${id}`, ...)
\`\`\`

### After (New Approach)
\`\`\`typescript
import { ENDPOINTS, buildEndpoint } from '@/lib/api-endpoints'

// Static endpoints
const response = await fetch(ENDPOINTS.TIER.INFO, ...)

// Dynamic endpoints
const response = await fetch(buildEndpoint(ENDPOINTS.DOCUMENTS.BY_ID, { id: '123' }), ...)
\`\`\`

## Benefits

1. **Single Source of Truth** - All endpoints defined in one place
2. **Type Safety** - TypeScript autocomplete for all endpoints
3. **Refactoring Safety** - Change once, updates everywhere
4. **No Typos** - Prevents `/operater` vs `/operator` mistakes
5. **Better Documentation** - Serves as living API docs
6. **Easier Testing** - Mock all endpoints easily

## How to Use

### Static Endpoints
\`\`\`typescript
import { ENDPOINTS } from '@/lib/api-endpoints'

// Authentication
ENDPOINTS.AUTH.LOGIN
ENDPOINTS.AUTH.LOGOUT

// Tier System
ENDPOINTS.TIER.INFO
ENDPOINTS.TIER.COMPARISON

// Metrics
ENDPOINTS.METRICS.OVERVIEW
ENDPOINTS.METRICS.TRUST_SCORE
\`\`\`

### Dynamic Endpoints (with parameters)
\`\`\`typescript
import { buildEndpoint, ENDPOINTS } from '@/lib/api-endpoints'

// Single parameter
const url = buildEndpoint(ENDPOINTS.PACKAGES.BY_ID, { id: '123' })
// Result: '/operator/packages/123'

// Multiple parameters
const url = buildEndpoint('/operator/bookings/:bookingId/items/:itemId', {
  bookingId: '1',
  itemId: '2'
})
// Result: '/operator/bookings/1/items/2'
\`\`\`

## Migration Checklist

### Files Updated
- ✅ lib/api-proxy.ts - All server-side API calls
- ✅ app/api/bookings/route.ts
- ✅ app/dashboard/packages/[id]/availability/page.tsx
- ✅ app/dashboard/applicants/page.tsx
- ✅ app/dashboard/financial/page.tsx
- ✅ app/dashboard/settings/page.tsx
- ✅ app/dashboard/reports/page.tsx
- ⏳ app/dashboard/applicants/[id]/page.tsx
- ⏳ components/dashboard-header.tsx
- ⏳ components/notifications-panel.tsx

### Next Steps
Continue updating remaining files to use centralized endpoints for consistency.

## Adding New Endpoints

When adding new API endpoints, update `lib/api-endpoints.ts`:

\`\`\`typescript
export const ENDPOINTS = {
  // ... existing endpoints ...
  
  // Add your new endpoint group
  NEW_FEATURE: {
    LIST: '/operator/new-feature',
    BY_ID: '/operator/new-feature/:id',
    CREATE: '/operator/new-feature',
  },
}
\`\`\`

## Pro Tips

1. **Always import from lib/api-endpoints** - Don't hardcode endpoints
2. **Use buildEndpoint for dynamic segments** - It validates all parameters
3. **Check console warnings** - Missing parameters will be logged
4. **Keep endpoints organized** - Group by feature domain
5. **Use TypeScript autocomplete** - ENDPOINTS. will show all available options
