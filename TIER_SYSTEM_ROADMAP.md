# UfitGo Operator Tier System Implementation Roadmap

## Design Principles

1. **Enable fast onboarding without sacrificing trust**
2. **Every restriction must be enforceable at the backend level**
3. **Adjustable as the platform matures**

---

## Phase 1: Database Foundation (Week 1)

### 1.1 Extend Operator Entity

**File:** `backend/src/operators/entities/operator.entity.ts`

```typescript
// New fields to add
tier: OperatorTier // ENUM: BRONZE, SILVER, GOLD
verificationStatus: VerificationStatus // ENUM: pending, under_review, approved, rejected, suspended
trustScore: number // 0-100, calculated based on performance
completedTrips: number // Auto-incremented
totalPilgrims: number // Auto-incremented
joinedAt: Date
verifiedAt: Date | null
suspendedAt: Date | null
suspensionReason: string | null

// Compliance tracking
licenseNumber: string | null
licenseExpiryDate: Date | null
escrowAccountStatus: EscrowStatus // ENUM: not_required, pending, active, suspended
```

**Indexes to create:**
- `tier` + `verificationStatus` (for fast filtering)
- `trustScore` (for ranking)
- `licenseExpiryDate` (for compliance checks)

### 1.2 Create Document Management Entity

**File:** `backend/src/operators/entities/operator-document.entity.ts`

```typescript
OperatorDocument {
  id: number
  operatorId: number
  documentType: DocumentType // ENUM: license, cac, passport, logo
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  status: DocumentStatus // ENUM: pending, approved, rejected
  uploadedAt: Date
  reviewedAt: Date | null
  reviewedBy: number | null // Admin ID
  rejectionReason: string | null
  expiryDate: Date | null // For licenses
}
```

### 1.3 Create Trust Badge Entity

**File:** `backend/src/operators/entities/operator-badge.entity.ts`

```typescript
OperatorBadge {
  id: number
  operatorId: number
  badgeType: BadgeType // ENUM: verified_license, cac_registered, escrow_active, top_rated, fast_response
  awardedAt: Date
  expiresAt: Date | null
  isVisible: boolean
}
```

### 1.4 Create Tier Configuration Entity

**File:** `backend/src/config/entities/tier-config.entity.ts`

```typescript
TierConfiguration {
  id: number
  tier: OperatorTier
  maxBookingsPerMonth: number | null
  maxPilgrimsPerBooking: number | null
  escrowRequired: boolean
  escrowPercentage: number
  verificationRequired: boolean
  featuredInSearch: boolean
  customBranding: boolean
  updatedAt: Date
  updatedBy: number // Admin ID
}
```

**Default values:**
```
BRONZE: { maxBookingsPerMonth: 50, maxPilgrimsPerBooking: 100, escrowRequired: true, escrowPercentage: 100 }
SILVER: { maxBookingsPerMonth: 200, maxPilgrimsPerBooking: 500, escrowRequired: false }
GOLD: { maxBookingsPerMonth: null, maxPilgrimsPerBooking: null, escrowRequired: false }
```

---

## Phase 2: Backend Enforcement Layer (Week 2)

### 2.1 Create Tier Guard Middleware

**File:** `backend/src/common/guards/tier.guard.ts`

```typescript
@Injectable()
export class TierGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Extract operator from request
    // Check tier restrictions
    // Enforce limits based on TierConfiguration
    // Return true/false with detailed error messages
  }
}
```

### 2.2 Create Booking Limit Service

**File:** `backend/src/operators/services/tier-restriction.service.ts`

**Methods:**
- `canCreateBooking(operatorId): Promise<{ allowed: boolean, reason?: string }>`
- `getCurrentMonthBookings(operatorId): Promise<number>`
- `getRemainingBookingSlots(operatorId): Promise<number>`
- `canAcceptPilgrims(operatorId, pilgrimCount): Promise<boolean>`
- `checkEscrowRequirement(operatorId): Promise<{ required: boolean, percentage: number }>`

### 2.3 Update Booking Creation Logic

**File:** `backend/src/bookings/bookings.service.ts`

**Add checks before creating booking:**
```typescript
async create(createBookingDto) {
  // 1. Check operator tier restrictions
  const canBook = await this.tierRestrictionService.canCreateBooking(operatorId)
  if (!canBook.allowed) {
    throw new ForbiddenException(canBook.reason)
  }
  
  // 2. Check pilgrim count limits
  const canAccept = await this.tierRestrictionService.canAcceptPilgrims(operatorId, pilgrimCount)
  if (!canAccept) {
    throw new ForbiddenException('Exceeds tier pilgrim limit')
  }
  
  // 3. Check escrow requirement
  const escrow = await this.tierRestrictionService.checkEscrowRequirement(operatorId)
  if (escrow.required && !escrow.isActive) {
    throw new ForbiddenException('Escrow account activation required')
  }
  
  // 4. Proceed with booking creation
}
```

### 2.4 Create Verification Workflow Service

**File:** `backend/src/operators/services/verification.service.ts`

