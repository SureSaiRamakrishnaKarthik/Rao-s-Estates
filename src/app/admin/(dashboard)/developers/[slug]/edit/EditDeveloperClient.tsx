"use client";

import React, { useState } from 'react';
import DeveloperForm from '@/components/forms/DeveloperForm';
import PageHeader from '@/components/ui/PageHeader';
import { updateDeveloperAction } from '../../actions';
import { DeveloperFormData } from '@/schemas/developer.schema';
import { Developer } from '@/types/developer';
import { toast } from 'sonner';

export default function EditDeveloperClient({ developer }: { developer: Developer }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: DeveloperFormData) => {
    setIsSubmitting(true);
    try {
      await updateDeveloperAction(developer.id, data);
      toast.success('Developer updated successfully');
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Edit Developer" 
        description={`Update information for ${developer.name}.`}
      />
      <DeveloperForm 
        mode="edit" 
        developer={developer}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
