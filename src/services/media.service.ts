import { createClient } from '@/lib/supabase/server';
import { Media } from '@/types/media';

export class MediaService {
  static async getProjectGallery(projectId: string): Promise<Media[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
      
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async uploadImage(bucket: string, path: string, file: File): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    
    if (error) throw new Error(error.message);
    return data.path;
  }

  static async getPublicUrl(bucket: string, path: string): Promise<string> {
    const supabase = await createClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
