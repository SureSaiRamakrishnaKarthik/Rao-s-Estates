import React from 'react';
import { DeveloperService } from '@/services/developer.service';
import { notFound } from 'next/navigation';
import EditDeveloperClient from './EditDeveloperClient';

export default async function EditDeveloperPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const developer = await DeveloperService.getDeveloperBySlug(resolvedParams.slug);

  if (!developer) {
    notFound();
  }

  return <EditDeveloperClient developer={developer} />;
}
