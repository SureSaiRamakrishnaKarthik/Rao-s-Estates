"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { SelectField } from '@/components/ui/forms/SelectField';
import { SwitchField } from '@/components/ui/forms/SwitchField';

export function PublishSection() {
  const { register, control, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <FormSection 
      title="Publishing & Visibility" 
      description="Control the lifecycle and visibility of the project on the public website."
    >
      <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <SelectField
            label="Construction Status"
            {...register('construction_status')}
            error={errors.construction_status?.message}
            options={[
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Ongoing', value: 'ongoing' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>

        <div className="sm:col-span-1">
          <SelectField
            label="Publish Status"
            {...register('publish_status')}
            error={errors.publish_status?.message}
            options={[
              { label: 'Draft (Hidden)', value: 'draft' },
              { label: 'Published (Live)', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ]}
          />
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-gray-100">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <SwitchField
                label="Featured Project"
                description="Display this project prominently on the homepage."
                checked={field.value}
                onChange={field.onChange}
                error={errors.featured?.message}
              />
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}
