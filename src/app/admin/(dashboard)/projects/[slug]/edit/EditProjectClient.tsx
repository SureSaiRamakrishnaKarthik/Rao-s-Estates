"use client";

import React from 'react';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import PageHeader from '@/components/ui/PageHeader';
import { updateProjectAction } from '../../actions';
import { ProjectFormData } from '@/schemas/project.schema';
import { Developer } from '@/types/developer';
import { Location } from '@/types/location';
import { CheckboxOption } from '@/components/ui/forms/CheckboxGrid';

interface EditProjectClientProps {
  project: any;
  developers: Developer[];
  locations: Location[];
  amenities: CheckboxOption[];
}

export default function EditProjectClient({ project, developers, locations, amenities }: EditProjectClientProps) {
  
  const handleSubmit = async (data: ProjectFormData) => {
    // Pass the project.id as the first argument to the action
    await updateProjectAction(project.id, data);
  };

  return (
    <div>
      <PageHeader 
        title="Edit Project" 
        description={`Update information for ${project.title}.`}
      />
      <div className="mt-8">
        <ProjectForm 
          mode="edit" 
          initialData={project}
          developers={developers}
          locations={locations}
          amenities={amenities}
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
