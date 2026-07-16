-------------------------------------------------------
-- 1. CREATE STORAGE BUCKETS
-------------------------------------------------------
-- Note: Running this directly in the SQL Editor works for Supabase.
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('projects', 'projects', true),
  ('developers', 'developers', true),
  ('brochures', 'brochures', true),
  ('logos', 'logos', true),
  ('testimonials', 'testimonials', true),
  ('blog', 'blog', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to all buckets for reading
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('projects', 'developers', 'brochures', 'logos', 'testimonials', 'blog', 'avatars'));
CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Updates" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Deletes" ON storage.objects FOR DELETE TO authenticated USING (true);


-------------------------------------------------------
-- 2. SEED REALISTIC DATA
-------------------------------------------------------

-- Developer: Sri Bhramara
INSERT INTO developers (id, name, slug, logo_url, description)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Sri Bhramara Townships',
    'sri-bhramara',
    'https://via.placeholder.com/150?text=Sri+Bhramara',
    'Premium township developers based in Andhra Pradesh, delivering high-quality open plots and gated communities.'
) ON CONFLICT (id) DO NOTHING;

-- Location: Markapur
INSERT INTO locations (id, name, slug, description)
VALUES (
    'L0000000-0000-0000-0000-000000000001',
    'Markapur',
    'markapur',
    'A rapidly growing town known for its strategic location and excellent real estate potential.'
) ON CONFLICT (id) DO NOTHING;

-- Project Type: Open Plot
INSERT INTO project_types (id, name, slug)
VALUES (
    't0000000-0000-0000-0000-000000000001',
    'Open Plot',
    'open-plot'
) ON CONFLICT (id) DO NOTHING;

-- Project: Sri City
INSERT INTO projects (
    id, title, slug, developer_id, location_id, project_type_id,
    construction_status, publish_status, starting_price,
    short_description, description, featured
) VALUES (
    'p0000000-0000-0000-0000-000000000001',
    'Sri City (Phase 1)',
    'sri-city-phase-1',
    'd0000000-0000-0000-0000-000000000001', -- Sri Bhramara
    'L0000000-0000-0000-0000-000000000001', -- Markapur
    't0000000-0000-0000-0000-000000000001', -- Open Plot
    'ongoing',
    'published',
    1500000,
    'Premium CRDA approved open plots in the heart of Markapur.',
    'Sri City is a meticulously planned gated community offering premium open plots with world-class amenities including black-top roads, underground drainage, and round-the-clock security.',
    true
) ON CONFLICT (id) DO NOTHING;

-- Amenities: Seed basic ones
INSERT INTO amenities (id, name, icon)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Black Top Roads', 'road'),
    ('a0000000-0000-0000-0000-000000000002', 'Underground Electricity', 'zap'),
    ('a0000000-0000-0000-0000-000000000003', 'Water Connection', 'droplet')
ON CONFLICT (name) DO NOTHING;

-- Link Amenities to Sri City
INSERT INTO project_amenities (project_id, amenity_id)
VALUES 
    ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
    ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- Media (Gallery for Sri City)
-- We use placeholder URLs so the frontend has immediate data, though real ones will eventually live in the storage buckets
INSERT INTO media (id, project_id, bucket, path, type, is_cover, sort_order)
VALUES 
    (uuid_generate_v4(), 'p0000000-0000-0000-0000-000000000001', 'projects', 'https://via.placeholder.com/800x600?text=Sri+City+Cover', 'image', true, 1),
    (uuid_generate_v4(), 'p0000000-0000-0000-0000-000000000001', 'projects', 'https://via.placeholder.com/800x600?text=Sri+City+Layout', 'image', false, 2),
    (uuid_generate_v4(), 'p0000000-0000-0000-0000-000000000001', 'projects', 'https://via.placeholder.com/800x600?text=Sri+City+Park', 'image', false, 3)
ON CONFLICT DO NOTHING;
