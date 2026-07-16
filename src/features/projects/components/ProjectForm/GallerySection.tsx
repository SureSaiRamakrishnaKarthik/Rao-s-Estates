"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { ImageUploader } from '@/components/ui/ImageUploader';

export function GallerySection() {
  const { control, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <FormSection 
      title="Media Gallery" 
      description="Upload high quality images for the project. The first image will be set as the cover."
    >
      <Controller
        name="media"
        control={control}
        render={({ field }) => (
          <ImageUploader
            bucket="projects"
            value={field.value}
            onChange={field.onChange}
            maxFiles={20}
            multiple={true}
            accept="image/*"
            error={errors.media?.message}
          />
        )}
      />
    </FormSection>
  );
}
