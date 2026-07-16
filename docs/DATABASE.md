# Database Schema & Storage

This document details the Supabase database schema, storage buckets, and ER Diagram that powers the platform.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROFILES ||--o{ LEADS : "assigned to"
    DEVELOPER ||--o{ PROJECT : builds
    LOCATION ||--o{ PROJECT : contains
    PROJECT_TYPE ||--o{ PROJECT : categorizes
    PROJECT ||--o{ MEDIA : has
    PROJECT ||--o{ PROJECT_AMENITY : includes
    AMENITY ||--o{ PROJECT_AMENITY : links
    PROJECT ||--o{ LEADS : receives
    
    PROFILES {
        uuid id PK "references auth.users"
        string role
        string name
        string avatar
        string phone
        timestamp created_at
    }

    SETTINGS {
        string key PK
        string value
        string type
        timestamp updated_at
    }

    DEVELOPER {
        uuid id PK
        string name
        string slug
        string logo_url
        text description
        timestamp created_at
    }

    LOCATION {
        uuid id PK
        string name
        string slug
        string description
        timestamp created_at
    }

    PROJECT_TYPE {
        uuid id PK
        string name
        string slug
    }

    PROJECT {
        uuid id PK
        string title
        string slug
        uuid developer_id FK
        uuid location_id FK
        uuid project_type_id FK
        string construction_status "upcoming, ongoing, completed"
        string publish_status "draft, published, archived"
        numeric starting_price
        text short_description
        text description
        boolean featured
        string approval_type
        string google_map_url
        float latitude
        float longitude
        string brochure_url
        string thumbnail
        string import_source
        string source_url
        string source_project_id
        string sync_hash
        timestamp last_synced_at
        timestamp published_at
        timestamp updated_at
        timestamp created_at
    }

    MEDIA {
        uuid id PK
        uuid project_id FK
        string bucket
        string path
        string type
        int size
        boolean is_cover
        int sort_order
        string alt_text
        timestamp created_at
    }

    AMENITY {
        uuid id PK
        string name
        string icon
    }

    PROJECT_AMENITY {
        uuid project_id PK,FK
        uuid amenity_id PK,FK
    }

    LEADS {
        uuid id PK
        uuid project_id FK
        string name
        string phone
        string email
        text message
        string status
        string source
        uuid assigned_to FK
        timestamp created_at
    }

    IMPORT_LOG {
        uuid id PK
        uuid developer_id FK
        string status
        int projects_synced
        int images_downloaded
        text error_message
        timestamp started_at
        timestamp finished_at
        int duration
        text raw_response
    }
```

## Storage Buckets
The application relies on Supabase Storage for managing assets. We will create the following buckets:
- `projects` - High-resolution images of projects.
- `developers` - Assorted developer assets.
- `brochures` - PDF brochures for projects.
- `logos` - Logos for developers and site branding.
- `testimonials` - Images of happy customers.
- `blog` - Header images for blog posts.
- `avatars` - User profile pictures.

## Key Concepts

### 1. Settings Table
The `settings` table is a flexible Key-Value store. Instead of hardcoding columns like `Phone`, `Hero Title`, or `Footer` on a master table, we store them as individual rows. This allows the admin to dynamically add new configuration values without running database migrations.

### 2. Normalized Amenities
Amenities (e.g., "Black Top Road", "24/7 Security") are stored exactly once in the `amenities` table and linked to projects via the `project_amenities` join table.

### 3. Separation of Project Status
A project's lifecycle is tracked across two distinct states:
1. `construction_status`: The physical state of the project (Upcoming, Ongoing, Completed).
2. `publish_status`: The visibility of the project on the website (Draft, Published, Archived).
This guarantees that a project can be "Ongoing" but remain a "Draft" so it is not prematurely visible to users.

### 4. CRM / Leads
Every contact form submission and WhatsApp enquiry is pushed directly to the `leads` table. This allows the administrative backend to track a customer from `new` to `interested`, `site_visit`, and eventually `closed`.
