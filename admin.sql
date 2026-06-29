-- Run in Supabase SQL Editor
-- Creates admin login: admin@palmgate.ae / PalmgateAdmin2024!

-- Step 1: create the user
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@palmgate.ae',
  crypt('PalmgateAdmin2024!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}'
);

-- Step 2: link identity so email/password login works
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data,
  provider, created_at, updated_at, last_sign_in_at
)
SELECT
  gen_random_uuid(),
  email,
  id,
  json_build_object('sub', id::text, 'email', email)::jsonb,
  'email',
  NOW(), NOW(), NOW()
FROM auth.users
WHERE email = 'admin@palmgate.ae';
