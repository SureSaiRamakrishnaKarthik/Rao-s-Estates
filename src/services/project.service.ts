import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import { ProjectFormData } from '@/schemas/project.schema';

export class ProjectService {
  static async getAllProjects(searchQuery?: string): Promise<Project[]> {
    const supabase = await createClient();
    let query = supabase
      .from('projects')
      .select('*, developers(name), locations(name)')
      .order('created_at', { ascending: false });
      
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getFeaturedProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, developers(*), locations(*), media(*)')
      .eq('featured', true)
      .eq('publish_status', 'published')
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getProjectBySlug(slug: string): Promise<any | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, developers(*), locations(*), media(*), project_amenities(amenities(*))')
      .eq('slug', slug)
      .single();
      
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async createProject(formData: ProjectFormData): Promise<Project> {
    const supabase = await createClient();
    
    // 1. Insert Project
    const { amenity_ids, media, ...projectData } = formData;
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        thumbnail: media.find(m => m.isCover)?.url || media[0]?.url || null,
        published_at: projectData.publish_status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();
      
    if (projectError) throw new Error(projectError.message);

    // 2. Insert Amenities
    if (amenity_ids.length > 0) {
      const amenityInserts = amenity_ids.map(id => ({
        project_id: project.id,
        amenity_id: id
      }));
      const { error: amenityError } = await supabase.from('project_amenities').insert(amenityInserts);
      if (amenityError) throw new Error(amenityError.message);
    }

    // 3. Insert Media
    if (media.length > 0) {
      const mediaInserts = media.map((m, index) => {
        // extract path from url for simplicity: url is .../projects/filepath
        const urlParts = m.url.split('/');
        const path = urlParts[urlParts.length - 1];
        
        return {
          project_id: project.id,
          bucket: 'projects',
          path: path || m.id,
          type: 'image',
          is_cover: m.isCover,
          sort_order: index,
        };
      });
      const { error: mediaError } = await supabase.from('media').insert(mediaInserts);
      if (mediaError) throw new Error(mediaError.message);
    }

    return project;
  }

  static async updateProject(id: string, formData: ProjectFormData): Promise<Project> {
    const supabase = await createClient();
    
    // 1. Update Project
    const { amenity_ids, media, ...projectData } = formData;
    
    // check if it wasn't published before, but is now
    let published_at = undefined;
    if (projectData.publish_status === 'published') {
      const { data: oldProj } = await supabase.from('projects').select('publish_status, published_at').eq('id', id).single();
      if (oldProj && oldProj.publish_status !== 'published') {
        published_at = new Date().toISOString();
      }
    }

    const updatePayload: any = {
      ...projectData,
      thumbnail: media.find(m => m.isCover)?.url || media[0]?.url || null,
    };
    if (published_at) updatePayload.published_at = published_at;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
      
    if (projectError) throw new Error(projectError.message);

    // 2. Update Amenities (Delete all, then insert new)
    await supabase.from('project_amenities').delete().eq('project_id', id);
    if (amenity_ids.length > 0) {
      const amenityInserts = amenity_ids.map(aid => ({
        project_id: id,
        amenity_id: aid
      }));
      await supabase.from('project_amenities').insert(amenityInserts);
    }

    // 3. Update Media (Delete all, then insert new)
    // Note: the actual files in storage are managed by ImageUploader, this just updates DB links
    await supabase.from('media').delete().eq('project_id', id);
    if (media.length > 0) {
      const mediaInserts = media.map((m, index) => {
        const urlParts = m.url.split('/');
        const path = urlParts[urlParts.length - 1];
        
        return {
          project_id: id,
          bucket: 'projects',
          path: path || m.id,
          type: 'image',
          is_cover: m.isCover,
          sort_order: index,
        };
      });
      await supabase.from('media').insert(mediaInserts);
    }

    return project;
  }

  static async deleteProject(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
