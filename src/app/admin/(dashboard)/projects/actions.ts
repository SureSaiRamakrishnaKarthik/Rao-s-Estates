"use server";

import { ProjectService } from '@/services/project.service';
import { ProjectFormData, projectSchema } from '@/schemas/project.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProjectAction(data: ProjectFormData) {
  const validated = projectSchema.parse(data);
  await ProjectService.createProject(validated);
  revalidatePath('/admin/projects');
  revalidatePath('/'); // Revalidate homepage since featured projects might change
  redirect('/admin/projects');
}

export async function updateProjectAction(id: string, data: ProjectFormData) {
  const validated = projectSchema.parse(data);
  await ProjectService.updateProject(id, validated);
  revalidatePath('/admin/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function deleteProjectAction(id: string) {
  await ProjectService.deleteProject(id);
  revalidatePath('/admin/projects');
  revalidatePath('/');
}
