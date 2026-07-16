"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema, LocationFormData } from '@/schemas/location.schema';
import { Location } from '@/types/location';
import FormSection from '@/components/ui/FormSection';
import { toast } from 'sonner';
import slugify from 'slugify';

interface LocationFormProps {
  mode: 'create' | 'edit';
  location?: Location;
  onSubmit: (data: LocationFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function LocationForm({ mode, location, onSubmit, isSubmitting }: LocationFormProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === 'edit');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      slug: location?.slug || '',
      description: location?.description || '',
    },
  });

  const nameValue = watch('name');

  // Auto-generate slug when name changes, if user hasn't manually edited the slug
  useEffect(() => {
    if (!isSlugManuallyEdited && nameValue) {
      const generatedSlug = slugify(nameValue, { lower: true, strict: true });
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, isSlugManuallyEdited, setValue]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setValue('slug', e.target.value, { shouldValidate: true });
  };

  const onFormSubmit = async (data: LocationFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error?.message?.includes('NEXT_REDIRECT')) throw error;
      toast.error(error.message || 'Something went wrong');
    }
  };

  const inputClass = "block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 bg-white";

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl">
      <FormSection 
        title="Location Information" 
        description="Add a new city or region where projects are located."
      >
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Location Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                {...register('name')}
                className={inputClass}
                placeholder="e.g. Markapur"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
              Slug (URL friendly) <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-4 text-gray-500 sm:text-sm bg-gray-50">
                raosestates.com/locations/
              </span>
              <input
                type="text"
                id="slug"
                {...register('slug')}
                onChange={handleSlugChange}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white transition-all duration-200"
                placeholder="markapur"
              />
            </div>
            {errors.slug && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.slug.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Auto-generated from name. Lowercase letters, numbers, and hyphens only.</p>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                rows={5}
                {...register('description')}
                className={inputClass}
                placeholder="Brief description of the region and its real estate potential..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end gap-x-4 mb-12">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Location' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
