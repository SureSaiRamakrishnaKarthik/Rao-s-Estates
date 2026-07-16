export interface Media {
  id: string;
  project_id: string;
  bucket: string;
  path: string;
  type: string;
  size?: number;
  is_cover: boolean;
  sort_order: number;
  alt_text?: string;
  created_at: string;
}