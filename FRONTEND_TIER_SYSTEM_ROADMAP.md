# Frontend Tier System Implementation Roadmap

## Design Principles
- **Progressive Disclosure**: Show operators only what's relevant to their current tier
- **Clear Visual Hierarchy**: Tier status should be immediately visible and understood
- **Guided Onboarding**: Fast registration with contextual help and clear next steps
- **Trust Through Transparency**: Display verification status, trust badges, and performance metrics
- **Mobile-First**: All tier features must work seamlessly on mobile devices

---

## Phase 1: Core Tier Infrastructure (Week 1)

### 1.1 Type Definitions & API Integration
**Location**: `lib/types.ts`, `lib/api-proxy.ts`

**Deliverables**:
\`\`\`typescript
// Add tier-related types
export type TierLevel = 'BRONZE' | 'SILVER' | 'GOLD'
export type VerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

export interface TierInfo {
  level: TierLevel
  maxPilgrimsPerBooking: number
  maxActivePackages: number
  requiresEscrow: boolean
  canCreateCustomPackages: boolean
  features: string[]
}

export interface VerificationDocument {
  id: number
  type: 'HAJJ_LICENSE' | 'CAC_CERTIFICATE' | 'TAX_CLEARANCE' | 'BANK_STATEMENT'
  status: VerificationStatus
  uploadedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface TrustBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface OperatorWithTier extends Operator {
  tier: TierLevel
  verificationStatus: VerificationStatus
  tierInfo: TierInfo
  trustScore: number
  trustBadges: TrustBadge[]
  documents: VerificationDocument[]
  completedTrips: number
  activeBookings: number
}
\`\`\`

**API Endpoints to Add**:
- `GET /api/proxy/operator/tier` - Get current tier info
- `GET /api/proxy/operator/tier/features` - Get available features by tier
- `GET /api/proxy/operator/verification-documents` - List documents
- `POST /api/proxy/operator/verification-documents/upload` - Upload document
- `GET /api/proxy/operator/trust-badges` - Get earned badges

**Testing**:
- Verify API integration with backend tier endpoints
- Test error handling for missing tier data
- Validate type safety across all tier-related components

---

## Phase 2: Tier Visual System (Week 1-2)

### 2.1 Tier Badge Component
**Location**: `components/tier-badge.tsx`

**Deliverables**:
\`\`\`typescript
// Visual tier indicator with hover tooltip
<TierBadge 
  tier="SILVER" 
  size="sm" | "md" | "lg"
  showLabel={true}
  interactive={true} // Shows tooltip on hover
/>
\`\`\`

**Design Specs**:
- **BRONZE**: Amber/brown color (#CD7F32), bronze medal icon
- **SILVER**: Silver/gray color (#C0C0C0), silver medal icon  
- **GOLD**: Gold/yellow color (#FFD700), gold medal icon, sparkle effect
- Tooltip shows: tier name, key benefits, upgrade requirements
- Animation: subtle shine effect for GOLD tier
- Accessibility: ARIA labels, keyboard navigation support

### 2.2 Trust Score Display
**Location**: `components/trust-score.tsx`

**Deliverables**:
- Circular progress indicator (0-100 score)
- Color gradient: Red (0-40) → Yellow (41-70) → Green (71-100)
- Breakdown on hover: "Based on: Completed trips (45%), Payment history (30%), Customer ratings (25%)"
- Responsive design for mobile/desktop

### 2.3 Trust Badge Gallery
**Location**: `components/trust-badges.tsx`

**Deliverables**:
\`\`\`typescript
<TrustBadges 
  badges={operator.trustBadges}
  maxVisible={5}
  expandable={true}
/>
\`\`\`

**Badge Types**:
- Early Adopter (bronze badge)
- Verified Partner (green checkmark)
- Top Performer (gold star)
- Perfect Record (blue shield)
- Customer Favorite (heart icon)

**Testing**:
- Test responsive layout (grid on desktop, scroll on mobile)
- Verify tooltip positioning
- Test empty state (no badges yet)

---

## Phase 3: Enhanced Dashboard (Week 2-3)

### 3.1 Tier Overview Card
**Location**: `components/tier-overview-card.tsx`

**Deliverables**:
- Current tier badge with visual prominence
- Trust score with progress bar
- Key metrics: Active packages (X/Y limit), Bookings this month (X/Y limit)
- Quick actions: "Upload Documents", "View Tier Benefits", "Upgrade Path"
- Feature usage indicator (e.g., "3/5 active packages used")

**Layout**:
\`\`\`
┌─────────────────────────────────────────┐
│  🥈 SILVER TIER        Trust Score: 78  │
│                        ████████░░ 78/100│
│                                         │
│  Active Packages: 8/20                  │
│  ████████░░░░░░░░░░░░                   │
│                                         │
│  Bookings This Month: 45/100            │
│  ████████████░░░░░░░░                   │
│                                         │
│  [📄 Upload Docs] [🎯 View Benefits]   │
└─────────────────────────────────────────┘
\`\`\`

### 3.2 Tier Comparison Modal
**Location**: `components/tier-comparison-modal.tsx`

**Deliverables**:
- Side-by-side comparison table (BRONZE | SILVER | GOLD)
- Feature checklist per tier
- "You are here" indicator on current tier
- Upgrade requirements clearly displayed
- Call-to-action buttons: "Start Verification" or "Contact Support"

**Features to Compare**:
- Max pilgrims per booking
- Max active packages
- Custom package creation
- Escrow requirement
- Commission rate
- Priority support
- Marketing tools access
- Analytics depth

### 3.3 Tier Restrictions Alert Banner
**Location**: `components/tier-restriction-banner.tsx`

**Deliverables**:
- Contextual banners that appear when hitting tier limits
- Examples:
  - "You've reached your package limit (20/20). Upgrade to GOLD for unlimited packages."
  - "BRONZE operators require escrow for bookings. Verify your license to remove this requirement."
- Dismissible but persists across sessions until action taken
- Clear CTA button to resolve the restriction

**Testing**:
- Test banner appearance when limits are reached
- Verify dismiss functionality
- Test CTA button navigation

---

## Phase 4: Verification & Onboarding (Week 3-4)

### 4.1 Registration Flow Enhancement
**Location**: `app/register/page.tsx`, `components/registration-wizard.tsx`

**Deliverables**:
**Step 1**: Basic Info (existing - company name, email, password)
**Step 2**: Tier Selection (NEW)
  - Visual cards: "Start with BRONZE" vs "Apply as SILVER Partner"
  - Clear explanation of requirements
  - Recommended tier based on user input
**Step 3**: Document Upload (NEW for SILVER applicants)
  - Drag-and-drop file uploader
  - Document type selector
  - Preview uploaded documents
  - Skip option for BRONZE (upload later)
**Step 4**: Confirmation & Next Steps
  - Welcome message with tier assignment
  - Clear next steps based on tier
  - Link to dashboard tour

**Design**: Multi-step wizard with progress indicator, back/next navigation, save draft functionality

### 4.2 Document Upload Center
**Location**: `app/dashboard/verification/page.tsx`

**Deliverables**:
\`\`\`typescript
// Document upload interface
┌─────────────────────────────────────────────────┐
│ Verification Documents                    2/4 ✓ │
├─────────────────────────────────────────────────┤
│                                                 │
│ ✅ Hajj License                   [View] [✓]    │
│    Uploaded: Jan 15, 2026                       │
│    Status: Approved                             │
│                                                 │
│ ✅ CAC Certificate                [View] [✓]    │
│    Uploaded: Jan 15, 2026                       │
│    Status: Approved                             │
│                                                 │
│ ⏳ Tax Clearance              [Upload] [Pending]│
│    Required for SILVER tier                     │
│                                                 │
│ ⏳ Bank Statement             [Upload] [Pending]│
│    Required for GOLD tier                       │
│                                                 │
└─────────────────────────────────────────────────┘
\`\`\`

**Features**:
- Document type cards with status indicators
- Drag-and-drop upload with preview
- File validation (type, size, format)
- Upload progress indicator
- Document viewer (PDF, images)
- Reupload option for rejected documents
- Rejection reason display with help text

### 4.3 Verification Status Tracker
**Location**: `components/verification-tracker.tsx`

**Deliverables**:
- Timeline-style progress tracker
- Status updates: Submitted → Under Review → Approved/Rejected
- Estimated review time display
- Email notification preferences
- Admin feedback display for rejections

**Visual Design**:
\`\`\`
Upload → Under Review → Approved
  ●━━━━━━━●━━━━━━━○
  ✓       ⏳       
\`\`\`

---

## Phase 5: Tier-Aware Feature Access (Week 4-5)

### 5.1 Package Creation Flow
**Location**: `app/dashboard/packages/create/page.tsx`

**Deliverables**:
- Tier-based field enablement/disablement
- Visual indicators for premium features:
  - "🔒 Custom pricing (GOLD tier)" - disabled for BRONZE/SILVER
  - "⭐ Flexible dates (SILVER+)" - enabled for SILVER/GOLD
- Upgrade prompt inline: "Unlock this feature with GOLD tier"
- Pilgrim count limit enforcement with visual warning
- Active package count check before allowing creation

**Validation**:
- Frontend validation matches backend tier rules
- Clear error messages when limits exceeded
- Automatic tier check on form submission

### 5.2 Booking Management Restrictions
**Location**: `app/dashboard/applicants/page.tsx`, `app/dashboard/bookings/page.tsx`

**Deliverables**:
- Booking limit progress bar at top of page
- Escrow requirement badge on BRONZE operator bookings
- Bulk actions limited by tier (e.g., bulk approve only for GOLD)
- Export functionality gated by tier
- Advanced filters (GOLD tier feature) with lock icon

### 5.3 Analytics Dashboard Restrictions
**Location**: `app/dashboard/analytics/page.tsx`

**Deliverables**:
- Tiered analytics access:
  - **BRONZE**: Basic metrics (total bookings, revenue, active packages)
  - **SILVER**: + Booking trends, customer demographics
  - **GOLD**: + Predictive analytics, custom reports, export data
- Blur effect on locked premium charts with "Upgrade to unlock" overlay
- Preview mode: Show chart structure with sample data
- Comparison with industry benchmarks (GOLD only)

---

## Phase 6: Upgrade Path & Growth Tools (Week 5-6)

### 6.1 Tier Upgrade Progress Page
**Location**: `app/dashboard/upgrade/page.tsx`

**Deliverables**:
\`\`\`
Your Path to SILVER Tier
━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Complete 5 successful trips (5/5)
✅ Maintain 80% trust score (85/80)
⏳ Upload Hajj License (0/1)
⏳ Upload CAC Certificate (0/1)
○  Achieve 50 total bookings (23/50)

Progress: 40% ████░░░░░░

[📄 Upload Documents] [💬 Contact Support]
\`\`\`

**Features**:
- Checklist with real-time progress updates
- Visual progress bar (percentage complete)
- Estimated time to upgrade based on current pace
- Direct links to complete missing requirements
- Celebration animation when requirements met
- Automatic tier upgrade notification

### 6.2 Performance Insights Dashboard
**Location**: `components/performance-insights.tsx`

**Deliverables**:
- Personalized recommendations:
  - "Complete 2 more trips to qualify for SILVER"
  - "Your trust score dropped 5 points. Respond to customer feedback to improve."
  - "You're in the top 10% of BRONZE operators!"
- Peer comparison (anonymized): "Average SILVER operator: 78 bookings/month"
- Growth chart: Track trust score and booking trends over time
- Achievement unlocks: "You earned the 'Early Adopter' badge!"

### 6.3 Tier Benefits Showcase
**Location**: `app/dashboard/tier-benefits/page.tsx`

**Deliverables**:
- Interactive benefit cards with before/after comparison
- ROI calculator: "Upgrading to GOLD could increase revenue by 35%"
- Success stories: "How Elite Hajj Travels grew with GOLD tier"
- Feature preview videos/screenshots
- Pricing transparency: Commission rates per tier
- Contact sales CTA for custom enterprise tier

---

## Phase 7: Mobile Optimization (Week 6-7)

### 7.1 Mobile Tier Dashboard
**Location**: `app/dashboard/page.tsx` (responsive enhancements)

**Deliverables**:
- Collapsible tier overview card
- Swipeable feature cards
- Bottom sheet for tier comparison
- Mobile-optimized document upload (camera integration)
- Touch-friendly badge gallery
- Quick action floating button (FAB) for common tier tasks

### 7.2 Progressive Web App (PWA) Features
**Location**: `app/manifest.json`, `service-worker.js`

**Deliverables**:
- Offline tier info access (cached tier data)
- Push notifications for:
  - Document verification status updates
  - Tier upgrade eligibility
  - Trust score changes
  - New badge earned
- Add to home screen prompt
- Background sync for document uploads

### 7.3 Mobile-First Forms
**Location**: All form components

**Deliverables**:
- Single-column layouts
- Large touch targets (min 44px)
- Native file picker integration
- Autofocus and keyboard optimization
- Field validation on blur (not on every keystroke)
- Progress saving (don't lose form data on navigation)

---

## Phase 8: Admin Tools (Week 7-8)

### 8.1 Admin Verification Dashboard
**Location**: `app/admin/verification/page.tsx`

**Deliverables**:
- Queue of pending document reviews
- Side-by-side document viewer with approval controls
- Bulk approval/rejection
- Templated rejection reasons
- Operator history view (previous submissions)
- Audit log of verification decisions
- Search and filter (by tier, status, date)

### 8.2 Tier Configuration Interface
**Location**: `app/admin/tier-config/page.tsx`

**Deliverables**:
- Visual tier rule editor:
  - Adjust booking limits with sliders
  - Toggle feature availability per tier
  - Set escrow requirements
  - Configure commission rates
- A/B testing setup for tier experiments
- Preview mode: See changes before publishing
- Rollback functionality
- Change history log

### 8.3 Analytics & Reporting
**Location**: `app/admin/analytics/page.tsx`

**Deliverables**:
- Tier distribution chart (how many operators per tier)
- Upgrade funnel analysis (drop-off points)
- Feature adoption rates per tier
- Revenue by tier
- Verification approval rates
- Average time to upgrade
- Trust score distribution
- Custom report builder

---

## Phase 9: Testing & Polish (Week 8-9)

### 9.1 Comprehensive Testing
**Test Coverage**:
- Unit tests for tier utility functions
- Component tests for tier-aware UI elements
- Integration tests for upgrade flows
- E2E tests for complete onboarding journey
- Accessibility audit (WCAG 2.1 AA)
- Performance testing (Lighthouse score >90)
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Mobile device testing (iOS, Android)

### 9.2 User Acceptance Testing
**Test Scenarios**:
- New operator onboarding (BRONZE tier)
- Document upload and verification
- Tier restriction enforcement (hitting limits)
- Upgrade path completion
- Admin verification workflow
- Mobile tier management
- Error handling and recovery

### 9.3 Performance Optimization
**Optimizations**:
- Code splitting for tier-specific features
- Lazy loading for premium components
- Image optimization for badges and icons
- API response caching (React Query/SWR)
- Reduce bundle size (tree shaking)
- Optimize re-renders (React.memo, useMemo)
- Database query optimization for tier checks

---

## Phase 10: Launch & Iteration (Week 9-10)

### 10.1 Soft Launch
**Deliverables**:
- Release to 10% of operators (feature flag)
- Monitor error rates and performance
- Collect feedback via in-app survey
- Track key metrics:
  - Registration completion rate
  - Document upload rate
  - Tier upgrade rate
  - Feature adoption per tier
  - User satisfaction (NPS)

### 10.2 Documentation & Training
**Deliverables**:
- Operator user guide (PDF + video)
- Interactive onboarding tour
- Help center articles per tier feature
- Admin training materials
- API documentation updates
- Developer changelog

### 10.3 Full Launch & Marketing
**Deliverables**:
- Email campaign announcing tier system
- In-app announcement banner
- Blog post explaining benefits
- Social media promotion
- Partner outreach (for SILVER tier)
- Success metrics dashboard
- Feedback collection mechanism

---

## Technical Implementation Notes

### State Management
\`\`\`typescript
// Use React Context for tier info across the app
const TierContext = createContext<TierContextValue | null>(null)

export function TierProvider({ children }) {
  const [tierInfo, setTierInfo] = useState<OperatorWithTier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch tier info on mount and cache
  useEffect(() => {
    fetchTierInfo().then(setTierInfo).finally(() => setIsLoading(false))
  }, [])
  
  return (
    <TierContext.Provider value={{ tierInfo, isLoading, refetch: fetchTierInfo }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  const context = useContext(TierContext)
  if (!context) throw new Error('useTier must be used within TierProvider')
  return context
}
\`\`\`

### Feature Gating Utility
\`\`\`typescript
// Reusable hook for feature access checks
export function useFeatureAccess(featureName: string) {
  const { tierInfo } = useTier()
  
  const hasAccess = tierInfo?.tierInfo.features.includes(featureName) ?? false
  const requiredTier = getRequiredTier(featureName)
  
  return {
    hasAccess,
    requiredTier,
    showUpgradePrompt: !hasAccess,
  }
}

// Usage in components
function CreatePackageButton() {
  const { hasAccess, requiredTier } = useFeatureAccess('custom_packages')
  
  if (!hasAccess) {
    return (
      <Button disabled>
        🔒 Custom Packages (Requires {requiredTier})
      </Button>
    )
  }
  
  return <Button>Create Custom Package</Button>
}
\`\`\`

### Caching Strategy
- **Tier Info**: Cache in React Context, revalidate every 5 minutes
- **Trust Badges**: Cache indefinitely, invalidate on badge earn event
- **Verification Documents**: Cache for 1 minute, invalidate on upload
- **Tier Configuration**: Cache for 1 hour, invalidate on admin change

### Analytics Tracking
\`\`\`typescript
// Track tier-related events
trackEvent('tier_upgrade_started', { from: 'BRONZE', to: 'SILVER' })
trackEvent('document_uploaded', { type: 'HAJJ_LICENSE', tier: 'BRONZE' })
trackEvent('tier_limit_reached', { limit: 'max_packages', tier: 'SILVER' })
trackEvent('feature_locked_clicked', { feature: 'custom_pricing', tier: 'BRONZE' })
\`\`\`

---

## Success Metrics

### Operator Metrics
- **Registration Completion Rate**: >80% (baseline: 65%)
- **Document Upload Rate**: >60% within 7 days of registration
- **Time to First Booking**: <24 hours for BRONZE operators
- **Tier Upgrade Rate**: >20% BRONZE→SILVER within 3 months
- **Feature Discovery**: >70% operators view tier comparison
- **Trust Score**: Average >75 across all tiers

### Platform Metrics
- **Operator Growth**: 2x increase in new registrations
- **Booking Volume**: 1.5x increase from BRONZE operators
- **Verification Processing Time**: <48 hours average
- **Support Ticket Reduction**: 30% fewer "Why can't I do X?" tickets
- **Revenue Impact**: 25% increase from tiered commission structure

### Technical Metrics
- **Page Load Time**: <2 seconds on 3G
- **API Response Time**: <500ms for tier checks
- **Error Rate**: <0.5% on tier-related operations
- **Mobile Conversion**: 80% of desktop conversion rate
- **Accessibility**: WCAG 2.1 AA compliant

---

## Risk Mitigation

### User Confusion
**Risk**: Operators don't understand tier system
**Mitigation**: 
- In-app tooltips and guided tours
- Clear visual hierarchy (color coding)
- "Why?" links next to every restriction
- Video explainers

### Feature Adoption
**Risk**: Operators don't upgrade tiers
**Mitigation**:
- Progressive unlock notifications
- ROI calculators showing potential earnings
- Social proof (show success stories)
- Limited-time upgrade incentives

### Technical Debt
**Risk**: Tier checks slow down the app
**Mitigation**:
- Aggressive caching strategy
- Tier info in JWT token (no extra API call)
- Background tier refresh
- Feature flags for gradual rollout

### Mobile Performance
**Risk**: Tier UI too heavy for low-end devices
**Mitigation**:
- Lazy load tier components
- Reduce animation on low-power mode
- Progressive enhancement approach
- Offline-first architecture

---

## Post-Launch Roadmap

### Month 2-3: Enhancements
- Tier recommendation engine (ML-based)
- Peer comparison dashboard
- Gamification (leaderboards, challenges)
- Referral program with tier bonuses

### Month 4-6: Advanced Features
- Dynamic tier rules based on seasonality
- Custom tier creation (enterprise)
- Partnership program automation
- API access for GOLD operators

### Month 7-12: Scale & Optimize
- International tier variations
- Multi-operator accounts (agencies)
- White-label tier system for partners
- AI-powered document verification

---

## Resource Requirements

### Design Team
- 1 UI/UX Designer (full-time, 6 weeks)
- 1 Visual Designer (part-time, 3 weeks) - badges, icons, tier branding

### Frontend Team
- 2 Senior Frontend Engineers (full-time, 8 weeks)
- 1 Frontend Engineer (full-time, 6 weeks) - mobile optimization
- 1 QA Engineer (full-time, 4 weeks)

### Support Team
- Technical writer for documentation (2 weeks)
- Customer success for operator training (ongoing)

### Tools & Services
- Analytics platform (Mixpanel/Amplitude)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- A/B testing tool (Optimizely/LaunchDarkly)

---

## Conclusion

This frontend roadmap ensures operators have a **seamless, transparent, and motivating experience** with the tier system. Every screen is designed to encourage growth while maintaining clarity about restrictions and upgrade paths.

**Key Differentiators**:
1. **Progressive Enhancement**: Start simple (BRONZE), grow naturally
2. **Transparency**: Always show why and how to unlock features
3. **Mobile-First**: 70%+ of operators use mobile
4. **Performance**: Fast tier checks, no blocking operations
5. **Accessibility**: Inclusive design for all users

The tier system becomes a **growth engine**, not a barrier. Operators see their path forward at every step and are motivated to upgrade through clear value propositions and social proof.
