"use server";

import { DeveloperService } from '@/services/developer.service';
import { DeveloperFormData, developerSchema } from '@/schemas/developer.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDeveloperAction(data: DeveloperFormData) {
  // Validate data
  const validated = developerSchema.parse(data);
  
  // Call service
  await DeveloperService.createDeveloper(validated);
  
  // Revalidate cache and redirect
  revalidatePath('/admin/developers');
  redirect('/admin/developers');
}

export async function updateDeveloperAction(id: string, data: DeveloperFormData) {
  const validated = developerSchema.parse(data);
  await DeveloperService.updateDeveloper(id, validated);
  revalidatePath('/admin/developers');
  redirect('/admin/developers');
}

export async function deleteDeveloperAction(id: string) {
  await DeveloperService.deleteDeveloper(id);
  revalidatePath('/admin/developers');
}
