-- ============================================================
-- Palmgate Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE property_type AS ENUM (
  'apartment', 'villa', 'townhouse', 'penthouse', 'office', 'land'
);

CREATE TYPE property_availability AS ENUM (
  'for_sale', 'for_rent'
);

CREATE TYPE property_condition AS ENUM (
  'ready', 'off_plan'
);

CREATE TYPE lead_source AS ENUM (
  'contact_form', 'property_inquiry', 'sell_with_us', 'newsletter'
);

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'lost'
);

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE properties (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  description       text,
  type              property_type NOT NULL,
  availability      property_availability NOT NULL,
  condition         property_condition NOT NULL,
  price             numeric NOT NULL,
  currency          text NOT NULL DEFAULT 'AED',
  bedrooms          int,
  bathrooms         int,
  area_sqft         numeric,
  location_name     text,
  community         text,
  emirate           text NOT NULL DEFAULT 'Dubai',
  lat               float,
  lng               float,
  developer         text,          -- off-plan only
  completion_date   date,          -- off-plan only
  payment_plan      jsonb,         -- e.g. {"down":10,"during":40,"handover":50}
  amenities         text[] NOT NULL DEFAULT '{}',
  featured          bool NOT NULL DEFAULT false,
  published         bool NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE property_images (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  storage_path    text NOT NULL,   -- e.g. properties/abc123/hero.jpg
  alt             text,
  is_primary      bool NOT NULL DEFAULT false,
  display_order   int NOT NULL DEFAULT 0,
  width           int,
  height          int
);

CREATE TABLE leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source          lead_source NOT NULL,
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text,
  message         text,
  property_id     uuid REFERENCES properties(id) ON DELETE SET NULL,
  status          lead_status NOT NULL DEFAULT 'new',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site_content (
  key             text PRIMARY KEY,
  value           text NOT NULL,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Property search / filtering
CREATE INDEX idx_properties_published ON properties(published);
CREATE INDEX idx_properties_availability ON properties(availability);
CREATE INDEX idx_properties_condition ON properties(condition);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_community ON properties(community);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_featured ON properties(featured);

-- Full-text search
ALTER TABLE properties ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(location_name, '') || ' ' ||
      coalesce(community, '') || ' ' ||
      coalesce(developer, '')
    )
  ) STORED;

CREATE INDEX idx_properties_fts ON properties USING gin(fts);

-- Images lookup
CREATE INDEX idx_property_images_property_id ON property_images(property_id);

-- Leads lookup
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_property_id ON leads(property_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public: read published properties only
CREATE POLICY "Public can read published properties"
  ON properties FOR SELECT
  USING (published = true);

-- Public: read images of published properties
CREATE POLICY "Public can read images of published properties"
  ON property_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id AND p.published = true
    )
  );

-- Public: read site_content
CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  USING (true);

-- Public: insert leads (anyone can submit a form)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Authenticated (admin): full access to all tables
CREATE POLICY "Admin full access to properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to property_images"
  ON property_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to site_content"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- SEED: site_content defaults
-- ============================================================

INSERT INTO site_content (key, value) VALUES
  ('stats_properties_sold',   '1,200+'),
  ('stats_years_experience',  '15+'),
  ('stats_happy_clients',     '3,500+'),
  ('stats_communities',       '50+'),
  ('hero_tagline',            'Find Your Dream Property in Dubai'),
  ('hero_subheading',         'Ready & Off-Plan Properties Across Dubai''s Finest Communities')
ON CONFLICT (key) DO NOTHING;
