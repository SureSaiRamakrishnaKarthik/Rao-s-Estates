# Feature: Developer CRUD

## Overview
The Developer CRUD (Create, Read, Update, Delete) module allows administrators to manage real estate developers. Developers are entities that build or own the real estate projects listed on the platform (e.g., "Sri Lakshmi Builders").

## Key Components

### 1. Data Schema (`src/schemas/developer.schema.ts`)
Validates developer data.
- **Fields:**
  - `name`: String, min 2 chars.
  - `slug`: String, lowercase alphanumeric and hyphens only.
  - `description`: Optional text.
  - `logo_url`: Optional URL.

### 2. Auto-Generating Slugs
The `DeveloperForm` automatically generates URL-friendly slugs using the `slugify` library. As the user types the developer's "Company Name," the slug field is automatically populated, ensuring compliance with the Zod regex validation without requiring manual formatting from the user.

### 3. Unified Form Component (`src/components/forms/DeveloperForm.tsx`)
A highly reusable React Hook Form component used for both creating and editing developers. It accepts a `mode` prop (`'create' | 'edit'`) and `initialData` to determine its behavior. The UI is designed with premium aesthetics, utilizing custom `FormSection` and input components.

### 4. Database Interaction (`src/services/developer.service.ts`)
Handles the Supabase queries:
- `getAllDevelopers()`
- `getDeveloperBySlug()`
- `createDeveloper()`
- `updateDeveloper()`
- `deleteDeveloper()`

### 5. Routing
- **List:** `/admin/developers` (Uses `DevelopersClient.tsx` for rendering the Data Table)
- **Create:** `/admin/developers/new`
- **Edit:** `/admin/developers/[slug]/edit`
