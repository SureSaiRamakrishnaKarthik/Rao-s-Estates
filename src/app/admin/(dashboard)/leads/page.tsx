import React from 'react';
import { createClient } from '@/lib/supabase/server';
import LeadsClient from './LeadsClient';

export default async function LeadsPage() {
  const supabase = await createClient();
  
  // Fetch leads, most recent first
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      *,
      projects (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Leads Registry</h1>
          <p className="text-sm text-stone-500 mt-1">Manage inquiries from contact forms and property pages.</p>
        </div>
      </div>

      <LeadsClient initialLeads={leads || []} />
    </div>
  );
}