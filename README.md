# Rao's Estates Portfolio

A premium, high-performance real estate advisory platform built for SV Krishna Rao. The platform showcases a curated selection of properties and layouts using an elegant, modern aesthetic featuring glassmorphism, dynamic micro-animations, and a luxurious color palette.

## 🏗️ Architecture

The application is built using a modern, scalable tech stack:

*   **Frontend**: Next.js 15 (App Router) + React 19
*   **Styling**: TailwindCSS (with custom configurations for luxury themes, gradients, and custom fonts like 'Outfit' and 'Inter')
*   **Backend / Database**: Supabase (PostgreSQL)
*   **Storage**: Supabase Storage for hosting high-resolution images, brochures, and layouts.
*   **Data Ingestion**: Custom Node.js/TypeScript scraping pipeline (Cheerio) to automate the import of property listings from external sources (e.g., SriBhramara).

## 🚀 How We Built It

### 1. Design & UI Implementation
We prioritized visual excellence to create a "Wow" factor. Instead of generic themes, we implemented a sophisticated aesthetic featuring:
*   **Soft Cloud Glow Effects** & **Aurora Backgrounds** using radial gradients.
*   **Smooth Scroll Reveal Animations** to make the interface feel alive and responsive as the user navigates.
*   **Sharp, Premium Component Design** matching high-end real estate standards (docked property banners, frosted glass overlays).

### 2. The Data Pipeline (Importer)
Instead of manually typing out property details, we built a robust, 2-stage automated importer to pull data seamlessly:
1.  **Discovery (Stage 1)**: The script fetches the primary listing pages to discover all active project URLs.
2.  **Extraction (Stage 2)**: The scraper individually visits every project URL to extract deep details: Titles, descriptions, locations, prices, construction status, galleries, master layouts, and entrance arches.
3.  **Normalization**: All scraped data is mapped to a strict `NormalizedProject` schema.
4.  **Media Uploading**: The pipeline downloads images from the external site and automatically uploads them to the Supabase `projects` storage bucket.
5.  **Smart Thumbnail Detection**: It analyzes image filenames (looking for keywords like "entrance", "arch", "gate", "front") to automatically assign the perfect "hero" thumbnail. If an entrance arch isn't found, it elegantly falls back to the master layout map, ensuring no broken or random gallery images are shown on property cards.

### 3. Manual Fallbacks & Overrides
To ensure total control over the presentation, we implemented a manual override system:
*   If a property requires a specific high-quality render that wasn't available on the scraped site, images can be manually placed in `public/images/manual-uploads/`.
*   A specialized Node script matches these local images to their respective database project slugs and updates the `thumbnail` column, allowing the Next.js frontend to instantly serve them.

## 🗄️ Database Schema

The PostgreSQL database (managed via Supabase) is highly relational and normalized:

*   **`locations`**: Stores regional data (e.g., Vinukonda, Markapur) to allow users to filter properties by city/area.
*   **`developers`**: Stores information about the builders (e.g., SriBhramara).
*   **`projects`**: The core table. Contains `title`, `slug`, `short_description`, `full_description`, `starting_price`, `project_type`, `construction_status`, `thumbnail` (hero image URL), `brochure_url`, and references to `location_id` and `developer_id`.
*   **`amenities`**: A master list of all possible amenities (e.g., "Underground Drainage", "DTCP Approved").
*   **`project_amenities`**: A junction table linking `projects` to their respective `amenities`.
*   **`media`**: Stores all gallery images, layout maps, and location maps for a project. Includes fields like `url`, `is_cover`, `type` (image, layout, location_map), and `sort_order`.

## 🛠️ Running the Project

1.  Install dependencies: `npm install`
2.  Setup environment variables in `.env.local` (Requires Supabase URL and Keys).
3.  Run the development server: `npm run dev`
4.  Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔄 Running the Importer
To sync the latest properties from the external source, you can run the importer pipeline:
\`\`\`bash
npx tsx src/scripts/test.ts
\`\`\`
*(Note: Requires `SUPABASE_SERVICE_ROLE_KEY` in your environment variables to bypass Row Level Security during ingestion).*