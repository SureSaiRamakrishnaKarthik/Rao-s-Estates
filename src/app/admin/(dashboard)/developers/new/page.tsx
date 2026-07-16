"use client";

import React, { useState } from 'react';
import DeveloperForm from '@/components/forms/DeveloperForm';
import PageHeader from '@/components/ui/PageHeader';
import { createDeveloperAction } from '../actions';
import { DeveloperFormData } from '@/schemas/developer.schema';
import { toast } from 'sonner';

export default function NewDeveloperPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: DeveloperFormData) => {
    setIsSubmitting(true);
    try {
      await createDeveloperAction(data);
      toast.success('Developer created successfully');
    } catch (error) {
      setIsSubmitting(false);
      throw error; // Let the form catch and display it
    }
  };

  return (
    <div>
      <PageHeader 
        title="Add New Developer" 
        description="Create a new real estate developer profile."
      />
      <DeveloperForm 
        mode="create" 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
