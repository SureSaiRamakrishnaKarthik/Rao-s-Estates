"use client";

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { FormField } from '@/components/ui/forms/FormField';
import { TextareaField } from '@/components/ui/forms/TextareaField';
import slugify from 'slugify';

interface GeneralSectionProps {
  mode: 'create' | 'edit';
}

export function GeneralSection({ mode }: GeneralSectionProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectFormData>();
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === 'edit');
  
  const titleValue = watch('title');

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!isSlugManuallyEdited && titleValue) {
      const generatedSlug = slugify(titleValue, { lower: true, strict: true });
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [titleValue, isSlugManuallyEdited, setValue]);

  return (
    <FormSection 
      title="General Information" 
      description="Basic details about the project."
    >
      <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            label="Project Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g. Sri City Phase 1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <FormField
            label="Slug (URL friendly)"
            {...register('slug')}
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              setValue('slug', e.target.value, { shouldValidate: true });
            }}
            error={errors.slug?.message}
            prefixNode="raosestates.com/projects/"
            placeholder="sri-city-phase-1"
            helperText="Auto-generated from title. Lowercase letters, numbers, and hyphens only."
            required
          />
        </div>

        <div className="sm:col-span-2">
          <TextareaField
            label="Short Description"
            {...register('short_description')}
            error={errors.short_description?.message}
            placeholder="A brief summary for cards and thumbnails..."
            rows={2}
          />
        </div>

        <div className="sm:col-span-2">
          <TextareaField
            label="Full Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Detailed description of the project..."
            rows={5}
          />
        </div>
      </div>
    </FormSection>
  );
}
