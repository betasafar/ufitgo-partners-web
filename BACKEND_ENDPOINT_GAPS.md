# Backend Endpoint Gaps Analysis

This document identifies frontend pages that are calling backend endpoints that don't exist yet.

## Summary
- **Total Frontend Pages**: 17
- **Missing Backend Endpoints**: 8
- **Status**: Needs Implementation

---

## Missing Backend Endpoints

### 1. Bookings Module - MISSING ENDPOINTS

#### **POST /operator/bookings/:id/refund**
- **Frontend Page**: `app/dashboard/applicants/[id]/refund/page.tsx:48`
- **Purpose**: Process refund for a booking
- **Request Body**: 
  \`\`\`typescript
  {
    amount: number;
    reason: string;
    method: 'original' | 'bank_transfer';
  }
  \`\`\`
- **Response**: Refund confirmation
- **Controller**: `bookings.controller.ts`
- **Service Method**: `processRefund()`

---

#### **POST /operator/bookings/:id/accept**
- **Frontend Page**: `app/dashboard/applicants/[id]/review/page.tsx:40`
- **Purpose**: Accept/approve a booking application
- **Request Body**: 
  \`\`\`typescript
  {
    notes?: string;
    assignedGroup?: string;
  }
  \`\`\`
- **Response**: Updated booking with status 'confirmed'
- **Controller**: `bookings.controller.ts`
- **Service Method**: `acceptBooking()`

---

#### **POST /operator/bookings/:id/reject**
- **Frontend Page**: `app/dashboard/applicants/[id]/review/page.tsx:61`
- **Purpose**: Reject a booking application
- **Request Body**: 
  \`\`\`typescript
  {
    reason: string;
    refundAmount?: number;
  }
  \`\`\`
- **Response**: Updated booking with status 'rejected'
- **Controller**: `bookings.controller.ts`
- **Service Method**: `rejectBooking()`

---

### 2. Packages Module - MISSING ENDPOINTS

#### **GET /operator/packages/performance**
- **Frontend Page**: `app/dashboard/packages/performance/page.tsx:12`
- **Purpose**: Get overall package performance metrics
- **Query Params**: `startDate?, endDate?`
- **Response**: 
  \`\`\`typescript
  {
    totalRevenue: number;
    totalBookings: number;
    averageConversionRate: number;
    bookingVelocity: Array<{date: string, applications: number, bookings: number}>;
    demographics: {topRegion: string, regions: Array<{name: string, count: number}>};
    paymentPreferences: {installment: number, fullPayment: number};
    activePackages: Package[];
  }
  \`\`\`
- **Controller**: `packages.controller.ts`
- **Service Method**: `getOverallPerformance()`
- **Note**: Different from `/packages/:id/performance` (single package)

---

#### **PUT /operator/packages/:id/availability**
- **Frontend Page**: `app/dashboard/packages/[id]/availability/page.tsx:48`
- **Purpose**: Update package availability/slots
- **Request Body**: 
  \`\`\`typescript
  {
    totalSlots?: number;
    bookedSlots?: number;
    status?: 'open' | 'closed' | 'full';
  }
  \`\`\`
- **Response**: Updated package
- **Controller**: `packages.controller.ts`
- **Service Method**: `updateAvailability()`

---

### 3. Analytics/Reports Module - MISSING ENDPOINTS

#### **GET /operator/reports/export** (might exist as /operator/analytics/export)
- **Frontend Page**: `app/dashboard/reports/page.tsx:69`
- **Purpose**: Export various reports (Applicant Manifest, Financial, Refund Logs, Accommodation)
- **Query Params**: 
  \`\`\`typescript
  {
    type: 'applicant_manifest' | 'financial' | 'refund_logs' | 'accommodation';
    format: 'csv' | 'pdf';
    startDate?: string;
    endDate?: string;
    visaStatus?: string;
    group?: string;
    includePhotos?: boolean;
  }
  \`\`\`
- **Response**: File download (CSV/PDF)
- **Controller**: Need to check if `analytics.controller.ts` export endpoint handles all types
- **Note**: Currently exists as `/operator/analytics/export` - may need to verify it supports all report types

---

### 4. Profile Module - MISSING ENDPOINT

#### **POST /operator/profile/logo**
- **Frontend Page**: `app/dashboard/settings/page.tsx:84`
- **Purpose**: Upload operator company logo
- **Request Body**: FormData with logo file
- **Response**: Updated profile with logo URL
- **Controller**: `profile.controller.ts`
- **Service Method**: `uploadLogo()`

---

## Existing Endpoints (No Action Needed)

These frontend calls map to existing backend endpoints:

✅ **GET /operator/bookings** → `bookings.controller.ts:14`  
✅ **GET /operator/bookings/:id** → `bookings.controller.ts:21`  
✅ **GET /operator/bookings/:id/detailed** → `bookings.controller.ts:51`  
✅ **GET /operator/bookings/urgent-tasks** → `bookings.controller.ts:37`  
✅ **GET /operator/bookings/recent** → `bookings.controller.ts:44`  
✅ **GET /operator/packages** → `packages.controller.ts:29`  
✅ **GET /operator/packages/:id** → `packages.controller.ts:36`  
✅ **GET /operator/packages/:id/performance** → `packages.controller.ts:87` (single package)  
✅ **GET /operator/wallet/payment-stats** → `wallet.controller.ts`  
✅ **GET /operator/wallet/transactions/filtered** → `wallet.controller.ts`  
✅ **GET /operator/profile** → `profile.controller.ts`  
✅ **PUT /operator/profile** → `profile.controller.ts`  
✅ **GET /operator/bank-account** → `bank-account.controller.ts`  
✅ **GET /operator/analytics/dashboard-stats** → `analytics.controller.ts:60`  
✅ **GET /operator/analytics/revenue-flow** → `analytics.controller.ts:67`

---

## Implementation Priority

### Priority 1 (Critical - User Actions)
1. **POST /operator/bookings/:id/accept** - Approving bookings
2. **POST /operator/bookings/:id/reject** - Rejecting bookings
3. **POST /operator/bookings/:id/refund** - Processing refunds

### Priority 2 (High - Core Features)
4. **GET /operator/packages/performance** - Overall package analytics
5. **PUT /operator/packages/:id/availability** - Managing slots

### Priority 3 (Medium - Nice to Have)
6. **POST /operator/profile/logo** - Company branding
7. **Verify /operator/analytics/export** - Ensure it supports all report types

---

## Next Steps

1. Implement Priority 1 endpoints in `bookings.controller.ts`
2. Implement Priority 2 endpoints in `packages.controller.ts`
3. Implement Priority 3 endpoint in `profile.controller.ts`
4. Verify analytics export endpoint supports all report types
5. Test all endpoints with frontend integration
