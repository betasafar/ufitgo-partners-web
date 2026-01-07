# Tier System Implementation Roadmap (Microservices Architecture)

## Design Principles
- **Enable fast onboarding** without sacrificing trust
- **Backend-enforced restrictions** at the database and service layer
- **Adjustable configuration** without code deployments
- **Clear separation** between Operator System and Admin System

---

## Architecture Overview

### Operator System (`backend/operator-system`)
- Self-service operations
- Tier restrictions enforcement
- Document uploads
- Badge display
- Performance tracking

### Admin System (`backend/admin-system`)
- Operator verification workflows
- Document review and approval
- Badge issuance
- Tier configuration management
- Platform oversight

### Shared Database
Both systems connect to the same PostgreSQL database to ensure data consistency.

---

## Phase 1: Database Foundation ✅ COMPLETED
**Location:** Shared across both systems
**Status:** Implemented

### Tasks Completed:
- ✅ Extended Operator entity with tier fields
- ✅ Created OperatorDocument entity
- ✅ Created OperatorBadge entity
- ✅ Created TierConfiguration entity
- ✅ Set up entity relationships

---

## Phase 2: Business Logic & Validation ✅ COMPLETED  
**Location:** `backend/operator-system`
**Status:** Implemented

### Tasks Completed:
- ✅ TierRestrictionService for enforcing limits
- ✅ VerificationService for document management
- ✅ Integration with existing operators module

---

## Phase 3: Operator-Side API Endpoints
**Location:** `backend/operator-system`
**Duration:** 2-3 days

### 3.1 Tier Information Endpoints
**Controller:** `OperatorTierController`

```typescript
GET /operator/tier/info
GET /operator/tier/restrictions
GET /operator/tier/comparison
GET /operator/tier/badges
GET /operator/tier/upgrade-requirements
```

### 3.2 Document Upload Endpoints
**Controller:** `OperatorDocumentsController`

```typescript
POST /operator/documents/upload
GET /operator/documents
GET /operator/documents/:id
DELETE /operator/documents/:id
GET /operator/documents/verification-status
```

### 3.3 Performance & Metrics
**Controller:** `OperatorMetricsController`

```typescript
GET /operator/metrics/trust-score
GET /operator/metrics/performance
GET /operator/metrics/upgrade-progress
```

### 3.4 Booking Guards Enhancement
**Guards:** Update existing booking creation

```typescript
@UseGuards(TierRestrictionGuard)
POST /operator/bookings
// Enforces: maxBookingsPerMonth, requiresEscrow, pilgrimsPerBooking
```

### 3.5 Package Guards Enhancement
**Guards:** Update existing package creation

```typescript
@UseGuards(TierRestrictionGuard)
POST /operator/packages
// Enforces: maxActivePackages, internationalTravelAllowed
```

---

## Phase 4: Admin-Side API Endpoints
**Location:** `backend/admin-system`
**Duration:** 3-4 days

### 4.1 Verification Management
**Controller:** `AdminVerificationController`

```typescript
GET /admin/operators/verification/pending
GET /admin/operators/:id/documents
PATCH /admin/operators/:id/documents/:docId/verify
PATCH /admin/operators/:id/verification/:status
POST /admin/operators/:id/tier-upgrade
```

### 4.2 Badge Management
**Controller:** `AdminBadgesController`

```typescript
GET /admin/badges/templates
POST /admin/operators/:id/badges
DELETE /admin/operators/:id/badges/:badgeId
GET /admin/badges/statistics
```

### 4.3 Tier Configuration Management
**Controller:** `AdminTierConfigController`

```typescript
GET /admin/tier-config
PATCH /admin/tier-config/:tier
POST /admin/tier-config/feature-flags
GET /admin/tier-config/audit-log
```

### 4.4 Analytics & Reporting
**Controller:** `AdminTierAnalyticsController`

```typescript
GET /admin/analytics/tier-distribution
GET /admin/analytics/verification-funnel
GET /admin/analytics/upgrade-conversion
GET /admin/analytics/trust-score-trends
```

---

## Phase 5: Automated Tier Progression
**Location:** `backend/operator-system`
**Duration:** 2 days

### 5.1 Cron Jobs & Background Tasks

```typescript
@Cron('0 0 * * *') // Daily at midnight
async evaluateTierUpgrades()

@Cron('0 */6 * * *') // Every 6 hours
async updateTrustScores()

@Cron('0 0 1 * *') // Monthly on 1st
async resetMonthlyLimits()
```

### 5.2 Event-Based Updates

```typescript
@OnEvent('booking.completed')
async handleBookingCompleted()

@OnEvent('booking.cancelled')
async handleBookingCancelled()

@OnEvent('payment.received')
async handlePaymentReceived()
```

---

## Phase 6: Testing & Security
**Location:** Both systems
**Duration:** 2-3 days

### 6.1 Unit Tests
- TierRestrictionService tests
- VerificationService tests
- Guard tests
- Controller tests

### 6.2 Integration Tests
- End-to-end tier upgrade flows
- Document verification workflows
- Cross-service communication

### 6.3 Security Audits
- Authorization checks
- File upload validation
- SQL injection prevention
- Rate limiting on sensitive endpoints

---

## Phase 7: Monitoring & Analytics
**Location:** Both systems
**Duration:** 1-2 days

### 7.1 Logging
```typescript
@Injectable()
class TierAuditLogger {
  logTierChange()
  logRestrictionEnforced()
  logDocumentVerification()
  logBadgeAwarded()
}
```

### 7.2 Metrics & Alerts
- Tier distribution tracking
- Verification processing times
- Failed restriction attempts
- Trust score anomalies

---

## Implementation Order

### Sprint 1: Core Operator Features (Phase 3)
1. Tier info endpoints
2. Document upload system
3. Booking/package guards
4. Performance metrics

### Sprint 2: Admin Controls (Phase 4)
1. Verification workflows
2. Badge management
3. Tier configuration
4. Analytics dashboard

### Sprint 3: Automation & Polish (Phase 5-7)
1. Automated tier upgrades
2. Trust score calculations
3. Testing & security
4. Monitoring & alerts

---

## Database Migrations

### Migration 1: Tier System Foundation
```sql
-- Add tier columns to operators table
ALTER TABLE operators ADD COLUMN tier VARCHAR(10) DEFAULT 'bronze';
ALTER TABLE operators ADD COLUMN trust_score INT DEFAULT 50;
-- Create new tables: operator_documents, operator_badges, tier_configurations
```

### Migration 2: Indexes for Performance
```sql
CREATE INDEX idx_operators_tier ON operators(tier);
CREATE INDEX idx_documents_status ON operator_documents(verification_status);
CREATE INDEX idx_badges_operator ON operator_badges(operator_id);
```

---

## API Communication Pattern

### Option 1: Shared Database (Current)
Both systems read/write to the same tables. Admin updates verification status, Operator system reads it.

**Pros:** Simple, no sync issues
**Cons:** Tight coupling

### Option 2: Event-Driven (Future Enhancement)
Admin system publishes events (OperatorVerified, TierUpgraded), Operator system consumes them.

**Pros:** Loose coupling, scalable
**Cons:** Eventual consistency

**Recommendation:** Start with Option 1, migrate to Option 2 as the platform scales.

---

## Next Steps

1. ✅ Phase 1 & 2 Complete
2. **NOW:** Implement Phase 3 (Operator Endpoints)
3. Then: Implement Phase 4 (Admin Endpoints)
4. Then: Phases 5-7 (Automation, Testing, Monitoring)