**Methods:**
- `submitForVerification(operatorId): Promise<VerificationRequest>`
- `reviewDocuments(operatorId, adminId, decision): Promise<void>`
- `approveOperator(operatorId): Promise<void>`
- `rejectOperator(operatorId, reason): Promise<void>`
- `suspendOperator(operatorId, reason): Promise<void>`
- `checkLicenseExpiry(): Promise<void>` // Cron job to check daily

---

## Phase 3: API Endpoints (Week 3)

### 3.1 Operator Onboarding Endpoints

```
POST   /api/operator/auth/register
  - Creates operator with BRONZE tier by default
  - verificationStatus = 'pending'
  
GET    /api/operator/profile
  - Returns tier, verificationStatus, trustScore, badges
  
GET    /api/operator/tier/restrictions
  - Returns current tier limits and usage
  
GET    /api/operator/tier/upgrade-requirements
  - Returns what's needed to upgrade to next tier
```

### 3.2 Document Management Endpoints

```
POST   /api/operator/documents/upload
  - Body: { documentType, file }
  - Stores in cloud storage (Vercel Blob)
  
GET    /api/operator/documents
  - Returns all uploaded documents with status
  
DELETE /api/operator/documents/:id
  - Soft delete (only if status = 'pending')
  
POST   /api/operator/verification/submit
  - Submits all documents for admin review
  - Changes verificationStatus to 'under_review'
```

### 3.3 Admin Review Endpoints

```
GET    /api/admin/operators/pending-verification
  - List operators awaiting review
  
GET    /api/admin/operators/:id/documents
  - View all documents for review
  
POST   /api/admin/operators/:id/review
  - Body: { approved: boolean, rejectedDocs?: [], reason?: string }
  - Approves or rejects verification
  
POST   /api/admin/operators/:id/tier/upgrade
  - Body: { tier: 'SILVER' | 'GOLD' }
  - Manual tier upgrade by admin
  
POST   /api/admin/operators/:id/suspend
  - Body: { reason: string }
  - Suspends operator
```

### 3.4 Escrow Management Endpoints

```
POST   /api/operator/escrow/activate
  - Initiates escrow account setup
  
GET    /api/operator/escrow/status
  - Returns escrow account status
  
POST   /api/operator/escrow/deposit
  - Records escrow deposit for a booking
  
POST   /api/operator/escrow/release/:bookingId
  - Releases escrow after trip completion
```

---

## Phase 4: Trust & Performance Tracking (Week 4)

### 4.1 Trust Score Calculation Service

**File:** `backend/src/operators/services/trust-score.service.ts`

**Algorithm:**
```typescript
trustScore = (
  completedTrips * 10 +                    // 10 points per completed trip
  totalPilgrims * 0.1 +                    // 0.1 point per pilgrim
  (5 - avgCancellationRate) * 5 +         // Penalty for cancellations
  (avgRating - 3) * 10 +                   // Rating impact
  verificationBonus +                       // +20 if GOLD, +10 if SILVER
  badgeCount * 5                            // +5 per badge
) / 100 * 100 // Normalize to 0-100
```

**Update triggers:**
- After trip completion
- After rating submission
- After booking cancellation
- After verification approval

### 4.2 Badge Award Service

**File:** `backend/src/operators/services/badge.service.ts`

**Auto-award badges based on criteria:**
- `verified_license`: CAC + License verified
- `escrow_active`: Escrow account active
- `top_rated`: Average rating >= 4.5 with 10+ reviews
- `fast_response`: Average response time < 2 hours
- `reliable`: 95%+ trip completion rate

### 4.3 Automatic Tier Upgrade Service

**File:** `backend/src/operators/services/tier-upgrade.service.ts`

**Criteria for auto-upgrade:**
```typescript
BRONZE → SILVER:
  - completedTrips >= 10
  - trustScore >= 60
  - No suspensions in last 6 months
  - All required documents verified

SILVER → GOLD:
  - completedTrips >= 50
  - trustScore >= 80
  - avgRating >= 4.5
  - License verified
  - No disputes in last 6 months
```

**Cron job:** Runs daily at 2 AM to check upgrade eligibility

---

## Phase 5: Frontend Integration (Week 5)

### 5.1 Operator Dashboard Updates

**New components needed:**
- `TierBadge` - Display current tier with icon
- `TierProgress` - Show progress to next tier
- `DocumentUpload` - Upload and manage documents
- `VerificationStatus` - Display verification progress
- `TrustScore` - Display trust score with breakdown
- `BookingLimits` - Show monthly usage vs limits
- `EscrowStatus` - Display escrow account status

**Pages to update:**
- `/dashboard` - Add tier status card
- `/dashboard/verification` - New page for document management
- `/dashboard/tier` - New page showing tier benefits
- `/dashboard/settings` - Add verification section

### 5.2 Public Operator Profile Updates

**Show on operator profile:**
- Tier badge (BRONZE/SILVER/GOLD)
- Trust badges (verified, top-rated, etc.)
- Trust score (if >= 50)
- Verification status indicator
- Completed trips count
- Average rating

