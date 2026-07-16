import slugify from 'slugify';
import { ParsedProject, NormalizedProject } from '../types';
import config from '../config/sribhramara';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Map of location name → canonical project type (best guess if not in description) */
const LOCATION_FALLBACK: Record<string, string> = {
  // Districts / major cities
  Guntur: 'Guntur',
  Bapatla: 'Bapatla',
  Darsi: 'Darsi',
  Vinukonda: 'Vinukonda',
  Kanigiri: 'Kanigiri',
  Vijayawada: 'Vijayawada',
  Ongole: 'Ongole',
  Markapuram: 'Markapuram',
  Chirala: 'Chirala',
  Tenali: 'Tenali',
  Narasaraopet: 'Narasaraopet',
  Nellore: 'Nellore',
  Amaravati: 'Amaravati',
  Mangalagiri: 'Mangalagiri',
  // Villages / mandals discovered during scraping
  Edupugallu: 'Vijayawada',   // near Vijayawada in Krishna district
  Medaramatla: 'Ongole',      // near Ongole in Prakasam district
  Kaza: 'Guntur',             // near Guntur in Guntur district
  Gudavalli: 'Vijayawada',    // near Vijayawada in Krishna district
  Gangur: 'Guntur',           // near Guntur in Guntur district
  'Chinna Palakaluru': 'Guntur',
  'China Palakaluru': 'Guntur',
};

/** Map raw title keywords → a project type string that matches DB project_types */
const inferProjectType = (title: string, propertyTypes: string[], description: string): string => {
  const allText = `${title} ${propertyTypes.join(' ')} ${description}`.toLowerCase();

  if (allText.includes('villa') && !allText.includes('plot')) return 'Villas';
  if (allText.includes('villa plot')) return 'Villa Plots';
  if (allText.includes('open plot') || allText.includes('residential plot')) return 'Open Plots';
  if (allText.includes('commercial plot') || allText.includes('commercial space')) return 'Commercial Plots';
  if (allText.includes('duplex')) return 'Duplex Houses';
  if (allText.includes('simplex') || allText.includes('independent house')) return 'Independent Houses';
  if (allText.includes('apartment')) return 'Apartments';
  if (allText.includes('farm') || allText.includes('agricultural')) return 'Farm Plots';

  // If the propertyTypes list has multiple, return the first one found
  if (propertyTypes.length > 0) return propertyTypes[0];

  return 'Open Plots'; // Safe default
};

/** Infer construction status from title / description text */
const inferConstructionStatus = (
  rawStatus: string | undefined,
  title: string,
  description: string
): 'upcoming' | 'ongoing' | 'completed' => {
  const text = `${rawStatus ?? ''} ${title} ${description}`.toLowerCase();
  if (text.includes('completed') || text.includes('ready to occupy') || text.includes('sold out')) return 'completed';
  if (text.includes('upcoming') || text.includes('pre-launch') || text.includes('coming soon')) return 'upcoming';
  return 'ongoing';
};

/** Parse a price string into a numeric value (in rupees) */
const parsePrice = (raw: string | undefined): number | undefined => {
  if (!raw) return undefined;
  // Remove currency symbols and commas
  const cleaned = raw.replace(/[₹Rs.,INR\s]/gi, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
};

// ─────────────────────────────────────────────────────────────────────────────
// Normalizer
// ─────────────────────────────────────────────────────────────────────────────

export class SriBhramaraNormalizer {
  normalize(raw: ParsedProject): NormalizedProject {

    // ── Title & Slug ─────────────────────────────────────────────────────────
    const title = raw.rawTitle.trim();
    const slug = raw.sourceId
      ? raw.sourceId.replace(/\/$/, '')       // use WP slug directly (most reliable)
      : slugify(title, { lower: true, strict: true });

    // ── Location ─────────────────────────────────────────────────────────────
    const location =
      LOCATION_FALLBACK[raw.rawLocationText ?? ''] ??
      raw.rawLocationText ??
      'Unknown';

    // ── Project Type ─────────────────────────────────────────────────────────
    const projectType = inferProjectType(
      title,
      raw.rawPropertyTypes ?? [],
      raw.rawDescription ?? ''
    );

    // ── Construction Status ───────────────────────────────────────────────────
    const constructionStatus = inferConstructionStatus(
      undefined,
      title,
      raw.rawDescription ?? ''
    );

    // ── Price ─────────────────────────────────────────────────────────────────
    const price = parsePrice(raw.rawPrice);

    // ── Short Description ─────────────────────────────────────────────────────
    // Prefer SEO description (most concise), then first paragraph
    const shortDescription =
      raw.seoDescription ??
      raw.rawShortDescription ??
      raw.rawDescription?.split('\n\n')[0]?.substring(0, 300);

    // ── Full Description ──────────────────────────────────────────────────────
    const description = raw.rawDescription || shortDescription;

    // ── Media ─────────────────────────────────────────────────────────────────
    // Hero image: first hero-classified image, falling back to first gallery
    const heroImage =
      raw.rawHeroImages[0] ??
      raw.rawGalleryImages[0] ??
      undefined;

    // Compose images array: hero(s) first, then gallery
    const allImages = [
      ...raw.rawHeroImages,
      ...raw.rawGalleryImages,
    ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate preserving order

    return {
      title,
      slug,
      developer: config.developer,
      sourceUrl: raw.sourceUrl,
      sourceId: raw.sourceId,

      shortDescription,
      description,

      location,
      googleMapsUrl: raw.rawGoogleMapsUrl,

      heroImage,
      images: allImages,
      layoutImages: raw.rawLayoutImages.length > 0 ? raw.rawLayoutImages : undefined,
      locationMapUrl: raw.rawLocationMapUrl,

      amenities: [...new Set(raw.rawFeatures)],
      propertyTypes: raw.rawPropertyTypes.length > 0 ? raw.rawPropertyTypes : undefined,
      projectType,
      constructionStatus,
      approvalType: raw.rawApprovalType,
      price,
      area: raw.rawArea,

      brochureUrl: raw.rawBrochureUrl,
      layoutPdfUrl: raw.rawLayoutPdfUrl,
    };
  }
}
