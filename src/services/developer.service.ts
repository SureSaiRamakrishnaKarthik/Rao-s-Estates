import { createClient } from '@/lib/supabase/server';
import { Developer } from '@/types/developer';

export class DeveloperService {
  static async getAllDevelopers(searchQuery?: string): Promise<Developer[]> {
    const supabase = await createClient();
    let query = supabase.from('developers').select('*').order('created_at', { ascending: false });
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getDeveloperBySlug(slug: string): Promise<Developer | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error && error.code !== 'PGRST116') throw new Error(error.message); // Ignore no rows error
    return data;
  }

  static async createDeveloper(developer: Partial<Developer>): Promise<Developer> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('developers')
      .insert(developer)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateDeveloper(id: string, developer: Partial<Developer>): Promise<Developer> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('developers')
      .update(developer)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteDeveloper(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('developers')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(error.message);
  }
}
