# Tier System Database Migrations

## Migration Order

Run these SQL migrations in order:

### 1. Foundation Tables (001_tier_system_foundation.sql)
Creates the new tables required for the tier system:
- `operator_documents` - Document verification tracking
- `operator_badges` - Achievement badges for operators
- `tier_configurations` - Configurable tier limits and rules

**Run this first** to create the foundational structure.

### 2. Update Existing Operators (003_update_existing_operators_with_tiers.sql)
Updates existing operators in your database with tier features:
- Adds tier-related columns to operators table
- Intelligently assigns tiers based on verification status
- Calculates actual statistics from existing bookings and packages
- Upgrades eligible operators automatically
- Creates performance indexes

**Run this second** to migrate your existing data.

### 3. Sample Test Data (002_tier_system_sample_data.sql - OPTIONAL)
Inserts sample operators and test data for development/staging environments.

**Only run this in dev/staging** - skip in production if you have real operators.

## How to Run

### Option 1: Using psql command line
\`\`\`bash
# Connect to your database
psql -h localhost -U your_user -d your_database

# Run migrations in order
\i database/migrations/001_tier_system_foundation.sql
\i database/migrations/003_update_existing_operators_with_tiers.sql
\`\`\`

### Option 2: Using GUI tools (pgAdmin, DBeaver, etc.)
1. Open the SQL file
2. Execute the entire script
3. Review the output for any errors

### Option 3: Using TypeORM migrations
\`\`\`bash
# Generate TypeORM migration from entities
npm run migration:generate -- -n TierSystem

# Run migrations
npm run migration:run
\`\`\`

## What Gets Updated

The `003_update_existing_operators_with_tiers.sql` script will:

1. **Add new columns** safely (only if they don't exist)
2. **Assign tiers intelligently**:
   - Approved operators with CAC number → SILVER tier
   - Approved operators without CAC → BRONZE tier
   - Unverified operators → BRONZE tier
3. **Calculate real statistics** from your existing:
   - Bookings (total, successful, cancelled)
   - Packages (active count)
   - Monthly activity
4. **Compute trust scores** based on actual performance
5. **Auto-upgrade** operators who meet tier requirements
6. **Show before/after** comparison

## Verification

After running the migrations, verify the results:

\`\`\`sql
-- Check tier distribution
SELECT tier, COUNT(*) as count, ROUND(AVG(trust_score), 2) as avg_score
FROM operators
GROUP BY tier;

-- Check top performers
SELECT "companyName", tier, trust_score, successful_bookings
FROM operators
ORDER BY trust_score DESC, successful_bookings DESC
LIMIT 10;

-- Verify column additions
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'operators'
AND column_name IN ('tier', 'trust_score', 'escrow_required');
\`\`\`

## Rollback (if needed)

If you need to rollback the tier system changes:

\`\`\`sql
-- Remove tier columns from operators
ALTER TABLE operators 
  DROP COLUMN IF EXISTS tier,
  DROP COLUMN IF EXISTS trust_score,
  DROP COLUMN IF EXISTS total_bookings,
  DROP COLUMN IF EXISTS successful_bookings,
  DROP COLUMN IF EXISTS cancelled_bookings,
  DROP COLUMN IF EXISTS monthly_bookings_count,
  DROP COLUMN IF EXISTS active_packages_count,
  DROP COLUMN IF EXISTS escrow_required,
  DROP COLUMN IF EXISTS tier_upgraded_at,
  DROP COLUMN IF EXISTS last_trust_score_update;

-- Drop tier system tables
DROP TABLE IF EXISTS operator_badges;
DROP TABLE IF EXISTS operator_documents;
DROP TABLE IF EXISTS tier_configurations;
\`\`\`

## Notes

- The migration is **idempotent** - safe to run multiple times
- It preserves all existing operator data
- Trust scores are calculated from real performance metrics
- Operators are automatically upgraded based on achievement
- All timestamps are properly set for audit trails
