import React from 'react';
import { LocationService } from '@/services/location.service';
import { notFound } from 'next/navigation';
import EditLocationClient from "./EditLocationClient";

export default async function EditLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = await LocationService.getLocationBySlug(resolvedParams.slug);

  if (!location) {
    notFound();
  }

  return <EditLocationClient location={location} />;
}
