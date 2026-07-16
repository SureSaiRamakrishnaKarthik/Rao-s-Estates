"use client";

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/project.schema';
import { MapPin } from 'lucide-react';
import { Developer } from '@/types/developer';
import { Location } from '@/types/location';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectPreviewProps {
  locations: Location[];
  developers: Developer[];
}

export function ProjectPreview({ locations, developers }: ProjectPreviewProps) {
  const { control } = useFormContext<ProjectFormData>();
  const formData = useWatch({ control }) as Partial<ProjectFormData>;

  const locationName = locations.find(l => l.id === formData.location_id)?.name || 'Select Location';
  const developerName = developers.find(d => d.id === formData.developer_id)?.name || 'Developer Name';
  const coverImage = formData.media?.find(m => m.isCover)?.url || formData.media?.[0]?.url;

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            Live Preview
            <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
              {formData.publish_status || 'draft'}
            </span>
          </h3>
        </div>
        <div className="p-6">
          <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
            {/* Image Wrapper */}
            <div className="relative h-48 bg-gray-100">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt={formData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <span className="text-sm">No cover image</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {formData.featured && (
                  <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded shadow-sm">
                    FEATURED
                  </span>
                )}
                {formData.construction_status && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm capitalize">
                    {formData.construction_status}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                {developerName}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">
                {formData.title || 'Project Title'}
              </h4>
              
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{locationName}</span>
              </div>
              
              {formData.starting_price ? (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between">
                  <span className="text-gray-500 text-sm">Starting from</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{(Number(formData.starting_price)).toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between">
                  <span className="text-gray-400 text-sm italic">Price upon request</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            This is how the project card will appear on the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
