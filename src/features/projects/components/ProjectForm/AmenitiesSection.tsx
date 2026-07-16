"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { CheckboxGrid, CheckboxOption } from '@/components/ui/forms/CheckboxGrid';

interface AmenitiesSectionProps {
  amenities: CheckboxOption[];
}

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const { control, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <FormSection 
      title="Amenities" 
      description="Select all amenities available in this project."
    >
      <Controller
        name="amenity_ids"
        control={control}
        render={({ field }) => (
          <CheckboxGrid
            options={amenities}
            value={field.value}
            onChange={field.onChange}
            error={errors.amenity_ids?.message}
          />
        )}
      />
    </FormSection>
  );
}
