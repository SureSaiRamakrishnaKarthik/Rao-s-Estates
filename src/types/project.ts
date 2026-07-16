export interface Project {
  id: string;
  title: string;
  slug: string;
  developer_id?: string;
  location_id?: string;
  project_type_id?: string;
  construction_status: 'upcoming' | 'ongoing' | 'completed';
  publish_status: 'draft' | 'published' | 'archived';
  starting_price?: number;
  short_description?: string;
  description?: string;
  featured: boolean;
  approval_type?: string;
  google_map_url?: string;
  latitude?: number;
  longitude?: number;
  brochure_url?: string;
  thumbnail?: string;
  import_source?: string;
  source_url?: string;
  source_project_id?: string;
  sync_hash?: string;
  last_synced_at?: string;
  published_at?: string;
  updated_at: string;
  created_at: string;
}