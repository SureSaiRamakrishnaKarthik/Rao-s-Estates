import React from 'react';
import { ProjectService } from '@/services/project.service';
import { notFound } from 'next/navigation';
import EditProjectClient from './EditProjectClient';
import { DeveloperService } from '@/services/developer.service';
import { LocationService } from '@/services/location.service';
import { createClient } from '@/lib/supabase/server';

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await ProjectService.getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const developers = await DeveloperService.getAllDevelopers();
  const locations = await LocationService.getAllLocations();
  
  const supabase = await createClient();
  const { data: amenities } = await supabase.from('amenities').select('*').order('name');

  return (
    <EditProjectClient 
      project={project}
      developers={developers}
      locations={locations}
      amenities={amenities?.map(a => ({ id: a.id, label: a.name, icon: a.icon })) || []}
    />
  );
}
