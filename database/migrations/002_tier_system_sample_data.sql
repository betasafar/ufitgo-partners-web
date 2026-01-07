-- Migration: Tier System Sample Data
-- Description: Insert sample test data for tier system testing
-- Date: 2024-01-20

-- ============================================
-- 1. Sample Operators with Different Tiers
-- ============================================

-- Update existing operators with tier data
UPDATE operators 
SET 
  tier = 'bronze',
  verification_status = 'pending',
  trust_score = 50,
  total_bookings = 0,
  successful_bookings = 0,
  monthly_bookings_count = 0,
  active_packages_count = 0
WHERE tier IS NULL;

-- Sample Bronze Operator (New/Unverified)
INSERT INTO operators (
  email, 
  "companyName", 
  "passwordHash", 
  tier, 
  verification_status, 
  trust_score,
  total_bookings,
  successful_bookings,
  monthly_bookings_count
) VALUES (
  'bronze.operator@test.com',
  'Bronze Hajj Services',
  '$2b$10$samplehashedpassword',
  'bronze',
  'pending',
  45,
  3,
  2,
  2
) ON CONFLICT (email) DO NOTHING;

-- Sample Silver Operator (Verified Partner)
INSERT INTO operators (
  email, 
  "companyName", 
  "passwordHash", 
  tier, 
  verification_status, 
  trust_score,
  total_bookings,
  successful_bookings,
  monthly_bookings_count,
  verified_at
) VALUES (
  'silver.operator@test.com',
  'Silver Star Travel & Tours',
  '$2b$10$samplehashedpassword',
  'silver',
  'approved',
  75,
  45,
  42,
  15,
  CURRENT_TIMESTAMP - INTERVAL '30 days'
) ON CONFLICT (email) DO NOTHING;

-- Sample Gold Operator (Premium Licensed)
INSERT INTO operators (
  email, 
  "companyName", 
  "passwordHash", 
  tier, 
  verification_status, 
  trust_score,
  total_bookings,
  successful_bookings,
  monthly_bookings_count,
  verified_at,
  tier_upgraded_at
) VALUES (
  'gold.operator@test.com',
  'Golden Gate Hajj & Umrah',
  '$2b$10$samplehashedpassword',
  'gold',
  'approved',
  92,
  250,
  245,
  35,
  CURRENT_TIMESTAMP - INTERVAL '180 days',
  CURRENT_TIMESTAMP - INTERVAL '90 days'
) ON CONFLICT (email) DO NOTHING;

