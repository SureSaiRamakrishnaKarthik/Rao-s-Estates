"use server";

import { LocationService } from '@/services/location.service';
import { LocationFormData, locationSchema } from '@/schemas/location.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLocationAction(data: LocationFormData) {
  const validated = locationSchema.parse(data);
  await LocationService.createLocation(validated);
  revalidatePath('/admin/locations');
  redirect('/admin/locations');
}

export async function updateLocationAction(id: string, data: LocationFormData) {
  const validated = locationSchema.parse(data);
  await LocationService.updateLocation(id, validated);
  revalidatePath('/admin/locations');
  redirect('/admin/locations');
}

export async function deleteLocationAction(id: string) {
  await LocationService.deleteLocation(id);
  revalidatePath('/admin/locations');
}
