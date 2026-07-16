// ============================================================
// Importer Types — Raw (from parser) and Normalized (for DB)
// ============================================================

/**
 * Raw data extracted from the project LISTING page.
 * Used only to discover individual project URLs.
 */
export interface DiscoveredProject {
  /** The title extracted from the listing page card/heading */
  rawTitle: string;
  /** The direct URL to the individual project page */
  projectUrl: string;
  /** Thumbnail URL from the listing card (if available) */
  thumbnailUrl?: string;
  /** Status text from the listing card (e.g. "Ongoing", "Completed") */
  rawStatus?: string;
  /** Project type text from the listing card (e.g. "Open Plots") */
  rawProjectType?: string;
}

/**
 * Raw data extracted from a single PROJECT DETAIL page.
 * This is the authoritative data source.
 */
export interface ParsedProject {
  // Identity
  rawTitle: string;
  sourceUrl: string;
  sourceId?: string;         // e.g., the WP page slug

  // Content
  rawShortDescription?: string;
  rawDescription: string;

  // Location
  rawLocationText?: string;  // e.g. "Markapuram", "Bapatla"
  rawNearbyLandmarks?: string[];
  rawGoogleMapsUrl?: string;
  rawLocationMapUrl?: string; // URL of the static location map image

  // Media
  rawHeroImages: string[];    // Main cover/banner images
  rawGalleryImages: string[]; // Gallery / project photos
  rawLayoutImages: string[];  // Site layout / master plan images

  // Details
  rawFeatures: string[];      // Amenities / key features
  rawPropertyTypes: string[]; // e.g. ["Villa Plots", "Duplex Houses"]
  rawApprovalType?: string;   // e.g. "DTCP Approved", "RERA No. XYZ"
  rawPrice?: string;          // Raw price text, e.g. "₹ 4,500/sqyd onwards"
  rawArea?: string;           // e.g. "85 Acres"

  // Documents
  rawBrochureUrl?: string;    // PDF brochure link
  rawLayoutPdfUrl?: string;   // Downloadable site layout PDF

  // SEO / Meta
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Normalized, validated data ready to be loaded into the database.
 */
export interface NormalizedProject {
  // Identity
  title: string;
  slug: string;
  developer: string;
  sourceUrl: string;
  sourceId?: string;

  // Content
  shortDescription?: string;
  description?: string;

  // Location
  location: string;
  googleMapsUrl?: string;

  // Media
  heroImage?: string;         // Primary thumbnail (first hero image)
  images: string[];           // All gallery images
  layoutImages?: string[];    // Site layout images
  locationMapUrl?: string;    // Location map image

  // Details
  amenities: string[];
  propertyTypes?: string[];
  projectType: string;
  constructionStatus?: string;
  approvalType?: string;
  price?: string | number;
  area?: string;

  // Documents
  brochureUrl?: string;
  layoutPdfUrl?: string;
}

// Diff tracking (used for update detection)
export interface FieldDiff {
  old: any;
  new: any;
}

export interface ProjectDiff {
  [field: string]: FieldDiff;
}
