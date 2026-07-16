import React from 'react';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import PageHeader from '@/components/ui/PageHeader';
import { createProjectAction } from '../actions';
import { DeveloperService } from '@/services/developer.service';
import { LocationService } from '@/services/location.service';
import { createClient } from '@/lib/supabase/server';

export default async function NewProjectPage() {
  const developers = await DeveloperService.getAllDevelopers();
  const locations = await LocationService.getAllLocations();
  
  const supabase = await createClient();
  const { data: amenities } = await supabase.from('amenities').select('*').order('name');

  return (
    <div>
      <PageHeader 
        title="Add New Project" 
        description="Create a new real estate project and fill in all the details."
      />
      <div className="mt-8">
        <ProjectForm 
          mode="create"
          developers={developers}
          locations={locations}
          amenities={amenities?.map(a => ({ id: a.id, label: a.name, icon: a.icon })) || []}
          onSubmit={createProjectAction}
        />
      </div>
    </div>
  );
}
