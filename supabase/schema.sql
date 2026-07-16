-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable moddatetime extension for updated_at tracking
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-------------------------------------------------------
-- PROFILES (Linked to Supabase Auth)
-------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin',
    name TEXT,
    avatar TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-------------------------------------------------------
-- SETTINGS (Key-Value Store)
-------------------------------------------------------
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    type TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Settings are editable by authenticated users" ON settings FOR ALL TO authenticated USING (true);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-------------------------------------------------------
-- DEVELOPERS
-------------------------------------------------------
CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Developers viewable by everyone" ON developers FOR SELECT USING (true);
CREATE POLICY "Developers editable by authenticated" ON developers FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- LOCATIONS
-------------------------------------------------------
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Locations viewable by everyone" ON locations FOR SELECT USING (true);
CREATE POLICY "Locations editable by authenticated" ON locations FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- PROJECT_TYPES
-------------------------------------------------------
CREATE TABLE project_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project_Types viewable by everyone" ON project_types FOR SELECT USING (true);
CREATE POLICY "Project_Types editable by authenticated" ON project_types FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- PROJECTS
-------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    project_type_id UUID REFERENCES project_types(id) ON DELETE SET NULL,
    
    construction_status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming, ongoing, completed
    publish_status TEXT NOT NULL DEFAULT 'draft',         -- draft, published, archived
    
    starting_price NUMERIC,
    short_description TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT false,
    approval_type TEXT,
    
    google_map_url TEXT,
    latitude FLOAT,
    longitude FLOAT,
    
    brochure_url TEXT,
    thumbnail TEXT,
    
    -- Importer Fields
    import_source TEXT,
    source_url TEXT,
    source_project_id TEXT,
    sync_hash TEXT,
    last_synced_at TIMESTAMPTZ,
    
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects viewable by everyone" ON projects FOR SELECT USING (publish_status = 'published');
CREATE POLICY "All projects viewable by authenticated" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Projects editable by authenticated" ON projects FOR ALL TO authenticated USING (true);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-------------------------------------------------------
-- MEDIA
-------------------------------------------------------
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    bucket TEXT NOT NULL,
    path TEXT NOT NULL,
    type TEXT NOT NULL,
    size INT,
    is_cover BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media viewable by everyone" ON media FOR SELECT USING (true);
CREATE POLICY "Media editable by authenticated" ON media FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- AMENITIES
-------------------------------------------------------
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT
);

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Amenities viewable by everyone" ON amenities FOR SELECT USING (true);
CREATE POLICY "Amenities editable by authenticated" ON amenities FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- PROJECT_AMENITIES
-------------------------------------------------------
CREATE TABLE project_amenities (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, amenity_id)
);

ALTER TABLE project_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project_Amenities viewable by everyone" ON project_amenities FOR SELECT USING (true);
CREATE POLICY "Project_Amenities editable by authenticated" ON project_amenities FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- LEADS (CRM)
-------------------------------------------------------
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- new, interested, site_visit, closed
    source TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Only authenticated users (admins) can view leads, but anyone can insert (submit a form)
CREATE POLICY "Leads insertable by everyone" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Leads viewable by authenticated" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leads editable by authenticated" ON leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Leads deletable by authenticated" ON leads FOR DELETE TO authenticated USING (true);

-------------------------------------------------------
-- IMPORT_LOGS
-------------------------------------------------------
CREATE TABLE import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    projects_synced INT DEFAULT 0,
    images_downloaded INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    duration INT,
    raw_response TEXT,
    pending_changes JSONB
);

ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Import logs only accessible by authenticated" ON import_logs FOR ALL TO authenticated USING (true);

-------------------------------------------------------
-- SEED BASIC DATA (Optional but helpful)
-------------------------------------------------------
INSERT INTO project_types (name, slug) VALUES 
('Open Plot', 'open-plot'),
('Apartment', 'apartment'),
('Villa', 'villa'),
('Farm Land', 'farm-land'),
('Commercial Plot', 'commercial-plot') ON CONFLICT DO NOTHING;


-------------------------------------------------------
-- INDEXES
-------------------------------------------------------
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_developer_id ON projects(developer_id);
CREATE INDEX idx_projects_location_id ON projects(location_id);
CREATE INDEX idx_projects_publish_status ON projects(publish_status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_last_synced_at ON projects(last_synced_at);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_developers_slug ON developers(slug);
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_media_project_id ON media(project_id);
CREATE INDEX idx_leads_project_id ON leads(project_id);



-------------------------------------------------------
-- ACTIVITY LOGS (Audit Trail)
-------------------------------------------------------
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activity logs only viewable by authenticated" ON activity_logs FOR ALL TO authenticated USING (true);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

