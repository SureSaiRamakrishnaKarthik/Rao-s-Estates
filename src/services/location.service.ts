import { createClient } from '@/lib/supabase/server';
import { Location } from '@/types/location';

export class LocationService {
  static async getAllLocations(searchQuery?: string): Promise<Location[]> {
    const supabase = await createClient();
    let query = supabase.from('locations').select('*').order('name', { ascending: true });
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getLocationBySlug(slug: string): Promise<Location | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async createLocation(location: Partial<Location>): Promise<Location> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateLocation(id: string, location: Partial<Location>): Promise<Location> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('locations')
      .update(location)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteLocation(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(error.message);
  }
}
