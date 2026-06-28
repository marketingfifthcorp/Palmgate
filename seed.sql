-- ============================================================
-- Palmgate — Sample Property Seed Data
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

INSERT INTO properties (
  slug, title, description, type, availability, condition,
  price, currency, bedrooms, bathrooms, area_sqft,
  location_name, community, emirate, lat, lng,
  developer, completion_date, payment_plan, amenities,
  featured, published
) VALUES

-- 1. Downtown Dubai Penthouse
(
  'sky-penthouse-downtown-dubai',
  'Sky Penthouse — Downtown Dubai',
  'An extraordinary full-floor penthouse crowning one of Downtown Dubai''s most iconic towers. Panoramic views of the Burj Khalifa and Dubai Fountain from every room. Private pool, cinema room, and a dedicated butler service. This is the pinnacle of Dubai living.',
  'penthouse', 'for_sale', 'ready',
  42000000, 'AED', 5, 6, 9200,
  'Emaar Square', 'Downtown Dubai', 'Dubai', 25.1972, 55.2744,
  'Emaar', NULL, NULL,
  ARRAY['Private Pool','Home Cinema','Smart Home','Butler Service','Concierge','Valet Parking','Gym','Spa','Wine Cellar','Panoramic Views'],
  true, true
),

-- 2. Palm Jumeirah Signature Villa
(
  'signature-villa-palm-jumeirah',
  'Signature Beachfront Villa — Palm Jumeirah',
  'A spectacular five-bedroom beachfront villa on the prestigious Palm Jumeirah fronds. Featuring a private beach, infinity pool, and unobstructed views of the Arabian Gulf and Dubai skyline. Completed to the highest specification with designer interiors.',
  'villa', 'for_sale', 'ready',
  28500000, 'AED', 6, 7, 11800,
  'The Fronds', 'Palm Jumeirah', 'Dubai', 25.1124, 55.1390,
  'Nakheel', NULL, NULL,
  ARRAY['Private Beach','Infinity Pool','Home Automation','Maid''s Room','Driver''s Room','Gym','Sauna','BBQ Area','6-Car Garage','Boat Dock'],
  true, true
),

-- 3. Dubai Marina Luxury Apartment
(
  'luxury-2bed-dubai-marina',
  '2-Bedroom Apartment — Dubai Marina',
  'Stunning 2-bedroom apartment in the heart of Dubai Marina with sweeping marina and sea views. Fully furnished to a high standard, with access to a rooftop infinity pool and direct access to the Marina Walk.',
  'apartment', 'for_sale', 'ready',
  3200000, 'AED', 2, 2, 1450,
  'Marina Promenade', 'Dubai Marina', 'Dubai', 25.0805, 55.1403,
  'Emaar', NULL, NULL,
  ARRAY['Infinity Pool','Gym','Concierge','Marina View','Covered Parking','Storage Room'],
  true, true
),

-- 4. Business Bay Office
(
  '1bed-business-bay-for-rent',
  '1-Bedroom Apartment for Rent — Business Bay',
  'Modern 1-bedroom apartment in Business Bay with Burj Khalifa and canal views. Premium finishes throughout, fully fitted kitchen, and access to a resort-style pool deck. Available for annual rental.',
  'apartment', 'for_rent', 'ready',
  110000, 'AED', 1, 1, 820,
  'Executive Towers', 'Business Bay', 'Dubai', 25.1882, 55.2589,
  NULL, NULL, NULL,
  ARRAY['Pool','Gym','24hr Security','Canal View','Covered Parking'],
  false, true
),

-- 5. DIFC Serviced Apartment
(
  'residence-difc-3bed',
  '3-Bedroom Residence — DIFC',
  'Ultra-luxury 3-bedroom residence in the prestigious DIFC, steps from the world''s finest dining and the Gate Village. Full floor-to-ceiling glazing, designer kitchen, and unrivalled city skyline views. Managed by a 5-star hotel brand.',
  'apartment', 'for_sale', 'ready',
  9800000, 'AED', 3, 3, 2900,
  'Gate Avenue', 'DIFC', 'Dubai', 25.2111, 55.2796,
  'ICD Brookfield', NULL, NULL,
  ARRAY['Concierge','Spa','Gym','Restaurant Access','Valet','Sky Pool','Business Lounge'],
  true, true
),

