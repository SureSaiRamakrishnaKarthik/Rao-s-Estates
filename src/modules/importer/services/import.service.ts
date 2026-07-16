import { NormalizedProject } from '../types';
import { MediaService } from './MediaService';
import { adminClient } from '../../../lib/supabase/admin';
import config from '../config/sribhramara';

const mediaService = new MediaService();

export interface LoadResult {
  status: 'inserted' | 'updated' | 'failed' | 'dry-run';
  imagesUploaded: number;
}

export class ImportService {
  constructor(private isDryRun: boolean = false) { }

  async load(project: NormalizedProject): Promise<LoadResult> {
    try {
      // 0. Idempotency Check
      const { data: existingProject } = await adminClient
        .from('projects')
        .select('id')
        .eq('slug', project.slug)
        .single();

      const willUpdate = !!existingProject;

      if (this.isDryRun) {
        console.log(`      [DRY-RUN] Would ${willUpdate ? 'update' : 'insert'}: ${project.title}`);
        console.log(`        └─ slug: ${project.slug}`);
        console.log(`        └─ location: ${project.location}`);
        console.log(`        └─ type: ${project.projectType}`);
        console.log(`        └─ images: ${project.images.length} | layout: ${(project.layoutImages ?? []).length}`);
        console.log(`        └─ amenities: ${project.amenities.length}`);
        return { status: willUpdate ? 'updated' : 'inserted', imagesUploaded: 0 };
      }

      // 1. Create or Find Developer
      let developerId: string | null = null;
      const { data: devData } = await adminClient
        .from('developers')
        .select('id')
        .ilike('name', `%${project.developer}%`)
        .maybeSingle();

      if (devData) {
        developerId = devData.id;
      } else {
        const devSlug = project.developer.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { data: newDev, error: devError } = await adminClient
          .from('developers')
          .insert({ name: project.developer, slug: devSlug })
          .select('id')
          .single();

        if (!devError && newDev) {
          developerId = newDev.id;
        } else {
          throw new Error(`Failed to create developer: ${devError?.message}`);
        }
      }

      // 2. Create or Find Location
      let locationId: string | null = null;
      if (project.location && project.location !== 'Unknown') {
        const locSlug = project.location.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { data: locData } = await adminClient
          .from('locations')
          .select('id')
          .or(`name.ilike.${project.location},slug.eq.${locSlug}`)
          .maybeSingle();

        if (locData) {
          locationId = locData.id;
        } else {
          const { data: newLoc, error: locError } = await adminClient
            .from('locations')
            .insert({ name: project.location, slug: locSlug })
            .select('id')
            .single();

          if (!locError && newLoc) {
            locationId = newLoc.id;
          } else if (locError) {
            console.error(`      ⚠️ Failed to insert location '${project.location}':`, locError.message);
          }
        }
      }

      // 3. Find or Create Project Type
      let projectTypeId: string | null = null;
      if (project.projectType) {
        const { data: typeData } = await adminClient
          .from('project_types')
          .select('id')
          .ilike('name', `%${project.projectType.replace(/_/g, ' ')}%`)
          .maybeSingle();

        if (typeData) projectTypeId = typeData.id;
      }

      // 4. Create or Update Project
      const projectPayload: Record<string, any> = {
        title: project.title,
        slug: project.slug,
        developer_id: developerId,
        location_id: locationId,
        project_type_id: projectTypeId,
        short_description: project.shortDescription ?? null,
        description: project.description ?? null,
        construction_status: project.constructionStatus ?? 'ongoing',
        publish_status: 'published',
        featured: true,
        approval_type: project.approvalType ?? null,
        starting_price: typeof project.price === 'number' ? project.price : null,
        brochure_url: project.brochureUrl ?? null,
        google_map_url: project.googleMapsUrl ?? null,
        thumbnail: project.heroImage ?? project.images[0] ?? null,
        property_types: project.propertyTypes && project.propertyTypes.length > 0 ? project.propertyTypes : null,
        source_url: project.sourceUrl,
        import_source: 'SriBhramaraImporter',
        last_synced_at: new Date().toISOString(),
      };

      const { data: projectData, error: projectError } = await adminClient
        .from('projects')
        .upsert(projectPayload, { onConflict: 'slug' })
        .select('id')
        .single();

      if (projectError || !projectData) {
        throw new Error(`Failed to insert/update project: ${projectError?.message}`);
      }

      const projectId = projectData.id;

      // 5. Save Amenities
      if (project.amenities.length > 0) {
        // Clear existing amenities for this project before re-inserting
        await adminClient.from('project_amenities').delete().eq('project_id', projectId);

        for (const amenityName of project.amenities) {
          if (!amenityName || amenityName.length < 2) continue;

          let amenityId: string | null = null;
          const { data: existingAmenity } = await adminClient
            .from('amenities')
            .select('id')
            .ilike('name', amenityName)
            .maybeSingle();

          if (existingAmenity) {
            amenityId = existingAmenity.id;
          } else {
            const { data: newAmenity } = await adminClient
              .from('amenities')
              .insert({ name: amenityName, icon: 'CheckCircle' })
              .select('id')
              .single();
            if (newAmenity) amenityId = newAmenity.id;
          }

          if (amenityId) {
            await adminClient.from('project_amenities').insert({
              project_id: projectId,
              amenity_id: amenityId,
            });
          }
        }
      }

      // 6. Save Media (gallery + layout images)
      let successfulImages = 0;

      // Build the full media list: gallery images + layout images (tagged separately)
      type MediaItem = { url: string; type: 'image' | 'layout' | 'location_map'; isCover: boolean };
      const mediaItems: MediaItem[] = [
        ...project.images.map((url, i) => ({
          url,
          type: 'image' as const,
          isCover: i === 0,
        })),
        ...(project.layoutImages ?? []).map(url => ({
          url,
          type: 'layout' as const,
          isCover: false,
        })),
        ...(project.locationMapUrl ? [{
          url: project.locationMapUrl,
          type: 'location_map' as const,
          isCover: false,
        }] : []),
      ];

      if (mediaItems.length > 0) {
        // Delete existing media records for this project
        await adminClient.from('media').delete().eq('project_id', projectId);

        const uploadPromises = mediaItems.map(async (item, i) => {
          const ext = item.url.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `${project.slug}-${item.type}-${i}.${ext}`;
          const path = `imports/${filename}`;

          const publicUrl = await mediaService.uploadExternalImage(item.url, filename);
          if (publicUrl) {
            const { error: mediaError } = await adminClient.from('media').insert({
              project_id: projectId,
              bucket: config.bucket,
              path,
              type: item.type,
              is_cover: item.isCover,
              sort_order: i,
            });

            if (mediaError) {
              console.error(`      ❌ Error inserting media record for '${project.title}':`, mediaError.message);
              return false;
            }
            return true;
          }
          return false;
        });

        const uploadResults = await Promise.all(uploadPromises);
        successfulImages = uploadResults.filter(Boolean).length;

        if (successfulImages < mediaItems.length) {
          console.warn(
            `      ⚠️  ${mediaItems.length - successfulImages} media item(s) failed for '${project.title}'.`
          );
        }
      }

      return {
        status: willUpdate ? 'updated' : 'inserted',
        imagesUploaded: successfulImages,
      };
    } catch (error: any) {
      console.error(`      ❌ Fatal Error loading '${project.title}':`, error.message);
      return { status: 'failed', imagesUploaded: 0 };
    }
  }
}
