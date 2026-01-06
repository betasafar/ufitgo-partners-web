# API Endpoint Gap Analysis
## Frontend Requirements vs Backend Implementation

**Last Updated:** January 7, 2026  
**Analysis Date:** Based on current codebase state

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Complete Endpoint Inventory](#complete-endpoint-inventory)
3. [Endpoints Needing Updates](#endpoints-needing-updates)
4. [Missing Endpoints to Create](#missing-endpoints-to-create)
5. [Implementation Priority Matrix](#implementation-priority-matrix)
6. [Detailed Implementation Plan](#detailed-implementation-plan)

---

## Executive Summary

### Current State
- **Total Backend Endpoints:** 26
- **Frontend Pages:** 15+
- **Using Mock Data:** 90% of frontend
- **Integration Status:** Partial (Auth only)

### Key Findings
✅ **Complete & Ready:** Authentication, Bookings (basic), Notifications, Profile  
⚠️ **Needs Updates:** Packages, Analytics, Wallet  
❌ **Missing:** Dashboard Stats, Reports, Settings APIs, Communications History

### Recommended Action Plan
**Phase 1 (Week 1-2):** Complete Dashboard Stats & Package Management  
**Phase 2 (Week 3-4):** Implement Communications & Travelers (Applicants) APIs  
**Phase 3 (Week 5-6):** Add Reports, Settings, and Advanced Features

---

## Complete Endpoint Inventory

### 1. Authentication Module (NestJS) ✅ COMPLETE
**Base Path:** `/api/operator/auth`

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/register` | POST | ✅ Complete | Signup form |
| `/login` | POST | ✅ Complete | Login form |
| `/logout` | POST | ✅ Complete | Sidebar logout |
| `/health` | GET | ✅ Complete | System check |

**Assessment:** Fully functional and integrated

---

### 2. Profile Module (NestJS) ✅ COMPLETE  
**Base Path:** `/api/operator/profile`

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/` | GET | ✅ Complete | Settings page, Dashboard layout |
| `/` | PUT | ✅ Complete | Settings profile update |
| `/logo` | POST | ✅ Complete | Logo upload |
| `/verification-status` | GET | ✅ Complete | Verification banner |

**Assessment:** Fully functional, needs frontend integration

**Frontend Integration Needed:**
- Settings page to call GET `/operator/profile` instead of using hardcoded data
- Settings page to call PUT `/operator/profile` on form submit
- Logo upload functionality needs to be connected

---

### 3. Bookings Module (NestJS) ✅ COMPLETE
**Base Path:** `/api/operator/bookings`

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/` | GET | ✅ Complete | Applicants/Travelers list |
| `/:id` | GET | ✅ Complete | Traveler detail page |
| `/:id/adjust-payment` | PUT | ✅ Complete | Payment adjustment |

**Assessment:** Core functionality complete

**Frontend Integration Needed:**
- Replace mockApplicants with API calls to GET `/operator/bookings`
- Applicant detail page to fetch from GET `/operator/bookings/:id`
- Payment adjustment form to call PUT `/operator/bookings/:id/adjust-payment`

---

### 4. Notifications Module (NestJS) ✅ COMPLETE
**Base Path:** `/api/operator/notifications`

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/` | GET | ✅ Complete | Notification dropdown |
| `/:id/read` | POST | ✅ Complete | Mark single as read |
| `/read-all` | POST | ✅ Complete | Mark all as read |
| `/broadcast` | POST | ✅ Complete | Communications page |

**Query Parameters:**
- `?unread=true` - Get only unread notifications

**Assessment:** Fully functional, needs frontend integration

**Frontend Integration Needed:**
- Dashboard header notification bell to fetch from GET `/operator/notifications?unread=true`
- Broadcast form in Communications page to call POST `/operator/notifications/broadcast`

---

### 5. Packages Module (NestJS) ⚠️ NEEDS UPDATES
**Base Path:** `/api/operator/packages`

| Endpoint | Method | Status | Frontend Usage | Notes |
|----------|--------|--------|----------------|-------|
| `/` | POST | ✅ Complete | Create package | With image upload |
| `/` | GET | ✅ Complete | Packages list | |
| `/:id` | GET | ✅ Complete | Package detail | |
| `/:id` | PUT | ❌ Missing | Edit package | Needs implementation |
| `/:id` | DELETE | ❌ Missing | Delete package | Needs implementation |
| `/:id/status` | PATCH | ❌ Missing | Toggle active/inactive | Frontend expects this |
| `/:id/bookings` | GET | ❌ Missing | Get package bookings | Performance page needs this |
| `/:id/availability` | GET | ❌ Missing | Check availability | Availability page needs this |

**Frontend Integration Needed:**
- Packages page to call GET `/operator/packages` instead of mockPackages
- Package creation form to call POST `/operator/packages` with FormData for images
- Package editing to call PUT `/operator/packages/:id`
- Package deletion to call DELETE `/operator/packages/:id`

---

### 6. Analytics Module (NestJS) ⚠️ PARTIAL
**Base Path:** `/api/operator/analytics`

| Endpoint | Method | Status | Frontend Usage | Notes |
|----------|--------|--------|----------------|-------|
| `/revenue` | GET | ✅ Complete | Analytics page | |
| `/bookings` | GET | ✅ Complete | Analytics page | |
| `/popular-packages` | GET | ✅ Complete | Analytics page | |
| `/monthly-trend` | GET | ✅ Complete | Analytics page | |

**Assessment:** Good foundation but missing dashboard-specific aggregates

**What's Missing:**
- Dashboard needs simpler, aggregated stats (not detailed analytics)
- See "Dashboard Stats" in Missing Endpoints section

---

### 7. Wallet Module (NestJS) ⚠️ NEEDS UPDATES
**Base Path:** `/api/operator/wallet`

| Endpoint | Method | Status | Frontend Usage | Notes |
|----------|--------|--------|----------------|-------|
| `/` | GET | ✅ Complete | Wallet info | Balance, currency |
| `/transactions` | GET | ✅ Complete | Transaction history | |
| `/payout` | POST | ✅ Complete | Request payout | |

**Assessment:** Basic wallet complete, needs payment aggregates for Payments page

**What's Missing:**
- Payment statistics (total revenue, deposits, pending balance, success rate)
- Revenue flow by month
- Payment type breakdown
- See "Payments Stats" in Missing Endpoints section

---

### 8. Bank Accounts Module (NestJS) ✅ COMPLETE
**Base Path:** `/api/operator/bank-accounts`

| Endpoint | Method | Status | Frontend Usage |
|----------|--------|--------|----------------|
| `/` | POST | ✅ Complete | Add bank account |
| `/` | GET | ✅ Complete | List bank accounts |

**Assessment:** Functional but not yet used in frontend

---

### 9. High-Performance Endpoints (Go) ✅ AVAILABLE
**Base Path:** `/api/operator` (via Go service)

| Endpoint | Method | Status | Frontend Usage | Notes |
|----------|--------|--------|----------------|-------|
| `/packages/home-aggregation` | GET | ✅ Complete | Dashboard stats | Fast aggregation |
| `/bookings/pending` | GET | ✅ Complete | Urgent tasks | |
| `/analytics/highload` | GET | ✅ Complete | Advanced analytics | Revenue trends |
| `/payments/highload` | GET | ✅ Complete | Payment aggregates | Total paid, pending |

**Assessment:** Go microservice provides high-performance alternatives for dashboard

**Frontend Integration Needed:**
- Dashboard to use GET `/packages/home-aggregation` for fast stats
- Urgent tasks widget to use GET `/bookings/pending`
- Payments page to use GET `/payments/highload` for aggregates

---

## Endpoints Needing Updates

### 1. Packages Module - Add Missing CRUD Operations

**Priority:** HIGH  
**Effort:** Medium (2-3 days)

#### Missing Endpoints:

**a) Update Package**
```typescript
PUT /api/operator/packages/:id
Body: UpdatePackageDto (all fields optional)
Response: Updated Package
```

**Implementation Notes:**
- Already have service method `update()` - just need controller route
- Support partial updates
- Validate operator ownership
- Handle image updates (add/remove)

**Frontend Impact:**
- Package edit form can save changes
- Currently shows form but can't persist edits

---

**b) Delete Package**
```typescript
DELETE /api/operator/packages/:id
Response: { message: "Package deleted successfully" }
```

**Implementation Notes:**
- Already have service method `delete()` - just need controller route
- Soft delete recommended (status = 'archived')
- Check for active bookings before deletion
- Return meaningful error if bookings exist

**Frontend Impact:**
- Package list delete button will work
- Currently disabled

---

**c) Toggle Package Status**
```typescript
PATCH /api/operator/packages/:id/status
Body: { status: 'active' | 'inactive' | 'draft' | 'archived' }
Response: Updated Package
```

**Implementation Notes:**
- Quick status toggle without full update
- Already have `toggleStatus()` service method
- Need controller route with proper validation

**Frontend Impact:**
- Package list status toggle switch will work
- Quick enable/disable packages

---

**d) Get Package Bookings**
```typescript
GET /api/operator/packages/:id/bookings
Query: ?status=confirmed&limit=10
Response: Booking[]
```

**Implementation Notes:**
- Already have `getBookingsForPackage()` service method
- Add query parameters for filtering
- Include traveler basic info

**Frontend Impact:**
- Package performance page can show bookings
- Package availability page can check capacity

---

**e) Check Package Availability**
```typescript
GET /api/operator/packages/:id/availability
Response: {
  packageId: number
  capacity: number
  booked: number
  available: number
  isAvailable: boolean
  upcomingSeats: number (seats with pending bookings)
}
```

