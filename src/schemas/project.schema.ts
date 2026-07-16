import { z } from 'zod';
import { UploadedImage } from '@/components/ui/ImageUploader/types';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  developer_id: z.string().uuid('Please select a developer').nullable().optional(),
  location_id: z.string().uuid('Please select a location').nullable().optional(),
  project_type_id: z.string().uuid('Please select a project type').nullable().optional(),
  
  construction_status: z.enum(['upcoming', 'ongoing', 'completed']),
  publish_status: z.enum(['draft', 'published', 'archived']),
  
  starting_price: z.coerce.number().min(0, 'Starting price cannot be negative').optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  approval_type: z.string().optional(),
  
  google_map_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  
  brochure_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  
  amenity_ids: z.array(z.string().uuid()).default([]),
  
  media: z.array(z.object({
    id: z.string(),
    url: z.string(),
    isCover: z.boolean(),
    // We don't validate File objects here since they are handled by the uploader
  })).default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
