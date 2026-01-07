# Tier System Testing Guide

## Overview
This guide covers testing strategies for the tier system implementation across operator and admin microservices.

## Running Tests

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests for specific service
npm run test -- tier-restriction.service.spec

# Run tests with coverage
npm run test:cov
```

### Integration Tests
```bash
# Run integration tests
npm run test:e2e

# Run specific integration test
npm run test:e2e -- tier-system.e2e-spec
```

## Test Coverage Requirements

### Services (Minimum 80% coverage)
- ✅ TierRestrictionService
- ✅ VerificationService
- ✅ TierAutomationService
- OperatorsService
- TierConfigService

### Controllers (Minimum 70% coverage)
- TierController
- DocumentsController
- MetricsController
- OperatorsVerificationController (Admin)
- TierConfigController (Admin)

### Guards (100% coverage required)
- ✅ TierRestrictionGuard

## Security Testing Checklist

### Authentication & Authorization
- [ ] JWT token validation on all protected endpoints
- [ ] Operator can only access their own data
- [ ] Admin endpoints require admin role
- [ ] Document upload restricted by tier
- [ ] Rate limiting on sensitive endpoints

### Input Validation
- [ ] File upload size limits (max 10MB)
- [ ] File type validation (PDF, JPG, PNG only)
- [ ] SQL injection prevention in queries
- [ ] XSS prevention in document metadata
- [ ] Path traversal prevention in file operations

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Secure file storage with access controls
- [ ] Document URLs expire after 24 hours
- [ ] PII handling compliance (GDPR/CCPA)
- [ ] Audit logs for verification actions

## Manual Testing Scenarios

### Scenario 1: Bronze Operator Onboarding
```
1. Register new operator
2. Verify default tier is 'bronze'
3. Upload business license document
4. Attempt to create international package (should fail)
5. Create domestic package (should succeed)
6. Attempt 11th booking in month (should fail)
```

### Scenario 2: Tier Upgrade Flow
```
1. Bronze operator completes 50 successful bookings
2. Trust score reaches 70+
3. Admin reviews verification documents
4. Admin approves operator
5. System auto-upgrades to Silver tier
6. Operator can now create international packages
```

### Scenario 3: Document Verification
```
1. Operator uploads multiple documents
2. Admin reviews documents in queue
3. Admin approves some, rejects others
4. Operator receives rejection notifications
5. Operator re-uploads corrected documents
6. Admin re-reviews and approves
```

## Performance Testing

### Load Testing Endpoints
```bash
# Test tier restriction checks (should handle 1000 req/min)
artillery quick --count 100 --num 10 http://localhost:3000/operator/tier/restrictions

# Test document upload (should handle 50 concurrent uploads)
artillery quick --count 50 --num 1 -p test-upload.json http://localhost:3000/operator/documents/upload
```

### Database Query Performance
```sql
-- Verify indexes are used (EXPLAIN ANALYZE)
EXPLAIN ANALYZE SELECT * FROM operators WHERE tier = 'bronze' AND verification_status = 'pending';

-- Should use idx_operators_tier and idx_operators_verification_status
```

## Security Audit Checklist

### File Upload Security
- [x] Validate file MIME types
- [x] Scan uploaded files for malware
- [x] Generate unique filenames (prevent overwrites)
- [x] Store files outside web root
- [x] Implement file size limits per tier

### API Security
- [x] Rate limiting (10 req/min for document upload)
- [x] Request size limits (10MB max payload)
- [x] CORS configuration (whitelist domains)
- [x] API versioning for backward compatibility
- [x] Error messages don't leak sensitive info

### Database Security
- [x] Parameterized queries (TypeORM handles this)
- [x] Row-level security policies
- [x] Encrypted sensitive columns
- [x] Audit trail for tier changes
- [x] Database backups and recovery plan

## Continuous Integration

### Pre-commit Hooks
```bash
# Run linter
npm run lint

# Run unit tests
npm run test

# Check test coverage
npm run test:cov -- --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

### CI Pipeline (GitHub Actions)
```yaml
# .github/workflows/test.yml
- Run unit tests
- Run integration tests
- Security scan (npm audit)
- Code coverage report
- Deploy to staging (if tests pass)
```

## Monitoring & Alerts

### Key Metrics to Monitor
- Tier upgrade conversion rate
- Document verification processing time
- Failed restriction attempts per tier
- Trust score distribution
- Badge award frequency
- API response times for tier checks

### Alert Triggers
- Trust score anomalies (sudden drops)
- High rejection rate for documents
- Unusual tier upgrade requests
- Failed tier restriction checks spike
- Database query slowdowns

## Test Data Cleanup

### After Testing
```sql
-- Remove test operators
DELETE FROM operators WHERE email LIKE '%@test.com';

-- Reset tier configurations to production values
UPDATE tier_configurations SET 
  max_bookings_per_month = CASE tier
    WHEN 'bronze' THEN 10
    WHEN 'silver' THEN 30
    WHEN 'gold' THEN 100
    WHEN 'platinum' THEN -1
  END;

-- Clear test documents
DELETE FROM operator_documents WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 day';
