"use client";

import React, { useState } from 'react';
import LocationForm from '@/components/forms/LocationForm';
import PageHeader from '@/components/ui/PageHeader';
import { updateLocationAction } from '../../actions';
import { LocationFormData } from '@/schemas/location.schema';
import { Location } from '@/types/location';
import { toast } from 'sonner';

export default function EditLocationClient({ location }: { location: Location }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    try {
      await updateLocationAction(location.id, data);
      toast.success('Location updated successfully');
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Edit Location" 
        description={`Update information for ${location.name}.`}
      />
      <LocationForm 
        mode="edit" 
        location={location}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