### 5.3 Search & Filter Updates

**Add filters:**
- Filter by tier
- Filter by verification status
- Filter by trust score range
- Sort by trust score

---

## Phase 6: Compliance & Monitoring (Week 6)

### 6.1 Compliance Monitoring Service

**File:** `backend/src/operators/services/compliance.service.ts`

**Cron jobs:**
- **Daily:** Check license expiry dates
  - Send notification 30 days before expiry
  - Auto-suspend 7 days after expiry
  
- **Daily:** Check escrow account status
  - Notify if inactive for BRONZE operators
  
- **Weekly:** Calculate trust scores
  - Update all operator trust scores
  
- **Monthly:** Generate compliance report
  - List operators with expired licenses
  - List suspended operators
  - List pending verifications

### 6.2 Notification System

**Notifications to implement:**
- Document upload received
- Document approved/rejected
- Verification approved
- Tier upgraded
- License expiring soon
- License expired (suspension notice)
- Booking limit reached (80% of monthly limit)
- Escrow payment required

### 6.3 Admin Dashboard

**New admin pages:**
- `/admin/operators/pending` - Pending verifications
- `/admin/operators/suspended` - Suspended operators
- `/admin/compliance/licenses` - License expiry tracking
- `/admin/tier-config` - Tier configuration management
- `/admin/reports/verification` - Verification statistics

---

## Phase 7: Adjustment & Configuration (Week 7)

### 7.1 Tier Configuration Admin Panel

**Features:**
- Edit tier limits without code changes
- A/B test different tier configurations
- Set temporary promotional limits
- Override limits for specific operators

### 7.2 Feature Flags

**File:** `backend/src/config/feature-flags.ts`

```typescript
TIER_SYSTEM_ENABLED: boolean
AUTO_UPGRADE_ENABLED: boolean
ESCROW_REQUIRED_FOR_BRONZE: boolean
STRICT_VERIFICATION_MODE: boolean
```

### 7.3 Analytics & Metrics

**Track metrics:**
- Operators per tier
- Verification approval rate
- Average time to verification
- Trust score distribution
- Tier upgrade rate
- Booking volume per tier
- Revenue per tier

---

## Migration Strategy

### Step 1: Backward Compatible Launch
- Add new fields with default values
- Existing operators get GOLD tier automatically
- New signups get BRONZE tier

### Step 2: Gradual Rollout
- Week 1-2: BRONZE operators only (test restrictions)
- Week 3-4: Enable SILVER tier (test partnerships)
- Week 5+: Full system active

### Step 3: Data Migration
```sql
-- Set existing operators to GOLD tier with verified status
UPDATE operators 
SET tier = 'GOLD', 
    verificationStatus = 'approved',
    verifiedAt = NOW(),
    trustScore = 80
WHERE joinedAt < '2025-01-01';

-- New operators default to BRONZE
ALTER TABLE operators 
ALTER COLUMN tier SET DEFAULT 'BRONZE';
```

---

## Security Considerations

### 7.1 Rate Limiting
- Limit document uploads: 10 per day
- Limit verification submissions: 3 per month
- API rate limits based on tier

### 7.2 Document Validation
- File type validation (PDF, JPG, PNG only)
- File size limits (max 5MB per document)
- Virus scanning on upload
- Metadata stripping for privacy

### 7.3 Access Control
- Operators can only view their own documents
- Admins need specific role to review documents
- Audit log for all tier changes
- Audit log for all verification decisions

---

## Testing Strategy

### Unit Tests
- Tier restriction logic
- Trust score calculation
- Badge award criteria
- Auto-upgrade logic

### Integration Tests
- Booking creation with tier limits
- Document upload workflow
- Verification approval flow
- Escrow requirement enforcement

### E2E Tests
- New operator onboarding
- Document submission and approval
- Tier upgrade journey
- Booking with different tiers

---

## Success Metrics

### Phase 1 (Month 1)
- 50+ new BRONZE operators onboarded
- 80%+ document submission rate
- <48 hour verification turnaround

### Phase 2 (Month 2)
- 10+ BRONZE → SILVER upgrades
- 100+ bookings from BRONZE operators
- <5% escrow disputes

### Phase 3 (Month 3)
- 200+ total tiered operators
- 50+ SILVER operators
- 5+ GOLD operators
- Trust score system operational

---

## Rollback Plan

If critical issues arise:
1. Disable tier restrictions via feature flag
2. Set all operators to GOLD tier temporarily
3. Fix issues in staging environment
4. Gradual re-enable with fixes

---

## Budget Estimate

- **Storage:** Vercel Blob for documents (~$20/month)
- **Database:** PostgreSQL with increased storage (~$30/month)
- **Email notifications:** SendGrid (~$15/month)
- **Development time:** 7 weeks (1 backend developer)
- **Total:** ~$65/month operational cost

---

## Next Steps

1. **Review and approve roadmap**
2. **Set up development environment**
3. **Create database migration scripts**
4. **Start Phase 1 implementation**
5. **Weekly progress reviews**

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-07  
**Owner:** Technical Team
