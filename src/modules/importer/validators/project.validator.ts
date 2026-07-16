import { z } from 'zod';
import { NormalizedProject } from '../types';

export const NormalizedProjectSchema = z.object({
  // Identity
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  developer: z.string().min(2, 'Developer name is required'),
  sourceUrl: z.string().url('Source URL is required'),
  sourceId: z.string().optional(),

  // Content
  shortDescription: z.string().optional(),
  description: z.string().optional(),

  // Location
  location: z.string().min(2, 'Location must be at least 2 characters'),
  googleMapsUrl: z.string().url().optional().or(z.literal('')).or(z.undefined()),

  // Media
  heroImage: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  layoutImages: z.array(z.string().url()).optional(),
  locationMapUrl: z.string().url().optional(),

  // Details
  amenities: z.array(z.string()).default([]),
  propertyTypes: z.array(z.string()).optional(),
  projectType: z.string().min(2, 'Project type is required'),
  constructionStatus: z.string().optional(),
  approvalType: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  area: z.string().optional(),

  // Documents
  brochureUrl: z.string().url().optional().or(z.literal('')).or(z.undefined()),
  layoutPdfUrl: z.string().url().optional().or(z.literal('')).or(z.undefined()),
});

export class ProjectValidator {
  /**
   * Validates a normalized project.
   * Returns true if valid, or logs errors and returns false.
   */
  validate(project: any): project is NormalizedProject {
    const result = NormalizedProjectSchema.safeParse(project);

    if (!result.success) {
      console.error(`❌ Validation failed for project "${project.title || 'Unknown'}":`);
      result.error.issues.forEach(err => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`);
      });
      return false;
    }

    return true;
  }
}
