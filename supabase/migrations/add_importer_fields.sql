-- Migration: Add property_types column to projects table
-- Run this in your Supabase SQL Editor

-- 1. Add property_types array column to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS property_types text[] DEFAULT NULL;

-- 2. Add import_source and last_synced_at if not present
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS import_source text DEFAULT NULL;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS last_synced_at timestamptz DEFAULT NULL;

-- 3. Ensure media.type column supports 'layout' and 'location_map' values
-- (The column already exists as text, so no change needed — just documenting)
-- media.type accepts: 'image', 'layout', 'location_map'

-- 4. Add short_description if not present (should already exist from earlier migration)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS short_description text DEFAULT NULL;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
