"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import FormSection from '@/components/ui/FormSection';
import { FormField } from '@/components/ui/forms/FormField';

export function PricingSection() {
  const { register, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <FormSection 
      title="Pricing & Details" 
      description="Financial information and project specifications."
    >
      <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <FormField
            label="Starting Price (₹)"
            type="number"
            {...register('starting_price')}
            error={errors.starting_price?.message}
            placeholder="e.g. 1800000"
            helperText="Enter the full number (e.g. 1800000 for 18 Lakhs)"
          />
        </div>

        <div className="sm:col-span-1">
          <FormField
            label="Approval Type"
            {...register('approval_type')}
            error={errors.approval_type?.message}
            placeholder="e.g. DTCP, CRDA, APCRDA"
          />
        </div>
      </div>
    </FormSection>
  );
}