**Implementation Notes:**
- Calculate available vs booked slots
- Include pending bookings
- Frontend heavily uses this data

**Frontend Impact:**
- Availability page shows real-time capacity
- Package cards show accurate availability

---

### 2. Profile Module - Update Query to Body Parameter

**Priority:** MEDIUM  
**Effort:** Low (1 hour)

**Current Issue:**
Profile endpoints use `?operatorId=X` query parameter, but operator ID should come from JWT token.

**Required Changes:**
```typescript
// Current (using query parameter)
@Get()
async getProfile(@Query('operatorId', ParseIntPipe) operatorId: number)

// Should be (using JWT decorator)
@Get()
async getProfile(@CurrentOperator() operator: { id: number })
```

**Affected Endpoints:**
- GET `/operator/profile`
- PUT `/operator/profile`
- POST `/operator/profile/logo`
- GET `/operator/profile/verification-status`

**Implementation:**
- Use `@CurrentOperator()` decorator (already exists in codebase)
- Remove `operatorId` query parameter
- Extract from JWT token instead

**Frontend Impact:**
- Frontend doesn't need to pass operatorId
- More secure - can't access other operators' profiles

---

### 3. Analytics Module - Add Query Parameters

**Priority:** MEDIUM  
**Effort:** Low (2-3 hours)

**Current Limitation:**
Analytics endpoints don't accept date range or filter parameters.

**Required Enhancements:**

**a) Revenue Analytics**
```typescript
GET /api/operator/analytics/revenue?startDate=2024-01-01&endDate=2024-12-31&packageId=5
```

**b) Bookings Analytics**
```typescript
GET /api/operator/analytics/bookings?period=monthly&year=2024
```

**c) Popular Packages**
```typescript
GET /api/operator/analytics/popular-packages?limit=5&sortBy=revenue
```

**Frontend Impact:**
- Analytics page can filter by date range
- Custom report generation
- More flexible data visualization

---

## Missing Endpoints to Create

### 1. Dashboard Statistics API ❌ HIGH PRIORITY

**Endpoint:**
```typescript
GET /api/operator/dashboard/stats
```

**Response:**
```json
{
  "totalRevenue": 45000000,
  "totalBookings": 342,
  "outstandingBalance": 2150000,
  "visaSuccessRate": 98.5,
  "revenueChange": 12.5,
  "bookingsChange": 5.2,
  "balanceChange": -2.1,
  "activePackages": 4,
  "seatsFilled": 130,
  "totalSeats": 180,
  "revenueProjected": 52000000,
  "urgentTasksCount": 8,
  "pendingPaymentsCount": 15,
  "visasProcessed": 89,
  "visasPending": 53
}
```

**Why Needed:**
- Dashboard page currently uses hardcoded stats
- Needs real-time business metrics
- Go service has `/packages/home-aggregation` which is close but not exact match

**Implementation Approach:**
- **Option A:** Add to NestJS packages or create new dashboard module
- **Option B:** Use Go service `/packages/home-aggregation` and adapt frontend
- **Recommended:** Option B (Go service) for performance

