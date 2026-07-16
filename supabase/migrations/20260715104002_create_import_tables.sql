-- Create developer_sources table
CREATE TABLE public.developer_sources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    website text NOT NULL,
    api_type text NOT NULL CHECK (api_type IN ('wordpress', 'elementor', 'custom', 'shopify', 'nextjs')),
    scraping_strategy text,
    enabled boolean DEFAULT true,
    last_import timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create import_jobs table
CREATE TABLE public.import_jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED')),
    started_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    finished_at timestamp with time zone,
    duration integer, -- in seconds
    projects_found integer DEFAULT 0,
    new_projects integer DEFAULT 0,
    changed_projects integer DEFAULT 0,
    failed_projects integer DEFAULT 0,
    logs jsonb DEFAULT '[]'::jsonb
);

-- Create pending_imports table
CREATE TABLE public.pending_imports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    parsed_data jsonb NOT NULL,
    diff jsonb,
    sync_hash text NOT NULL,
    source_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at timestamp with time zone,
    reviewed_by uuid -- In actual implementation, this could reference auth.users
);

-- Create RLS Policies for developer_sources
ALTER TABLE public.developer_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read developer_sources" ON public.developer_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert developer_sources" ON public.developer_sources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update developer_sources" ON public.developer_sources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete developer_sources" ON public.developer_sources FOR DELETE TO authenticated USING (true);

-- Create RLS Policies for import_jobs
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read import_jobs" ON public.import_jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert import_jobs" ON public.import_jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update import_jobs" ON public.import_jobs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete import_jobs" ON public.import_jobs FOR DELETE TO authenticated USING (true);

-- Create RLS Policies for pending_imports
ALTER TABLE public.pending_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read pending_imports" ON public.pending_imports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert pending_imports" ON public.pending_imports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update pending_imports" ON public.pending_imports FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete pending_imports" ON public.pending_imports FOR DELETE TO authenticated USING (true);