-- 6. Arabian Ranches Villa for Sale
(
  'villa-arabian-ranches-4bed',
  '4-Bedroom Villa — Arabian Ranches III',
  'Elegant 4-bedroom villa in the family-friendly Arabian Ranches III community. Corner plot with extended garden, private pool, and backing onto the championship golf course. Single-row with no rear neighbours.',
  'villa', 'for_sale', 'ready',
  7200000, 'AED', 4, 4, 4800,
  'Sun', 'Arabian Ranches III', 'Dubai', 25.0285, 55.2649,
  'Emaar', NULL, NULL,
  ARRAY['Private Pool','Garden','Golf View','Maid''s Room','Double Garage','Community Club','Kids Play Area'],
  false, true
),

-- 7. JVC 1-Bed for Rent
(
  'apartment-jvc-1bed-rent',
  '1-Bedroom Apartment for Rent — Jumeirah Village Circle',
  'Contemporary 1-bedroom apartment in a well-managed building in JVC. Bright and spacious with a large balcony, open-plan kitchen, and access to a shared pool and gym. Walking distance to Circle Mall.',
  'apartment', 'for_rent', 'ready',
  72000, 'AED', 1, 1, 750,
  'District 11', 'Jumeirah Village Circle', 'Dubai', 25.0541, 55.2081,
  NULL, NULL, NULL,
  ARRAY['Pool','Gym','Balcony','Covered Parking','Kids Play Area'],
  false, true
),

-- 8. Off-Plan — Sobha Seahaven
(
  'sobha-seahaven-tower-a',
  'Sobha Seahaven Tower A — Dubai Harbour',
  'Waterfront living at its finest. Seahaven Tower A rises above Dubai Harbour with uninterrupted views of the Arabian Gulf and Palm Jumeirah. Handcrafted by Sobha Realty with marble interiors, a sky pool at Level 52, and a private beach access.',
  'apartment', 'for_sale', 'off_plan',
  4200000, 'AED', 2, 2, 1380,
  'Dubai Harbour', 'Dubai Harbour', 'Dubai', 25.0856, 55.1330,
  'Sobha Realty', '2026-12-31', '{"down":20,"during":40,"handover":40}',
  ARRAY['Sky Pool (Level 52)','Private Beach','Gym','Spa','Concierge','Marina View','Rooftop Lounge'],
  true, true
),

-- 9. Off-Plan — Creek Harbour
(
  'emaar-creek-waters-2',
  'Creek Waters 2 — Dubai Creek Harbour',
  'The second phase of Emaar''s landmark Creek Waters development, set within the master-planned Dubai Creek Harbour. Stunning lagoon and Burj Khalifa views, resort-style amenities across four levels, and flexible 60/40 payment plan.',
  'apartment', 'for_sale', 'off_plan',
  2400000, 'AED', 2, 2, 1150,
  'Creek Island', 'Dubai Creek Harbour', 'Dubai', 25.2047, 55.3516,
  'Emaar', '2027-03-31', '{"down":10,"during":50,"handover":40}',
  ARRAY['Lagoon Pool','Kids Splash Pad','Gym','Retail Promenade','Creek View','Running Track'],
  false, true
),

-- 10. Off-Plan Townhouse
(
  'damac-lagoons-morocco',
  'Damac Lagoons — Morocco Cluster Townhouse',
  'A premium 3-bedroom townhouse in Damac Lagoons'' Morocco cluster, inspired by Moroccan coastal architecture. Overlooking crystalline lagoons with a beach-style lifestyle in the heart of Dubai. Exclusive community facilities including a private beach and waterside dining.',
  'townhouse', 'for_sale', 'off_plan',
  2100000, 'AED', 3, 3, 2200,
  'Morocco Cluster', 'Damac Hills 2', 'Dubai', 24.9856, 55.2105,
  'Damac', '2026-06-30', '{"down":20,"during":40,"handover":40}',
  ARRAY['Private Lagoon Beach','Water Sports','Waterside Restaurants','Kids Waterpark','Gym','Community Pool'],
  false, true
),

