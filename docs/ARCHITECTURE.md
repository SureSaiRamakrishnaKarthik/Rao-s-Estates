# Architecture & Workflow

This document details the overarching philosophy, folder structure, and workflows that power the Rao's Estates platform.

## The Core Philosophy: Projects vs Properties
The platform revolves around the concept of **Projects**, not just properties. Because the business handles open plots, apartments, commercial lands, farm lands, and villa projects, a single "Project" entity is required to model all of these dynamically using `project_types` (rather than hardcoded enums). 

## Primary Business Workflow
Our goal is to follow a strict data lifecycle where admin tools and data ingestion run first, followed by public consumption:

```text
Developer Added
      ↓
Location Added
      ↓
Project Imported (via Importer)
      ↓
Images Downloaded
      ↓
Admin Reviews (Status: Draft)
      ↓
Project Published (Status: Published)
      ↓
Homepage Automatically Updates
      ↓
Customer Views Project & Submits Lead
      ↓
CRM Tracks Lead (Status: New -> Interested -> Closed)
```

## Folder Structure (Feature-Based)

The codebase utilizes a domain-driven, feature-based folder structure inside the `src/` directory to keep everything organized and scalable:

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # Global UI Components (Button, Modal, etc.)
├── features/             # Domains (React Components scoped to specific features)
│   ├── projects/
│   ├── locations/
│   ├── developers/
│   └── admin/
├── lib/
│   ├── supabase/         # Supabase client.ts, server.ts
│   └── utils/
├── services/             # Service Layer classes (Separation of concerns)
│   ├── project.service.ts
│   ├── developer.service.ts
│   ├── location.service.ts
│   ├── media.service.ts
│   ├── lead.service.ts
│   └── import.service.ts
├── types/                # Normalized TypeScript Definitions
│   ├── project.ts
│   ├── developer.ts
│   ├── location.ts
│   └── lead.ts
├── hooks/                # Custom React Hooks
└── scripts/              # Automated Sync / Importer Scripts
```

## The Service Layer
To prevent our React components from being polluted with raw Supabase queries, we abstract data fetching into `src/services/`.

For example, instead of querying `supabase.from('projects').select('*')` directly inside a component, we use:
```typescript
import { getFeaturedProjects } from '@/services/project.service';
```
This keeps our components clean, makes testing easier, and centralizes all database logic.

## Importer Architecture
The platform is built to ingest data from third-party developer websites (e.g., Sri Bhramara). To make this efficient, the `projects` table includes:
- `sync_hash`: A hash of the project data to easily diff changes without re-downloading everything.
- `last_synced_at`: Tracking the exact time of the last sync.

The importer service compares the remote hash to the local `sync_hash` and updates only what has changed, keeping API and database load minimal.
