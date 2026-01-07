-- Migration: Tier System Foundation
-- Description: Add tier system columns and tables
-- Date: 2024-01-20

-- ============================================
-- 1. Extend operators table with tier fields
-- ============================================

ALTER TABLE operators 
ADD COLUMN IF NOT EXISTS tier VARCHAR(10) DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS trust_score INT DEFAULT 50,
ADD COLUMN IF NOT EXISTS total_bookings INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS successful_bookings INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS cancelled_bookings INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_bookings_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_packages_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_tier_review_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS tier_upgraded_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- Add check constraint for tier values
ALTER TABLE operators 
ADD CONSTRAINT chk_operator_tier 
CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Add check constraint for verification status
ALTER TABLE operators 
ADD CONSTRAINT chk_verification_status 
CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected'));

-- ============================================
-- 2. Create operator_documents table
-- ============================================

CREATE TABLE IF NOT EXISTS operator_documents (
  id SERIAL PRIMARY KEY,
  operator_id INT NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  verification_status VARCHAR(20) DEFAULT 'pending',
  verified_by INT,
  verified_at TIMESTAMP,
  rejection_reason TEXT,
  expires_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_document_operator FOREIGN KEY (operator_id) 
    REFERENCES operators(id) ON DELETE CASCADE,
  CONSTRAINT chk_document_verification_status 
    CHECK (verification_status IN ('pending', 'approved', 'rejected', 'expired')),
  CONSTRAINT chk_document_type 
    CHECK (document_type IN ('business_license', 'tax_certificate', 'insurance_certificate', 'incorporation_document', 'bank_statement', 'id_verification', 'other'))
);

-- ============================================
-- 3. Create operator_badges table
-- ============================================

CREATE TABLE IF NOT EXISTS operator_badges (
  id SERIAL PRIMARY KEY,
  operator_id INT NOT NULL,
  badge_type VARCHAR(50) NOT NULL,
  badge_name VARCHAR(100),
  description TEXT,
  icon_url VARCHAR(255),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_visible BOOLEAN DEFAULT true,
  
  CONSTRAINT fk_badge_operator FOREIGN KEY (operator_id) 
    REFERENCES operators(id) ON DELETE CASCADE,
  CONSTRAINT chk_badge_type 
    CHECK (badge_type IN ('verified', 'top_performer', 'fast_responder', 'trusted_partner', 'experienced', 'rising_star', 'premium_service', 'customer_favorite'))
);

-- ============================================
-- 4. Create tier_configurations table
-- ============================================

CREATE TABLE IF NOT EXISTS tier_configurations (
  id SERIAL PRIMARY KEY,
  tier VARCHAR(10) UNIQUE NOT NULL,
  max_bookings_per_month INT NOT NULL,
  max_active_packages INT NOT NULL,
  max_pilgrims_per_booking INT NOT NULL,
  requires_escrow BOOLEAN DEFAULT false,
  escrow_percentage DECIMAL(5,2) DEFAULT 0,
  international_travel_allowed BOOLEAN DEFAULT false,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  priority_support BOOLEAN DEFAULT false,
  analytics_access BOOLEAN DEFAULT false,
  api_access BOOLEAN DEFAULT false,
  custom_branding BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_tier_configuration 
    CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'))
);

-- ============================================
-- 5. Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_operators_tier ON operators(tier);
CREATE INDEX IF NOT EXISTS idx_operators_verification_status ON operators(verification_status);
CREATE INDEX IF NOT EXISTS idx_operators_trust_score ON operators(trust_score);
CREATE INDEX IF NOT EXISTS idx_documents_operator_id ON operator_documents(operator_id);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON operator_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON operator_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_badges_operator_id ON operator_badges(operator_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON operator_badges(badge_type);

-- ============================================
-- 6. Add triggers for updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_operator_documents_updated_at 
  BEFORE UPDATE ON operator_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tier_configurations_updated_at 
  BEFORE UPDATE ON tier_configurations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Insert default tier configurations
-- ============================================

INSERT INTO tier_configurations (
  tier, 
  max_bookings_per_month, 
  max_active_packages, 
  max_pilgrims_per_booking,
  requires_escrow,
  escrow_percentage,
  international_travel_allowed,
  commission_rate,
  priority_support,
  analytics_access,
  api_access,
  custom_branding
) VALUES 
  ('bronze', 10, 3, 5, true, 20.00, false, 15.00, false, false, false, false),
  ('silver', 30, 10, 15, false, 0.00, true, 12.00, true, true, false, false),
  ('gold', 100, 25, 50, false, 0.00, true, 10.00, true, true, true, true),
  ('platinum', -1, -1, -1, false, 0.00, true, 8.00, true, true, true, true)
ON CONFLICT (tier) DO NOTHING;

COMMENT ON TABLE operators IS 'Enhanced operators table with tier system fields';
COMMENT ON TABLE operator_documents IS 'Stores verification documents uploaded by operators';
COMMENT ON TABLE operator_badges IS 'Stores achievement badges awarded to operators';
COMMENT ON TABLE tier_configurations IS 'Configurable limits and features for each tier level';
