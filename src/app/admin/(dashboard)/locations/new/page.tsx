"use client";

import React, { useState } from 'react';
import LocationForm from '@/components/forms/LocationForm';
import PageHeader from '@/components/ui/PageHeader';
import { createLocationAction } from '../actions';
import { LocationFormData } from '@/schemas/location.schema';
import { toast } from 'sonner';

export default function NewLocationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    try {
      await createLocationAction(data);
      toast.success('Location created successfully');
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Add New Location" 
        description="Create a new region or city where projects are available."
      />
      <LocationForm 
        mode="create" 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
