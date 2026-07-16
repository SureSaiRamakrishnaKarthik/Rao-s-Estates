import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import { Developer } from '@/types/developer';
import { Location } from '@/types/location';

export interface HomepageData {
  featuredProjects: Project[];
  developers: Developer[];
  locations: Location[];
}

export class HomeService {
  static async getHomepageData(): Promise<HomepageData> {
    const supabase = await createClient();

    // Run queries in parallel for maximum performance
    const [
      { data: featuredProjects },
      { data: developers },
      { data: locations }
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('*, developers(*), locations(*), media(*)')
        .eq('featured', true)
        .eq('publish_status', 'published')
        .order('created_at', { ascending: false })
        .limit(6),
        
      supabase
        .from('developers')
        .select('*')
        .order('name', { ascending: true })
        .limit(8),
        
      supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true })
        .limit(8)
    ]);

    return {
      featuredProjects: featuredProjects || [],
      developers: developers || [],
      locations: locations || []
    };
  }
}
