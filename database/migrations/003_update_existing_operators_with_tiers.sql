-- ============================================================================
-- MIGRATION: Update Existing Operators with Tier System Features
-- ============================================================================
-- This script safely updates existing operators in the system with tier features
-- It preserves all existing data while adding new tier-related columns

-- Step 1: Display current operators before update
-- ============================================================================
SELECT 
  id,
  "companyName",
  email,
  "verificationStatus",
  "createdAt"
FROM operators
ORDER BY id;

-- Step 2: Add tier system columns if they don't exist (safety check)
-- ============================================================================
DO $$ 
BEGIN
  -- Add tier column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'tier'
  ) THEN
    ALTER TABLE operators ADD COLUMN tier VARCHAR(10) DEFAULT 'BRONZE';
  END IF;

  -- Add trust_score column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'trust_score'
  ) THEN
    ALTER TABLE operators ADD COLUMN trust_score DECIMAL(3,2) DEFAULT 0.00;
  END IF;

  -- Add total_bookings column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'total_bookings'
  ) THEN
    ALTER TABLE operators ADD COLUMN total_bookings INTEGER DEFAULT 0;
  END IF;

  -- Add successful_bookings column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'successful_bookings'
  ) THEN
    ALTER TABLE operators ADD COLUMN successful_bookings INTEGER DEFAULT 0;
  END IF;

  -- Add cancelled_bookings column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'cancelled_bookings'
  ) THEN
    ALTER TABLE operators ADD COLUMN cancelled_bookings INTEGER DEFAULT 0;
  END IF;

  -- Add monthly_bookings_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'monthly_bookings_count'
  ) THEN
    ALTER TABLE operators ADD COLUMN monthly_bookings_count INTEGER DEFAULT 0;
  END IF;

  -- Add active_packages_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'active_packages_count'
  ) THEN
    ALTER TABLE operators ADD COLUMN active_packages_count INTEGER DEFAULT 0;
  END IF;

  -- Add escrow_required column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'escrow_required'
  ) THEN
    ALTER TABLE operators ADD COLUMN escrow_required BOOLEAN DEFAULT TRUE;
  END IF;

  -- Add tier_upgraded_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'tier_upgraded_at'
  ) THEN
    ALTER TABLE operators ADD COLUMN tier_upgraded_at TIMESTAMP DEFAULT NULL;
  END IF;

  -- Add last_trust_score_update column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'operators' AND column_name = 'last_trust_score_update'
  ) THEN
    ALTER TABLE operators ADD COLUMN last_trust_score_update TIMESTAMP DEFAULT NULL;
  END IF;
END $$;

-- Step 3: Update existing operators with intelligent tier assignment
-- ============================================================================

-- Update operators based on their verification status
UPDATE operators
SET 
  tier = CASE 
    -- Verified operators with CAC start at SILVER (partnership ready)
    WHEN "verificationStatus" = 'approved' AND "cacNumber" IS NOT NULL THEN 'SILVER'
    -- Verified operators without CAC start at BRONZE
    WHEN "verificationStatus" = 'approved' THEN 'BRONZE'
    -- Pending/rejected operators stay at BRONZE
    ELSE 'BRONZE'
  END,
  escrow_required = CASE
    -- Only SILVER and above don't need escrow
    WHEN "verificationStatus" = 'approved' AND "cacNumber" IS NOT NULL THEN FALSE
    ELSE TRUE
  END,
  trust_score = CASE
    -- Approved operators start with higher trust score
    WHEN "verificationStatus" = 'approved' THEN 0.50
    ELSE 0.00
  END,
  tier_upgraded_at = CASE
    WHEN "verificationStatus" = 'approved' THEN NOW()
    ELSE NULL
  END,
  last_trust_score_update = NOW()
WHERE tier IS NULL OR tier = ''; -- Only update if not already set

-- Step 4: Calculate actual booking statistics from existing bookings
-- ============================================================================

-- Update total_bookings count
UPDATE operators o
SET total_bookings = (
  SELECT COUNT(*) 
  FROM bookings b 
  WHERE b."operatorId" = o.id
)
WHERE EXISTS (SELECT 1 FROM bookings WHERE "operatorId" = o.id);

-- Update successful_bookings count (completed status)
UPDATE operators o
SET successful_bookings = (
  SELECT COUNT(*) 
  FROM bookings b 
  WHERE b."operatorId" = o.id 
  AND b.status = 'completed'
)
WHERE EXISTS (SELECT 1 FROM bookings WHERE "operatorId" = o.id);