-- Sample Platinum Operator (Elite Partner)
INSERT INTO operators (
  email, 
  "companyName", 
  "passwordHash", 
  tier, 
  verification_status, 
  trust_score,
  total_bookings,
  successful_bookings,
  monthly_bookings_count,
  verified_at,
  tier_upgraded_at
) VALUES (
  'platinum.operator@test.com',
  'Elite Premium Hajj Group',
  '$2b$10$samplehashedpassword',
  'platinum',
  'approved',
  98,
  1500,
  1485,
  120,
  CURRENT_TIMESTAMP - INTERVAL '365 days',
  CURRENT_TIMESTAMP - INTERVAL '180 days'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. Sample Documents
-- ============================================

-- Documents for Bronze Operator (Pending Verification)
INSERT INTO operator_documents (
  operator_id, 
  document_type, 
  file_url, 
  file_name,
  verification_status
) 
SELECT 
  id,
  'business_license',
  'https://storage.example.com/docs/bronze_license.pdf',
  'business_license.pdf',
  'pending'
FROM operators WHERE email = 'bronze.operator@test.com'
ON CONFLICT DO NOTHING;

-- Documents for Silver Operator (Approved)
INSERT INTO operator_documents (
  operator_id, 
  document_type, 
  file_url, 
  file_name,
  verification_status,
  verified_at
) 
SELECT 
  id,
  unnest(ARRAY['business_license', 'tax_certificate', 'insurance_certificate']),
  'https://storage.example.com/docs/silver_' || unnest(ARRAY['license', 'tax', 'insurance']) || '.pdf',
  unnest(ARRAY['business_license', 'tax_certificate', 'insurance_certificate']) || '.pdf',
  'approved',
  CURRENT_TIMESTAMP - INTERVAL '25 days'
FROM operators WHERE email = 'silver.operator@test.com'
ON CONFLICT DO NOTHING;

-- Documents for Gold Operator (All Approved)
INSERT INTO operator_documents (
  operator_id, 
  document_type, 
  file_url, 
  file_name,
  verification_status,
  verified_at
) 
SELECT 
  id,
  unnest(ARRAY['business_license', 'tax_certificate', 'insurance_certificate', 'incorporation_document']),
  'https://storage.example.com/docs/gold_' || unnest(ARRAY['license', 'tax', 'insurance', 'incorporation']) || '.pdf',
  unnest(ARRAY['business_license', 'tax_certificate', 'insurance_certificate', 'incorporation_document']) || '.pdf',
  'approved',
  CURRENT_TIMESTAMP - INTERVAL '175 days'
FROM operators WHERE email = 'gold.operator@test.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. Sample Badges
-- ============================================

-- Bronze Operator: No badges yet
-- (Bronze operators need to earn badges)

-- Silver Operator: Verified + Rising Star
INSERT INTO operator_badges (operator_id, badge_type, badge_name, description, awarded_at)
SELECT 
  id,
  unnest(ARRAY['verified', 'rising_star']),
  unnest(ARRAY['Verified Operator', 'Rising Star']),
  unnest(ARRAY['Successfully verified business credentials', 'Rapidly growing booking performance']),
  CURRENT_TIMESTAMP - INTERVAL '25 days'
FROM operators WHERE email = 'silver.operator@test.com'
ON CONFLICT DO NOTHING;

-- Gold Operator: Multiple badges
INSERT INTO operator_badges (operator_id, badge_type, badge_name, description, awarded_at)
SELECT 
  id,
  unnest(ARRAY['verified', 'top_performer', 'trusted_partner', 'experienced']),
  unnest(ARRAY['Verified Operator', 'Top Performer', 'Trusted Partner', 'Experienced Professional']),
  unnest(ARRAY[
    'Successfully verified business credentials', 
    'Consistently high performance metrics',
    'Trusted partnership with the platform',
    'Over 200 successful bookings'
  ]),
  CURRENT_TIMESTAMP - INTERVAL '90 days'
FROM operators WHERE email = 'gold.operator@test.com'
ON CONFLICT DO NOTHING;

-- Platinum Operator: All premium badges
INSERT INTO operator_badges (operator_id, badge_type, badge_name, description, awarded_at)
SELECT 
  id,
  unnest(ARRAY['verified', 'top_performer', 'trusted_partner', 'experienced', 'premium_service', 'customer_favorite']),
  unnest(ARRAY['Verified Operator', 'Top Performer', 'Trusted Partner', 'Experienced Professional', 'Premium Service', 'Customer Favorite']),
  unnest(ARRAY[
    'Successfully verified business credentials', 
    'Consistently high performance metrics',
    'Trusted partnership with the platform',
    'Over 1000 successful bookings',
    'Premium service quality',
    '98% customer satisfaction rate'
  ]),
  CURRENT_TIMESTAMP - INTERVAL '180 days'
FROM operators WHERE email = 'platinum.operator@test.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. Summary Query for Verification
-- ============================================

-- Verify tier distribution
SELECT 
  tier,
  COUNT(*) as operator_count,
  AVG(trust_score) as avg_trust_score,
  SUM(total_bookings) as total_bookings
FROM operators
GROUP BY tier
ORDER BY 
  CASE tier
    WHEN 'platinum' THEN 1
    WHEN 'gold' THEN 2
    WHEN 'silver' THEN 3
    WHEN 'bronze' THEN 4
  END;

COMMENT ON TABLE operator_documents IS 'Sample documents for testing verification workflows';
COMMENT ON TABLE operator_badges IS 'Sample badges for testing achievement system';
