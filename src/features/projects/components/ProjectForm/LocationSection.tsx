"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { SelectField } from '@/components/ui/forms/SelectField';
import { FormField } from '@/components/ui/forms/FormField';
import { Developer } from '@/types/developer';
import { Location } from '@/types/location';

interface LocationSectionProps {
  developers: Developer[];
  locations: Location[];
}

export function LocationSection({ developers, locations }: LocationSectionProps) {
  const { register, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <FormSection 
      title="Location & Classification" 
      description="Assign this project to a developer and region."
    >
      <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <SelectField
            label="Developer"
            {...register('developer_id')}
            error={errors.developer_id?.message}
            options={developers.map(d => ({ label: d.name, value: d.id }))}
          />
        </div>

        <div className="sm:col-span-1">
          <SelectField
            label="Location"
            {...register('location_id')}
            error={errors.location_id?.message}
            options={locations.map(l => ({ label: l.name, value: l.id }))}
          />
        </div>
        
        {/* Note: In a real app we'd fetch project_types from DB. 
            For now we can hardcode or pass them in as well. 
            The schema expects project_type_id to be a UUID.
            Let's assume projectTypes is passed in future, but we'll add it here when ready.
        */}

        <div className="sm:col-span-2">
          <FormField
            label="Google Maps URL"
            {...register('google_map_url')}
            error={errors.google_map_url?.message}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="sm:col-span-1">
          <FormField
            label="Latitude"
            type="number"
            step="any"
            {...register('latitude')}
            error={errors.latitude?.message}
            placeholder="e.g. 17.3850"
          />
        </div>

        <div className="sm:col-span-1">
          <FormField
            label="Longitude"
            type="number"
            step="any"
            {...register('longitude')}
            error={errors.longitude?.message}
            placeholder="e.g. 78.4867"
          />
        </div>
      </div>
    </FormSection>
  );
}
