export interface Lead {
  id: string;
  project_id?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'new' | 'interested' | 'site_visit' | 'closed';
  source?: string;
  assigned_to?: string;
  created_at: string;
}