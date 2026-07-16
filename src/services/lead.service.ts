import { createClient } from '@/lib/supabase/server';
import { Lead } from '@/types/lead';

export class LeadService {
  static async submitLead(lead: Partial<Lead>): Promise<Lead> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }
}