-- 11. Emirates Hills Mansion
(
  'emirates-hills-mansion-grand',
  'Grand Mansion — Emirates Hills',
  'An architectural masterpiece set on an elevated corner plot in the most exclusive address in Dubai. Seven bedrooms, a temperature-controlled wine cellar, home cinema, indoor squash court, and sprawling manicured gardens with a resort-style pool. Available fully furnished.',
  'villa', 'for_sale', 'ready',
  68000000, 'AED', 7, 8, 21500,
  'Sector E', 'Emirates Hills', 'Dubai', 25.0729, 55.1667,
  'Custom Built', NULL, NULL,
  ARRAY['Resort Pool','Home Cinema','Wine Cellar','Squash Court','Staff Quarters','8-Car Garage','Smart Home','Landscaped Garden','Golf View'],
  true, true
),

-- 12. Studio for Rent in Dubai Marina
(
  'studio-dubai-marina-rent',
  'Studio Apartment for Rent — Dubai Marina',
  'Fully furnished studio in a premium Dubai Marina tower with partial sea views. Ideal for professionals and couples. Building amenities include a rooftop infinity pool, gym, and 24hr security. High floor with open views.',
  'apartment', 'for_rent', 'ready',
  68000, 'AED', 0, 1, 520,
  'Marina Gate', 'Dubai Marina', 'Dubai', 25.0760, 55.1370,
  NULL, NULL, NULL,
  ARRAY['Rooftop Pool','Gym','Concierge','Fully Furnished','High Floor','Sea View'],
  false, true
);

-- ============================================================
-- Property Images (Unsplash placeholder photos)
-- storage_path = full URL → getPublicUrl() passes it through as-is
-- ============================================================

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&auto=format',
  'Sky Penthouse — Downtown Dubai', true, 0
FROM properties WHERE slug = 'sky-penthouse-downtown-dubai';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&auto=format',
  'Signature Beachfront Villa — Palm Jumeirah', true, 0
FROM properties WHERE slug = 'signature-villa-palm-jumeirah';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1582407947304-fd86f28320ad?w=1200&h=800&fit=crop&auto=format',
  '2-Bedroom Apartment — Dubai Marina', true, 0
FROM properties WHERE slug = 'luxury-2bed-dubai-marina';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop&auto=format',
  '1-Bedroom Apartment for Rent — Business Bay', true, 0
FROM properties WHERE slug = '1bed-business-bay-for-rent';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&h=800&fit=crop&auto=format',
  '3-Bedroom Residence — DIFC', true, 0
FROM properties WHERE slug = 'residence-difc-3bed';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop&auto=format',
  '4-Bedroom Villa — Arabian Ranches III', true, 0
FROM properties WHERE slug = 'villa-arabian-ranches-4bed';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&auto=format',
  '1-Bedroom Apartment for Rent — JVC', true, 0
FROM properties WHERE slug = 'apartment-jvc-1bed-rent';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=1200&h=800&fit=crop&auto=format',
  'Sobha Seahaven Tower A — Dubai Harbour', true, 0
FROM properties WHERE slug = 'sobha-seahaven-tower-a';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop&auto=format',
  'Creek Waters 2 — Dubai Creek Harbour', true, 0
FROM properties WHERE slug = 'emaar-creek-waters-2';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&auto=format',
  'Damac Lagoons — Morocco Cluster Townhouse', true, 0
FROM properties WHERE slug = 'damac-lagoons-morocco';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&h=800&fit=crop&auto=format',
  'Grand Mansion — Emirates Hills', true, 0
FROM properties WHERE slug = 'emirates-hills-mansion-grand';

INSERT INTO property_images (property_id, storage_path, alt, is_primary, display_order)
SELECT id,
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&auto=format',
  'Studio Apartment for Rent — Dubai Marina', true, 0
FROM properties WHERE slug = 'studio-dubai-marina-rent';

-- ============================================================
-- Update site_content stats to match seed data
-- ============================================================

UPDATE site_content SET value = '12+' WHERE key = 'stats_properties_sold';
UPDATE site_content SET value = '10+' WHERE key = 'stats_years_experience';
UPDATE site_content SET value = '500+' WHERE key = 'stats_happy_clients';
UPDATE site_content SET value = '15+' WHERE key = 'stats_communities';