-- Update cancelled_bookings count
UPDATE operators o
SET cancelled_bookings = (
  SELECT COUNT(*) 
  FROM bookings b 
  WHERE b."operatorId" = o.id 
  AND b.status = 'cancelled'
)
WHERE EXISTS (SELECT 1 FROM bookings WHERE "operatorId" = o.id);

-- Update monthly_bookings_count (last 30 days)
UPDATE operators o
SET monthly_bookings_count = (
  SELECT COUNT(*) 
  FROM bookings b 
  WHERE b."operatorId" = o.id 
  AND b."createdAt" >= NOW() - INTERVAL '30 days'
)
WHERE EXISTS (SELECT 1 FROM bookings WHERE "operatorId" = o.id);

-- Step 5: Calculate actual package statistics
-- ============================================================================

-- Update active_packages_count
UPDATE operators o
SET active_packages_count = (
  SELECT COUNT(*) 
  FROM packages p 
  WHERE p."operatorId" = o.id 
  AND p.status = 'active'
)
WHERE EXISTS (SELECT 1 FROM packages WHERE "operatorId" = o.id);

-- Step 6: Recalculate trust scores based on actual performance
-- ============================================================================

UPDATE operators
SET trust_score = LEAST(1.00, GREATEST(0.00,
  -- Base score from verification status
  CASE 
    WHEN "verificationStatus" = 'approved' THEN 0.50
    ELSE 0.20
  END
  +
  -- Add points for successful bookings (max 0.30)
  LEAST(0.30, (successful_bookings * 0.05))
  +
  -- Add points for having active packages (max 0.10)
  LEAST(0.10, (active_packages_count * 0.02))
  -
  -- Subtract points for cancellations (max -0.20)
  GREATEST(-0.20, (cancelled_bookings * -0.03))
))
WHERE total_bookings > 0;

-- Step 7: Upgrade eligible operators to higher tiers
-- ============================================================================

-- Upgrade BRONZE to SILVER (10+ successful bookings, trust score > 0.7)
UPDATE operators
SET 
  tier = 'SILVER',
  escrow_required = FALSE,
  tier_upgraded_at = NOW()
WHERE tier = 'BRONZE'
  AND successful_bookings >= 10
  AND trust_score >= 0.70
  AND "verificationStatus" = 'approved';

-- Upgrade SILVER to GOLD (50+ successful bookings, trust score > 0.85)
UPDATE operators
SET 
  tier = 'GOLD',
  tier_upgraded_at = NOW()
WHERE tier = 'SILVER'
  AND successful_bookings >= 50
  AND trust_score >= 0.85
  AND "verificationStatus" = 'approved';

-- Step 8: Display updated operators with tier information
-- ============================================================================
SELECT 
  id,
  "companyName",
  email,
  "verificationStatus",
  tier,
  trust_score,
  total_bookings,
  successful_bookings,
  cancelled_bookings,
  monthly_bookings_count,
  active_packages_count,
  escrow_required,
  tier_upgraded_at,
  "createdAt"
FROM operators
ORDER BY tier DESC, trust_score DESC, id;

-- Step 9: Summary statistics
-- ============================================================================
SELECT 
  'TIER DISTRIBUTION' as metric,
  tier,
  COUNT(*) as operator_count,
  ROUND(AVG(trust_score), 2) as avg_trust_score,
  SUM(total_bookings) as total_bookings,
  SUM(successful_bookings) as total_successful
FROM operators
GROUP BY tier
ORDER BY 
  CASE tier
    WHEN 'PLATINUM' THEN 1
    WHEN 'GOLD' THEN 2
    WHEN 'SILVER' THEN 3
    WHEN 'BRONZE' THEN 4
  END;

-- Step 10: Create indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_operators_tier ON operators(tier);
CREATE INDEX IF NOT EXISTS idx_operators_trust_score ON operators(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_operators_verification_tier ON operators("verificationStatus", tier);

COMMENT ON COLUMN operators.tier IS 'Operator tier level: BRONZE, SILVER, GOLD, PLATINUM';
COMMENT ON COLUMN operators.trust_score IS 'Trust score from 0.00 to 1.00 based on performance';
COMMENT ON COLUMN operators.escrow_required IS 'Whether operator needs to use escrow for bookings';
