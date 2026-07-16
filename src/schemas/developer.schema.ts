import { z } from 'zod';

export const developerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
});

export type DeveloperFormData = z.infer<typeof developerSchema>;