**Frontend Impact:** `app/dashboard/page.tsx` line 10-23

---

### 2. Revenue Flow API ❌ HIGH PRIORITY

**Endpoint:**
```typescript
GET /api/operator/dashboard/revenue-flow
Query: ?months=6
```

**Response:**
```json
{
  "data": [
    { "month": "May", "revenue": 18000000, "expenses": 11700000 },
    { "month": "Jun", "revenue": 15000000, "expenses": 9750000 },
    { "month": "Jul", "revenue": 22000000, "expenses": 14300000 }
  ],
  "total": 154000000,
  "average": 25666667
}
```

**Why Needed:**
- Dashboard revenue chart needs monthly data
- Currently uses mockRevenueFlow
- Need historical trend analysis

**Implementation Approach:**
- Add to analytics module or create dashboard module
- Query transactions/bookings by month
- Calculate revenue and expenses

**Frontend Impact:** `app/dashboard/page.tsx` line 28-32, `components/revenue-chart.tsx`

---

### 3. Urgent Tasks API ❌ HIGH PRIORITY

**Endpoint:**
```typescript
GET /api/operator/dashboard/urgent-tasks
```

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "type": "visa_expiring",
      "title": "3 Visas expiring in 7 days",
      "description": "Review and process renewals urgently",
      "priority": "high",
      "count": 3,
      "dueDate": "2026-01-14",
      "actionUrl": "/dashboard/applicants?filter=visa-expiring"
    },
    {
      "id": 2,
      "type": "pending_payment",
      "title": "15 Pending Payments",
      "description": "Follow up on outstanding balances",
      "priority": "medium",
      "count": 15,
      "amount": 12500000,
      "actionUrl": "/dashboard/payments?status=pending"
    }
  ],
  "totalCount": 8
}
```

**Why Needed:**
- Dashboard urgent tasks widget is hardcoded
- Need actionable insights for operator
- Go service has `/bookings/pending` but needs enhancement

**Implementation Approach:**
- Aggregate from multiple sources:
  - Bookings with pending payments
  - Visas expiring soon
  - Documents needing review
  - Incomplete registrations

**Frontend Impact:** `components/urgent-tasks.tsx`

---

### 4. Recent Bookings API ❌ MEDIUM PRIORITY

**Endpoint:**
```typescript
GET /api/operator/dashboard/recent-bookings
Query: ?limit=5
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "APP-001",
      "name": "Ibrahim Musa",
      "passport": "A12345678",
      "package": "Hajj Premium 2024",
      "bookingDate": "2024-10-12",
      "status": "approved",
      "visaStatus": "processing",
      "paymentProgress": 75,
      "avatar": "https://..."
    }
  ]
}
```

**Why Needed:**
- Dashboard shows recent applicants
- Currently uses mockApplicants sliced
- Should show actual recent bookings

**Implementation Approach:**
- Use existing bookings endpoint with query
- `GET /operator/bookings?limit=5&sortBy=createdAt&order=DESC`
- May not need separate endpoint

**Frontend Impact:** `components/recent-applicants.tsx`, `app/dashboard/page.tsx` line 40-48

---

### 5. Payments Statistics API ❌ HIGH PRIORITY

**Endpoint:**
```typescript
GET /api/operator/payments/stats
```

**Response:**
```json
{
  "totalRevenue": 154000000,
  "revenueChange": 12,
  "totalDeposits": 45000000,
  "depositsChange": 5,
  "pendingBalance": 12500000,
  "paymentsDue": 85,
  "successRate": 98,
  "successChange": 1,
  "revenueFlow": [
    { "month": "May", "revenue": 18000000 },
    { "month": "Jun", "revenue": 15000000 }
  ],
  "paymentTypes": [
    { "category": "Full Hajj Payment", "amount": 100100000, "percentage": 65 },
    { "category": "Initial Deposits", "amount": 38500000, "percentage": 25 }
  ]
}
```

**Why Needed:**
- Payments page needs comprehensive financial stats
- Currently uses mockPaymentStats, mockRevenueFlow, mockPaymentTypes
- Critical for financial dashboard

**Implementation Approach:**
- Go service has `/payments/highload` which might suffice
- Or add to wallet module in NestJS
- Aggregate from bookings and transactions

**Frontend Impact:** `app/dashboard/payments/page.tsx` entire page

---

### 6. Recent Transactions API ❌ MEDIUM PRIORITY

**Endpoint:**
```typescript
GET /api/operator/payments/transactions/recent
Query: ?limit=20&status=paid&search=Ibrahim
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "TXN-9921",
      "applicant": "Ibrahim Musa",
      "applicantId": "HAJJ-24-001",
      "package": "Hajj Premium 2024",
      "date": "2024-10-24",
      "amount": 2500000,
      "status": "paid",
      "method": "Bank Transfer",
      "avatar": "https://..."
    }
  ],
  "total": 1248,
  "page": 1,
  "pageSize": 20
}
```

**Why Needed:**
- Payments page transaction table
- Currently uses mockRecentTransactions
- Need search and filtering

**Implementation Approach:**
- Could extend wallet `/transactions` endpoint
- Add query parameters for filtering
- Include applicant and package info

**Frontend Impact:** `app/dashboard/payments/page.tsx` transaction table section

---

### 7. Communications History API ❌ HIGH PRIORITY

**Endpoint:**
```typescript
GET /api/operator/communications/history
Query: ?page=1&limit=5&channel=email&status=delivered
```

**Response:**
```json
{
  "communications": [
    {
      "id": 101,
      "timestamp": "2023-12-12T10:45:00Z",
      "applicant": {
        "name": "Ibrahim Musa",
        "passport": "A12345678"
      },
      "subject": "Visa Approval Confirmed",
      "channel": "email",
      "status": "delivered",
      "sentBy": "Ahmed Bello"
    }
  ],
  "stats": {
    "totalSentToday": 145,
    "deliveryRate": 94.5,
    "failedMessages": 8
  },
  "pagination": {
    "total": 1248,
    "page": 1,
    "pageSize": 5,
    "totalPages": 250
  }
}
```

**Why Needed:**
- Communications history page exists but has no data source
- Audit trail for compliance
- Monitor delivery success

**Implementation Approach:**
- Create new communications module in NestJS
- Store sent messages in database
- Track delivery status from email/SMS providers

**Frontend Impact:** `app/dashboard/communications/history/page.tsx`

---

### 8. Package Performance Metrics API ❌ MEDIUM PRIORITY

**Endpoint:**
```typescript
GET /api/operator/packages/:id/performance
```

**Response:**
```json
{
  "packageId": 1,
  "title": "Hajj Premium 2024",
  "bookingRate": 90,
  "totalRevenue": 202500000,
  "averagePaymentTime": 45,
  "conversionRate": 78,
  "topSourceChannels": [
    { "channel": "Website", "bookings": 30, "percentage": 66.7 },
    { "channel": "Agent Referral", "bookings": 10, "percentage": 22.2 }
  ],
  "revenueByMonth": [
    { "month": "Jan", "revenue": 45000000 },
    { "month": "Feb", "revenue": 67500000 }
  ],
  "bookingTrend": [
    { "week": "Week 1", "bookings": 8 },
    { "week": "Week 2", "bookings": 12 }
  ]
}
```

**Why Needed:**
- Package performance page shows detailed analytics
- Currently empty/hardcoded
- Operators need per-package insights

**Implementation Approach:**
- Add to analytics module
- Query bookings, payments for specific package
- Calculate conversion and performance metrics

**Frontend Impact:** `app/dashboard/packages/performance/page.tsx`

---

### 9. Package Availability Calendar API ❌ MEDIUM PRIORITY

**Endpoint:**
```typescript
GET /api/operator/packages/:id/availability/calendar
Query: ?startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "packageId": 1,
  "capacity": 50,
  "currentBooked": 45,
  "available": 5,
  "calendar": [
    {
      "date": "2024-06-10",
      "departures": 1,
      "bookings": 45,
      "status": "nearly_full"
    }
  ],
  "upcomingDepartures": [
    {
      "date": "2024-06-10",
      "booked": 45,
      "pending": 3,
      "confirmed": 42
    }
  ]
}
```

**Why Needed:**
- Package availability page needs calendar view
- Seat management
- Prevent overbooking

**Implementation Approach:**
- Query package bookings grouped by date
- Calculate availability per departure
- Include pending vs confirmed bookings

**Frontend Impact:** `app/dashboard/packages/[id]/availability/page.tsx`

---

### 10. Applicant Detail Complete API ❌ MEDIUM PRIORITY

**Current:** `GET /api/operator/bookings/:id` (exists but may need more data)

**Enhancement Needed:**
Include complete traveler profile with documents, payment history, visa details.

**Response:**
```json
{
  "id": "APP-001",
  "personalInfo": {
    "name": "Ibrahim Musa",
    "passport": "A12345678",
    "email": "i.musa@example.com",
    "phone": "+234 803 555 1234",
    "dateOfBirth": "1978-05-15",
    "nationality": "Nigerian",
    "gender": "Male"
  },
  "booking": {
    "id": "BK-2024-8901",
    "package": "Hajj Standard '24",
    "bookingDate": "2023-10-12",
    "status": "approved"
  },
  "visa": {
    "status": "processing",
    "applicationDate": "2023-10-15",
    "expectedDate": "2024-01-10"
  },
  "payment": {
    "totalAmount": 4500000,
    "amountPaid": 3500000,
    "balance": 1000000,
    "progress": 75,
    "transactions": [
      {
        "id": "TXN-8821",
        "date": "2023-10-12",
        "amount": 1500000,
        "method": "Bank Transfer",
        "status": "paid"
      }
    ],
    "nextPaymentDue": "2024-01-01",
    "nextPaymentAmount": 1000000
  },
  "documents": [
    {
      "id": "DOC-001",
      "name": "Passport Scan.pdf",
      "type": "passport",
      "size": "2.4 MB",
      "uploadedAt": "2023-10-13",
      "status": "verified"
    }
  ]
}
```

**Why Needed:**
- Applicant detail page shows comprehensive info
- Payment tracking, document verification
- Complete traveler management

**Implementation Approach:**
- Enhance existing `/bookings/:id` endpoint
- Include related entities (user, package, transactions, documents)
- May already be implemented - need to verify response structure

**Frontend Impact:** `app/dashboard/applicants/[id]/page.tsx`

---

### 11. Applicant Payment History API ❌ LOW PRIORITY

**Endpoint:**
```typescript
GET /api/operator/applicants/:id/payments
```

**Response:**
```json
{
  "applicantId": "APP-001",
  "totalAmount": 4500000,
  "amountPaid": 3500000,
  "balance": 1000000,
  "transactions": [
    {
      "id": "TXN-8821",
      "date": "2023-10-12",
      "description": "Installment #2",
      "method": "GTBank Transfer",
      "amount": 500000,
      "status": "paid",
      "receiptUrl": "/receipts/TXN-8821.pdf"
    }
  ],
  "paymentPlan": {
    "installments": 3,
    "completed": 2,
    "remaining": 1,
    "nextDueDate": "2024-01-01",
    "nextDueAmount": 1000000
  }
}
```

**Why Needed:**
- Applicant payment tab shows transaction history
- Currently uses mockTransactions
- Track payment installments

**Implementation Approach:**
- Could be part of enhanced `/bookings/:id` endpoint
- Or separate endpoint for cleaner separation
- Query transactions by booking/applicant ID

**Frontend Impact:** `app/dashboard/applicants/[id]/payments/page.tsx`

---

### 12. Settings Update APIs ❌ LOW PRIORITY

**Multiple Endpoints for Settings Sections:**

**a) Update Theme/Preferences**
```typescript
PUT /api/operator/settings/preferences
Body: {
  theme: 'dark' | 'light' | 'system'
  language: 'en' | 'ar'
  notifications: {
    weeklyReports: boolean
    newApplicants: boolean
    paymentConfirmations: boolean
    visaUpdates: boolean
  }
}
```

**b) Update Security Settings**
```typescript
PUT /api/operator/settings/security
Body: {
  currentPassword: string
  newPassword: string
}
```

**c) Enable 2FA**
```typescript
POST /api/operator/settings/security/2fa/enable
POST /api/operator/settings/security/2fa/verify
DELETE /api/operator/settings/security/2fa/disable
```

**Why Needed:**
- Settings page has forms but no save functionality
- User preferences should persist

**Implementation Approach:**
- Add to profile module or create settings module
- Store preferences in operator entity or separate table
- Use JWT refresh for security changes

**Frontend Impact:** `app/dashboard/settings/page.tsx`, `app/dashboard/settings/preferences/page.tsx`

---

### 13. Reports & Export APIs ❌ LOW PRIORITY

**Endpoints:**
```typescript
GET /api/operator/reports/bookings?format=csv&startDate=2024-01-01&endDate=2024-12-31
GET /api/operator/reports/payments?format=excel
GET /api/operator/reports/applicants?format=pdf&packageId=5
```

**Why Needed:**
- Export buttons in Payments, Applicants, Packages pages
- Compliance and record-keeping
- Financial reporting

**Implementation Approach:**
- Create reports module
- Use libraries: `csv-writer`, `exceljs`, `pdfkit`
- Generate files on-demand or background job

**Frontend Impact:** Multiple pages have "Export" buttons

---

## Implementation Priority Matrix

### Priority Levels
- 🔴 **CRITICAL:** Blocks core functionality
- 🟠 **HIGH:** Essential for operators
- 🟡 **MEDIUM:** Improves UX significantly
- 🟢 **LOW:** Nice-to-have features

---

### Phase 1: Foundation (Week 1-2) 🔴 CRITICAL

| Task | Type | Effort | Priority | Endpoints Affected |
|------|------|--------|----------|-------------------|
| Dashboard Stats | Create | Medium | CRITICAL | `/dashboard/stats`, `/dashboard/revenue-flow`, `/dashboard/urgent-tasks` |
| Package CRUD Complete | Update | Medium | CRITICAL | `/packages/:id` PUT/DELETE, `/packages/:id/status` PATCH |
| Payment Stats | Create | Medium | HIGH | `/payments/stats`, `/payments/transactions/recent` |
| Fix Profile Query Params | Update | Low | HIGH | All `/profile` endpoints |

**Deliverables:**
- Dashboard shows real data
- Packages fully manageable (CRUD)
- Payments page functional
- Profile API secure

---

### Phase 2: Core Features (Week 3-4) 🟠 HIGH

| Task | Type | Effort | Priority | Endpoints Affected |
|------|------|--------|----------|-------------------|
| Communications History | Create | High | HIGH | `/communications/history` |
| Package Performance | Create | Medium | MEDIUM | `/packages/:id/performance` |
| Package Availability | Create | Medium | MEDIUM | `/packages/:id/availability/calendar` |
| Analytics Enhancements | Update | Low | MEDIUM | Add query params to `/analytics/*` |

**Deliverables:**
- Communications tracking works
- Package insights available
- Availability management
- Flexible analytics

---

### Phase 3: Enhancement (Week 5-6) 🟡 MEDIUM

| Task | Type | Effort | Priority | Endpoints Affected |
|------|------|--------|----------|-------------------|
| Complete Applicant Details | Update | Medium | MEDIUM | Enhance `/bookings/:id` |
| Settings APIs | Create | Medium | LOW | `/settings/*` endpoints |
| Reports & Export | Create | High | LOW | `/reports/*` endpoints |
| 2FA Implementation | Create | High | LOW | `/settings/security/2fa/*` |

**Deliverables:**
- Rich traveler profiles
- Persistent settings
- Export functionality
- Enhanced security

---

## Detailed Implementation Plan

### Backend Updates Required

#### 1. Packages Module Enhancement

**File:** `backend/betasafar-operator-api/src/packages/packages.controller.ts`

**Add Missing Routes:**

```typescript
@Put(':id')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('images'))
async updatePackage(
  @Param('id', ParseIntPipe) id: number,
  @CurrentOperator() operator: { id: number },
  @Body() dto: UpdatePackageDto,
  @UploadedFiles() files?: Express.Multer.File[],
) {
  return this.packagesService.update(id, operator.id, dto, files);
}

@Delete(':id')
@UseGuards(JwtAuthGuard)
async deletePackage(
  @Param('id', ParseIntPipe) id: number,
  @CurrentOperator() operator: { id: number },
) {
  return this.packagesService.delete(id, operator.id);
}

@Patch(':id/status')
@UseGuards(JwtAuthGuard)
async toggleStatus(
  @Param('id', ParseIntPipe) id: number,
  @CurrentOperator() operator: { id: number },
  @Body() body: { status: PackageStatus },
) {
  return this.packagesService.toggleStatus(id, operator.id, body.status);
}

@Get(':id/bookings')
@UseGuards(JwtAuthGuard)
async getPackageBookings(
  @Param('id', ParseIntPipe) id: number,
  @CurrentOperator() operator: { id: number },
  @Query('status') status?: string,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
) {
  return this.packagesService.getBookingsForPackage(id, operator.id, { status, limit });
}

@Get(':id/availability')
@UseGuards(JwtAuthGuard)
async checkAvailability(
  @Param('id', ParseIntPipe) id: number,
  @CurrentOperator() operator: { id: number },
) {
  const pkg = await this.packagesService.findOne(id, operator.id);
  return {
    packageId: pkg.id,
    capacity: pkg.capacity,
    booked: pkg.bookedSlots,
    available: pkg.capacity - pkg.bookedSlots,
    isAvailable: pkg.bookedSlots < pkg.capacity,
    status: pkg.status,
  };
}
```

**Service Layer Updates Needed:**
- `update()` - Already exists, may need to handle file uploads
- `delete()` - Already exists
- `toggleStatus()` - Already exists
- `getBookingsForPackage()` - Already exists, add filtering
- New: `checkAvailability()` - Calculate availability logic

---

#### 2. Dashboard Module Creation

**New File:** `backend/betasafar-operator-api/src/dashboard/dashboard.module.ts`

**Create Dashboard Module with endpoints:**

```typescript
@Controller('operator/dashboard')
export class DashboardController {
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@CurrentOperator() operator: { id: number }) {
    // Aggregate stats from multiple services
    const bookings = await this.bookingsService.getStatsForOperator(operator.id);
    const payments = await this.paymentsService.getStatsForOperator(operator.id);
    const packages = await this.packagesService.getStatsForOperator(operator.id);
    
    return {
      totalRevenue: payments.totalRevenue,
      totalBookings: bookings.total,
      outstandingBalance: payments.outstanding,
      visaSuccessRate: bookings.visaSuccessRate,
      activePackages: packages.activeCount,
      seatsFilled: packages.totalBooked,
      totalSeats: packages.totalCapacity,
      // ... more stats
    };
  }

  @Get('revenue-flow')
  @UseGuards(JwtAuthGuard)
  async getRevenueFlow(
    @CurrentOperator() operator: { id: number },
    @Query('months', new DefaultValuePipe(6), ParseIntPipe) months: number,
  ) {
    // Query transactions grouped by month
    return this.paymentsService.getRevenueFlowByMonth(operator.id, months);
  }

  @Get('urgent-tasks')
  @UseGuards(JwtAuthGuard)
  async getUrgentTasks(@CurrentOperator() operator: { id: number }) {
    // Aggregate urgent items from multiple sources
    const tasks = [];
    
    // Check visa expirations
    const expiringVisas = await this.bookingsService.getExpiringVisas(operator.id);
    if (expiringVisas.length > 0) {
      tasks.push({
        type: 'visa_expiring',
        count: expiringVisas.length,
        priority: 'high',
        // ...
      });
    }
    
    // Check pending payments
    const pendingPayments = await this.paymentsService.getPendingPayments(operator.id);
    if (pendingPayments.length > 0) {
      tasks.push({
        type: 'pending_payment',
        count: pendingPayments.length,
        priority: 'medium',
        // ...
      });
    }
    
    return { tasks, totalCount: tasks.length };
  }

  @Get('recent-bookings')
  @UseGuards(JwtAuthGuard)
  async getRecentBookings(
    @CurrentOperator() operator: { id: number },
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.bookingsService.findRecent(operator.id, limit);
  }
}
```

**Dependencies:**
- Inject existing services (bookings, payments, packages)
- Create helper methods in services for aggregation
- Optimize with database queries (avoid N+1)

---

#### 3. Payments Statistics

**Option A:** Add to Wallet Module
```typescript
// File: backend/betasafar-operator-api/src/wallet/wallet.controller.ts

@Get('stats')
@UseGuards(JwtAuthGuard)
async getPaymentStats(@CurrentOperator() operator: { id: number }) {
  return this.walletService.getPaymentStatistics(operator.id);
}
```

**Option B:** Use Go Service (Recommended)
The Go service already has `/payments/highload` endpoint. Frontend should use this directly.

**Service Implementation:**
```typescript
// File: backend/betasafar-operator-api/src/wallet/wallet.service.ts

async getPaymentStatistics(operatorId: number) {
  // Query all transactions for operator
  const transactions = await this.getTransactionsForOperator(operatorId);
  
  // Calculate stats
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const paidTransactions = transactions.filter(t => t.status === 'paid');
  const successRate = (paidTransactions.length / transactions.length) * 100;
  
  // Revenue flow by month
  const revenueFlow = this.groupTransactionsByMonth(transactions);
  
  // Payment type breakdown
  const paymentTypes = this.categorizePayments(transactions);
  
  return {
    totalRevenue,
    successRate,
    revenueFlow,
    paymentTypes,
    // ... more stats
  };
}
```

---

#### 4. Communications History Module

**New Module:** `backend/betasafar-operator-api/src/communications/communications.module.ts`

**Create Entity:**
```typescript
// File: backend/betasafar-operator-api/src/communications/entities/communication.entity.ts

@Entity('communications')
export class Communication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operatorId: number;

  @Column({ nullable: true })
  bookingId: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column()
  channel: 'email' | 'sms' | 'whatsapp' | 'push';

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'delivered' | 'failed';

  @Column({ nullable: true })
  sentBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  failureReason: string;
}
```

**Controller:**
```typescript
@Controller('operator/communications')
export class CommunicationsController {
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(
    @CurrentOperator() operator: { id: number },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('channel') channel?: string,
    @Query('status') status?: string,
  ) {
    const [communications, total] = await this.communicationsService.findAll(
      operator.id,
      { page, limit, channel, status },
    );
    
    const stats = await this.communicationsService.getStats(operator.id);
    
    return {
      communications,
      stats,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

**Integration with Notifications:**
When a broadcast is sent via `/notifications/broadcast`, also log it in the communications table.

---

#### 5. Profile Module Security Fix

**Current Issue:** Uses query parameters for operator ID
**Solution:** Use JWT token and `@CurrentOperator()` decorator

**File:** `backend/betasafar-operator-api/src/profile/profile.controller.ts`

**Changes:**
```typescript
// BEFORE
@Get()
async getProfile(@Query('operatorId', ParseIntPipe) operatorId: number) {
  return this.profileService.getProfile(operatorId);
}

// AFTER
@Get()
@UseGuards(JwtAuthGuard)  // Ensure JWT guard is applied
async getProfile(@CurrentOperator() operator: { id: number }) {
  return this.profileService.getProfile(operator.id);
}
```

**Apply to all profile endpoints:**
- GET `/operator/profile`
- PUT `/operator/profile`
- POST `/operator/profile/logo`
- GET `/operator/profile/verification-status`

---

### Frontend Integration Steps

#### 1. Replace Dashboard Mock Data

**File:** `app/dashboard/page.tsx`

**Current Implementation:**
```typescript
// Using mock data
const stats: DashboardStats = {
  totalRevenue: 45000000,
  totalBookings: 342,
  // ... hardcoded
}
```

**Updated Implementation:**
```typescript
async function getDashboardData() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  // Use Go service for performance
  const statsRes = await fetch(
    `${process.env.BACKEND_API_URL}/packages/home-aggregation`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  
  if (!statsRes.ok) {
    // Fallback to mock data on error
    return { stats: mockStats, revenueData: mockRevenueFlow, ... }
  }
  
  const stats = await statsRes.json()
  
  // Get revenue flow
  const revenueRes = await fetch(
    `${process.env.BACKEND_API_URL}/dashboard/revenue-flow?months=6`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  
  const revenueData = revenueRes.ok ? await revenueRes.json() : mockRevenueFlow
  
  // Get recent bookings
  const bookingsRes = await fetch(
    `${process.env.BACKEND_API_URL}/operator/bookings?limit=5&sortBy=createdAt&order=DESC`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  
  const recentBookings = bookingsRes.ok ? await bookingsRes.json() : mockApplicants.slice(0, 5)
  
  return { stats, revenueData, recentBookings, operator }
}
```

**Error Handling Pattern:**
- Try to fetch from API
- If fails (404, 500, etc.), fall back to mock data
- Log errors for debugging
- Show warning banner if using mock data

---

#### 2. Replace Packages Page Mock Data

**File:** `app/dashboard/packages/page.tsx`

**Current Implementation:**
```typescript
async function getPackagesData() {
  const packages: Package[] = mockPackages
  // ...
}
```

**Updated Implementation:**
```typescript
async function getPackagesData() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/packages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Get fresh data
      }
    )
    
    if (!res.ok) {
      throw new Error('Failed to fetch packages')
    }
    
    const packages = await res.json()
    
    // Calculate stats from packages
    const stats = calculatePackageStats(packages)
    
    return { packages, stats }
  } catch (error) {
    console.error('[v0] Failed to fetch packages:', error)
    // Fallback to mock data
    return { packages: mockPackages, stats: mockStats }
  }
}

function calculatePackageStats(packages: Package[]) {
  return {
    activePackages: packages.filter(p => p.status === 'active').length,
    seatsFilled: packages.reduce((sum, p) => sum + p.booked, 0),
    totalSeats: packages.reduce((sum, p) => sum + p.capacity, 0),
    totalRevenue: packages.reduce((sum, p) => sum + (p.price * p.booked), 0),
    // ...
  }
}
```

---

#### 3. Replace Applicants/Travelers Page Mock Data

**File:** `app/dashboard/applicants/page.tsx`

**Current Implementation:**
```typescript
// Directly using mockApplicants
{mockApplicants.map((applicant) => (
  <TableRow key={applicant.id}>
```

**Updated Implementation:**
```typescript
async function getApplicantsData() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    )
    
    if (!res.ok) {
      throw new Error('Failed to fetch bookings')
    }
    
    const bookings = await res.json()
    
    // Map bookings to applicant format
    const applicants = bookings.map(mapBookingToApplicant)
    
    return { applicants }
  } catch (error) {
    console.error('[v0] Failed to fetch applicants:', error)
    return { applicants: mockApplicants }
  }
}

function mapBookingToApplicant(booking: any) {
  return {
    id: booking.id,
    name: booking.pilgrimName,
    passport: booking.user?.passportNumber || 'N/A',
    email: booking.pilgrimEmail,
    phone: booking.pilgrimPhone,
    bookingId: `BK-${booking.id}`,
    bookingDate: formatDate(booking.createdAt),
    package: booking.package?.title || 'N/A',
    packageId: booking.packageId,
    status: booking.status,
    visaStatus: booking.visaStatus || 'pending',
    paymentProgress: Math.round((booking.amountPaid / booking.totalAmount) * 100),
    amountPaid: booking.amountPaid,
    totalAmount: booking.totalAmount,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.pilgrimName}`,
  }
}
```

---

#### 4. Replace Payments Page Mock Data

**File:** `app/dashboard/payments/page.tsx`

**Updated Implementation:**
```typescript
async function getPaymentsData() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  try {
    // Get payment stats from Go service
    const statsRes = await fetch(
      `${process.env.BACKEND_API_URL}/payments/highload`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    
    const stats = statsRes.ok ? await statsRes.json() : mockPaymentStats
    
    // Get recent transactions
    const txnsRes = await fetch(
      `${process.env.BACKEND_API_URL}/operator/wallet/transactions?limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    
    const transactions = txnsRes.ok ? await txnsRes.json() : mockRecentTransactions
    
    return { stats, transactions }
  } catch (error) {
    console.error('[v0] Failed to fetch payment data:', error)
    return { 
      stats: mockPaymentStats, 
      transactions: mockRecentTransactions 
    }
  }
}
```

---

#### 5. Connect Communications Page

**File:** `app/dashboard/communications/page.tsx`

**Add Broadcast Handler:**
```typescript
"use client"

export default function CommunicationsPage() {
  const [loading, setLoading] = useState(false)
  
  async function handleBroadcast(data: BroadcastFormData) {
    setLoading(true)
    
    try {
      const res = await fetch('/api/communications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: data.packageId,
          title: data.subject,
          message: data.message,
        }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to send broadcast')
      }
      
      const result = await res.json()
      
      // Show success message
      toast.success(`Broadcast sent to ${result.sentCount} travelers`)
      
      // Clear form
      // ...
    } catch (error) {
      console.error('[v0] Broadcast failed:', error)
      toast.error('Failed to send broadcast')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    // ... form with onSubmit={handleBroadcast}
  )
}
```

**Create API Route:**
```typescript
// File: app/api/communications/broadcast/route.ts

export async function POST(request: Request) {
  const cookies = await request.cookies
  const token = cookies.get('auth_token')?.value
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/notifications/broadcast`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    
    if (!res.ok) {
      const error = await res.json()
      return Response.json({ error: error.message }, { status: res.status })
    }
    
    const result = await res.json()
    
    return Response.json(result)
  } catch (error) {
    console.error('[v0] Broadcast API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

#### 6. Connect Settings Page

**File:** `app/dashboard/settings/page.tsx`

**Make it Client Component and Add Handlers:**
```typescript
"use client"

import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('[v0] Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [])
  
  async function handleUpdateProfile(formData: FormData) {
    setLoading(true)
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.get('agencyName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
        }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to update profile')
      }
      
      const updated = await res.json()
      setProfile(updated)
      
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('[v0] Profile update failed:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  
  async function handleUploadLogo(file: File) {
    const formData = new FormData()
    formData.append('logo', file)
    
    try {
      const res = await fetch('/api/profile/logo', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) {
        throw new Error('Failed to upload logo')
      }
      
      const updated = await res.json()
      setProfile(updated)
      
      toast.success('Logo updated successfully')
    } catch (error) {
      console.error('[v0] Logo upload failed:', error)
      toast.error('Failed to upload logo')
    }
  }
  
  // ... render form with profile data and handlers
}
```

**Create API Routes:**
```typescript
// File: app/api/profile/route.ts

export async function GET(request: Request) {
  const cookies = await request.cookies
  const token = cookies.get('auth_token')?.value
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/profile`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
    
    if (!res.ok) {
      throw new Error('Failed to fetch profile')
    }
    
    const profile = await res.json()
    
    return Response.json(profile)
  } catch (error) {
    console.error('[v0] Profile API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const cookies = await request.cookies
  const token = cookies.get('auth_token')?.value
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/profile`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    
    if (!res.ok) {
      const error = await res.json()
      return Response.json({ error: error.message }, { status: res.status })
    }
    
    const profile = await res.json()
    
    return Response.json(profile)
  } catch (error) {
    console.error('[v0] Profile update error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

```typescript
// File: app/api/profile/logo/route.ts

export async function POST(request: Request) {
  const cookies = await request.cookies
  const token = cookies.get('auth_token')?.value
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const formData = await request.formData()
  
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/operator/profile/logo`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    )
    
    if (!res.ok) {
      const error = await res.json()
      return Response.json({ error: error.message }, { status: res.status })
    }
    
    const profile = await res.json()
    
    return Response.json(profile)
  } catch (error) {
    console.error('[v0] Logo upload error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

### Testing Strategy

#### 1. Backend Testing

**Unit Tests:**
- Test each service method independently
- Mock database calls
- Test edge cases (empty data, large datasets)

**Integration Tests:**
- Test API endpoints with real database
- Verify authentication/authorization
- Test error handling

**Example Test (Jest):**
```typescript
// File: backend/betasafar-operator-api/src/dashboard/dashboard.controller.spec.ts

describe('DashboardController', () => {
  let controller: DashboardController;
  let mockBookingsService: jest.Mocked<BookingsService>;

  beforeEach(async () => {
    mockBookingsService = {
      getStatsForOperator: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const operator = { id: 1 };
      mockBookingsService.getStatsForOperator.mockResolvedValue({
        total: 342,
        visaSuccessRate: 98.5,
      });

      const result = await controller.getStats(operator);

      expect(result).toHaveProperty('totalBookings', 342);
      expect(result).toHaveProperty('visaSuccessRate', 98.5);
      expect(mockBookingsService.getStatsForOperator).toHaveBeenCalledWith(1);
    });
  });
});
```

---

#### 2. Frontend Testing

**Component Tests:**
- Test component rendering with mock data
- Test user interactions (button clicks, form submissions)
- Test error states

**Integration Tests:**
- Test API integration with MSW (Mock Service Worker)
- Test authentication flow
- Test data fetching and display

**Example Test (React Testing Library):**
```typescript
// File: app/dashboard/__tests__/page.test.tsx

import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '../page'
import { mockStats } from '@/lib/mock-data'

// Mock fetch
global.fetch = jest.fn()

describe('DashboardPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  it('displays dashboard stats', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats,
    })

    render(await DashboardPage())

    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
      expect(screen.getByText('₦45M')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(await DashboardPage())

    await waitFor(() => {
      // Should still render with mock data
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
    })
  })
})
```

---

### Deployment Checklist

#### Backend Deployment

- [ ] **Database Migrations**
  - Run all new migrations (communications, settings tables)
  - Backup production database before migration
  - Test rollback procedure

- [ ] **Environment Variables**
  - Set `DATABASE_URL`
  - Set `JWT_SECRET`
  - Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - Set email/SMS provider credentials
  - Verify all required env vars are set

- [ ] **NestJS Service**
  - Build production bundle: `npm run build`
  - Run production server: `npm run start:prod`
  - Configure NGINX to route `/api/operator/*` to NestJS
  - Enable CORS for frontend domain
  - Set up SSL/HTTPS
  - Configure logging and monitoring

- [ ] **Go Service**
  - Build binary: `go build -o operator-service`
  - Configure NGINX to route high-load endpoints to Go
  - Set up connection to same database
  - Test load balancing between NestJS and Go

- [ ] **NGINX Gateway**
  - Configure routing rules
  - Set up load balancing
  - Enable gzip compression
  - Configure caching for static assets
  - Set request timeouts

#### Frontend Deployment

- [ ] **Environment Variables**
  - Set `BACKEND_API_URL` in Vercel
  - Set `NEXT_PUBLIC_SITE_URL`
  - Verify all required env vars

- [ ] **Build & Deploy**
  - Test production build locally: `npm run build`
  - Deploy to Vercel
  - Verify environment variables are loaded
  - Test authentication flow in production

- [ ] **Monitoring**
  - Set up error tracking (Sentry)
  - Configure analytics
  - Monitor API response times
  - Set up uptime monitoring

---

## Summary

### What We Have ✅
- **Authentication:** Full login/logout/register flow
- **Bookings:** List, detail, payment adjustment
- **Notifications:** Get, mark read, broadcast
- **Profile:** Get, update, logo upload, verification status
- **Packages:** Create, list, get detail (basic CRUD)
- **Analytics:** Revenue, bookings, popular packages, trends
- **Wallet:** Balance, transactions, payout
- **Bank Accounts:** Add, list

### What Needs Updates ⚠️
1. **Packages:** Add PUT, DELETE, status toggle, bookings list, availability
2. **Profile:** Remove query params, use JWT token
3. **Analytics:** Add query parameters for filtering

### What's Missing ❌
1. **Dashboard Stats:** Aggregated metrics for dashboard
2. **Revenue Flow:** Monthly revenue data
3. **Urgent Tasks:** Action items for operator
4. **Recent Bookings:** Latest travelers
5. **Payment Stats:** Financial dashboard data
6. **Recent Transactions:** Payment history
7. **Communications History:** Sent messages log
8. **Package Performance:** Per-package analytics
9. **Package Availability:** Capacity management
10. **Complete Applicant Details:** Full traveler profile
11. **Settings APIs:** Save preferences, security
12. **Reports & Export:** CSV/Excel/PDF generation

### Implementation Roadmap

**Phase 1 (Week 1-2):** Foundation
- Dashboard Stats ✓
- Package CRUD Complete ✓
- Payment Stats ✓
- Fix Profile Security ✓

**Phase 2 (Week 3-4):** Core Features
- Communications History ✓
- Package Performance ✓
- Package Availability ✓
- Analytics Enhancements ✓

**Phase 3 (Week 5-6):** Enhancement
- Complete Applicant Details ✓
- Settings APIs ✓
- Reports & Export ✓
- 2FA Implementation ✓

### Next Steps
1. Review and approve this analysis
2. Prioritize endpoints based on business needs
3. Create GitHub issues for each task
4. Begin Phase 1 implementation
5. Test each endpoint as it's completed
6. Integrate with frontend incrementally

---

**Document Version:** 1.0  
**Last Updated:** January 7, 2026  
**Prepared By:** v0 AI Assistant  
**For:** TravelOps Operator System Team
