# Feature: Project CRUD & Management

## Overview
The Project CRUD is the core of the admin platform. Because real estate projects contain extensive data (pricing, location, multimedia, status), the Project Form is modularized to prevent a single monolithic file and improve code maintainability.

## Modular Form Architecture (`src/features/projects/components/ProjectForm`)

The form is split into logical sections, all wrapped by a single `FormProvider` from `react-hook-form`:

1. **`GeneralSection.tsx`**: Manages Title, auto-generating Slug, and Descriptions.
2. **`PricingSection.tsx`**: Manages Starting Price (numeric coercion) and Approval Type (e.g., DTCP, CRDA).
3. **`LocationSection.tsx`**: Assigns the project to a Developer and Location (via relationship dropdowns) and captures geo-coordinates.
4. **`AmenitiesSection.tsx`**: Uses a dynamic `CheckboxGrid` to allow administrators to attach multiple amenities to a project.
5. **`GallerySection.tsx`**: Implements the custom `ImageUploader` for uploading project media directly to Supabase Storage.
6. **`PublishSection.tsx`**: Controls `construction_status` and `publish_status`, along with a boolean switch for `featured` properties.
7. **`ProjectPreview.tsx`**: A sticky sidebar component that uses `useWatch` to render a live preview of how the project card will look on the public website.

## Advanced Service Layer (`src/services/project.service.ts`)
The `createProject` and `updateProject` methods handle complex relational data insertions within a single conceptual transaction:
1. **Core Project Data:** Inserts into the `projects` table and extracts the designated cover image to set as the `thumbnail`.
2. **Project Amenities:** Iterates over the selected `amenity_ids` array to insert associative records into the `project_amenities` join table.
3. **Media Linking:** Maps over the uploaded image URLs to insert records into the `media` table, tracking file paths, buckets, and cover designations.
