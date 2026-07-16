"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '@/schemas/project.schema';
import { Developer } from '@/types/developer';
import { Location } from '@/types/location';
import { CheckboxOption } from '@/components/ui/forms/CheckboxGrid';
import { GeneralSection } from './GeneralSection';
import { PricingSection } from './PricingSection';
import { LocationSection } from './LocationSection';
import { AmenitiesSection } from './AmenitiesSection';
import { GallerySection } from './GallerySection';
import { PublishSection } from './PublishSection';
import { ProjectPreview } from './ProjectPreview';
import { toast } from 'sonner';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: any; // The raw project data from DB
  developers: Developer[];
  locations: Location[];
  amenities: CheckboxOption[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ mode, initialData, developers, locations, amenities, onSubmit }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map DB data to form data
  const defaultValues: Partial<ProjectFormData> = initialData ? {
    title: initialData.title || '',
    slug: initialData.slug || '',
    developer_id: initialData.developer_id || '',
    location_id: initialData.location_id || '',
    project_type_id: initialData.project_type_id || '',
    construction_status: initialData.construction_status || 'upcoming',
    publish_status: initialData.publish_status || 'draft',
    starting_price: initialData.starting_price || undefined,
    short_description: initialData.short_description || '',
    description: initialData.description || '',
    featured: initialData.featured || false,
    approval_type: initialData.approval_type || '',
    google_map_url: initialData.google_map_url || '',
    latitude: initialData.latitude || undefined,
    longitude: initialData.longitude || undefined,
    brochure_url: initialData.brochure_url || '',
    amenity_ids: initialData.project_amenities?.map((pa: any) => pa.amenity_id) || [],
    media: initialData.media?.map((m: any) => ({
      id: m.id,
      url: m.path.startsWith('http') ? m.path : `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/projects/${m.path}`, // very basic reconstruction if path only stored
      isCover: m.is_cover
    })) || []
  } : {
    title: '',
    slug: '',
    construction_status: 'upcoming',
    publish_status: 'draft',
    featured: false,
    amenity_ids: [],
    media: []
  };

  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues
  });

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error?.message?.includes('NEXT_REDIRECT')) throw error;
      toast.error(error.message || 'Something went wrong while saving the project.');
      setIsSubmitting(false); // only stop submitting if it fails, else let redirect happen
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="flex flex-col lg:flex-row gap-8 items-start relative pb-20">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8 w-full min-w-0">
          <GeneralSection mode={mode} />
          <PricingSection />
          <LocationSection developers={developers} locations={locations} />
          <AmenitiesSection amenities={amenities} />
          <GallerySection />
          <PublishSection />
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? 'Saving Project...' : mode === 'create' ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Sidebar / Live Preview */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <ProjectPreview locations={locations} developers={developers} />
        </div>
      </form>
    </FormProvider>
  );
}
