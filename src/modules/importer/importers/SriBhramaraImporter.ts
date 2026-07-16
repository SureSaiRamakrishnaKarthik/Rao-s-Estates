import * as cheerio from 'cheerio';
import { DiscoveredProject, ParsedProject } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const LISTING_PAGE_WP_API =
  'https://sribhramara.com/wp-json/wp/v2/pages?slug=ongoing-projects&_fields=content,link';

const BASE_URL = 'https://sribhramara.com';

/** Slugs that are top-level pages, not project pages */
const NON_PROJECT_PATHS = new Set([
  '/', '/ongoing-projects', '/completed-projects', '/about-us',
  '/contact-us', '/gallery', '/blog', '/sitemap',
]);

/** URL patterns that look like project detail pages */
const isProjectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'sribhramara.com') return false;
    const path = parsed.pathname.replace(/\/$/, '');
    if (NON_PROJECT_PATHS.has(path)) return false;
    if (parsed.pathname.includes('/wp-content/')) return false;
    if (parsed.pathname.includes('/wp-admin/')) return false;
    if (parsed.pathname.includes('/page/')) return false;
    // Must be a single-level path (e.g. /sri-city-markapuram/)
    const segments = path.split('/').filter(Boolean);
    return segments.length === 1;
  } catch {
    return false;
  }
};

/** Generic headings to skip on listing pages */
const LISTING_SKIP_HEADINGS = new Set([
  'Ongoing Projects',
  'Completed Projects',
  'SALIENT FEATURES',
  'Building Excellence',
  'A Tradition of Trust',
  'Right Investment - For Comfortable Future',
  'Our Projects',
  'Featured Projects',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Delay to be polite to the server */
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Fetch plain HTML from any URL */
async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImportBot/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Fetch JSON from WordPress REST API, return content.rendered string */
async function fetchWpPageContent(slug: string): Promise<string | null> {
  const url = `${BASE_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=content,title,slug,link`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data[0]) return null;
    return data[0].content?.rendered ?? null;
  } catch {
    return null;
  }
}

/** Extract slug from a sribhramara.com URL */
function extractSlug(url: string): string {
  return new URL(url).pathname.replace(/^\/|\/$/g, '');
}

/**
 * Classify an image URL by its likely role.
 * Returns 'hero' | 'layout' | 'locationmap' | 'gallery' | 'skip'
 */
function classifyImage(src: string, alt: string, title: string): 'hero' | 'layout' | 'locationmap' | 'gallery' | 'skip' {
  const lower = `${src} ${alt} ${title}`.toLowerCase();
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('whatsapp') || lower.includes('flag')) return 'skip';
  if (lower.includes('layout') || lower.includes('master-plan') || lower.includes('site-plan') || lower.includes('masterplan')) return 'layout';
  if (lower.includes('location-map') || lower.includes('locationmap') || lower.includes('location map')) return 'locationmap';
  if (lower.includes('cover') || lower.includes('banner') || lower.includes('coverpage') || lower.includes('hero')) return 'hero';
  return 'gallery';
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage 1: Discovery — extract project URLs from the listing page
// ─────────────────────────────────────────────────────────────────────────────

async function discoverProjectUrls(): Promise<DiscoveredProject[]> {
  console.log('[Stage 1] Fetching listing page via WP API...');

  const res = await fetch(LISTING_PAGE_WP_API);
  if (!res.ok) throw new Error(`Listing page fetch failed: ${res.statusText}`);
  const data = await res.json();

  if (!data?.[0]?.content?.rendered) {
    throw new Error('Could not extract content.rendered from listing page');
  }

  const html: string = data[0].content.rendered;
  const $ = cheerio.load(html);
  const discovered: DiscoveredProject[] = [];

  // --- Strategy A: Collect explicit <a href> links to project pages ---
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    if (!isProjectUrl(href)) return;

    // Try to find a title near this link
    const parentSection = $(el).closest('.elementor-top-section, .elementor-widget-wrap');
    const rawTitle =
      parentSection.find('h2, h3, h4').first().text().trim() ||
      $(el).text().trim() ||
      extractSlug(href);

    // Try to get a thumbnail image near this link
    const img = parentSection.find('img').first();
    const thumbnailUrl = img.attr('src') || img.attr('data-src') || undefined;

    if (!LISTING_SKIP_HEADINGS.has(rawTitle)) {
      discovered.push({
        rawTitle,
        projectUrl: href,
        thumbnailUrl,
        rawStatus: 'ongoing',
        rawProjectType: 'OPEN_PLOT',
      });
    }
  });

  // --- Strategy B: Find headings → look for a link in the same section ---
  if (discovered.length === 0) {
    $('h2.elementor-heading-title, h3.elementor-heading-title').each((_, el) => {
      const title = $(el).text().trim();
      if (LISTING_SKIP_HEADINGS.has(title) || !title) return;

      const section = $(el).closest('.elementor-top-section');
      const link = section.find('a[href*="sribhramara.com"]').first();
      const href = link.attr('href') ?? '';

      if (isProjectUrl(href)) {
        const img = section.find('img').first();
        discovered.push({
          rawTitle: title,
          projectUrl: href,
          thumbnailUrl: img.attr('src') || img.attr('data-src') || undefined,
          rawStatus: 'ongoing',
          rawProjectType: 'OPEN_PLOT',
        });
      }
    });
  }

  // Remove duplicates by URL
  const seen = new Set<string>();
  const unique = discovered.filter(d => {
    if (seen.has(d.projectUrl)) return false;
    seen.add(d.projectUrl);
    return true;
  });

  console.log(`[Stage 1] ✅ Discovered ${unique.length} project URLs`);
  unique.forEach(p => console.log(`   → [${p.rawTitle}] ${p.projectUrl}`));

  return unique;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage 2: Extraction — parse each individual project page
// ─────────────────────────────────────────────────────────────────────────────

async function parseProjectPage(
  discovered: DiscoveredProject,
): Promise<ParsedProject | null> {
  const slug = extractSlug(discovered.projectUrl);
  console.log(`\n[Stage 2] Parsing: ${discovered.projectUrl}`);

  // First try the WP API (fastest, gives clean rendered HTML)
  let html = await fetchWpPageContent(slug);
  let wpApiTitle: string | null = null;
  let seoTitle: string | undefined;
  let seoDescription: string | undefined;

  if (!html) {
    // Fall back to scraping the full HTML page
    console.log(`  ⚠️  WP API returned nothing for '${slug}'. Falling back to HTML scrape.`);
    try {
      const fullHtml = await fetchHtml(discovered.projectUrl);
      const page$ = cheerio.load(fullHtml);
      seoTitle = page$('title').text().trim() || undefined;
      seoDescription = page$('meta[name="description"]').attr('content') || undefined;
      // Extract main content div
      html = page$('#page, main, .site-main, body').html() ?? '';
    } catch (err: any) {
      console.error(`  ❌ Failed to scrape ${discovered.projectUrl}: ${err.message}`);
      return null;
    }
  } else {
    // Try to get SEO data from the WP API response
    try {
      const apiUrl = `${BASE_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=yoast_head_json,title`;
      const metaRes = await fetch(apiUrl);
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        if (metaData?.[0]) {
          wpApiTitle = metaData[0].title?.rendered ?? null;
          const yoast = metaData[0].yoast_head_json;
          seoTitle = yoast?.title ?? wpApiTitle ?? undefined;
          seoDescription = yoast?.description ?? undefined;
        }
      }
    } catch { /* ignore */ }
  }

  const $ = cheerio.load(html);

  // ── Title ──────────────────────────────────────────────────────────────────
  const rawTitle =
    $('h1.elementor-heading-title').first().text().trim() ||
    $('h1').first().text().trim() ||
    wpApiTitle ||
    discovered.rawTitle;

  // ── Hero Images ────────────────────────────────────────────────────────────
  const rawHeroImages: string[] = [];
  const rawGalleryImages: string[] = [];
  const rawLayoutImages: string[] = [];
  let rawLocationMapUrl: string | undefined;

  $('img').each((_, el) => {
    // Prefer the full-size src over srcset
    const src =
      $(el).attr('src') ||
      $(el).attr('data-src') ||
      $(el).attr('data-lazy-src') ||
      '';
    if (!src || !src.startsWith('http')) return;
    // Skip tiny thumbnails (width/height attribute checks)
    const w = parseInt($(el).attr('width') ?? '9999');
    const h = parseInt($(el).attr('height') ?? '9999');
    if (w > 0 && w < 100) return; // ignore icons
    if (h > 0 && h < 100) return;

    const alt = ($(el).attr('alt') ?? '').toLowerCase();
    const titleAttr = ($(el).attr('title') ?? '').toLowerCase();
    const role = classifyImage(src, alt, titleAttr);

    if (role === 'skip') return;
    if (role === 'hero') rawHeroImages.push(src);
    else if (role === 'layout') rawLayoutImages.push(src);
    else if (role === 'locationmap') rawLocationMapUrl = src;
    else rawGalleryImages.push(src); // gallery
  });

  // Deduplicate by removing -NNNxNNN thumbnail variants;
  // prefer the full-size (no dimension suffix in filename)
  const deduplicateImageGroup = (urls: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const url of urls) {
      // Normalise by stripping -WxH suffix before the extension
      const base = url.replace(/-\d+x\d+(\.[a-z]+)$/i, '$1');
      if (!seen.has(base)) {
        seen.add(base);
        result.push(url);
      }
    }
    return result;
  };

  // ── Descriptions ───────────────────────────────────────────────────────────
  const paragraphs = $('.elementor-text-editor p, .elementor-widget-text-editor p')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const rawShortDescription = paragraphs[0] ?? undefined;
  const rawDescription = paragraphs.join('\n\n');

  // ── Amenities / Key Features ───────────────────────────────────────────────
  const rawFeatures: string[] = [];
  $('ul li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 200) {
      rawFeatures.push(text);
    }
  });

  // Also grab icon-box titles which Elementor uses for feature lists
  $('.elementor-icon-box-title, .elementor-image-box-title').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 2) rawFeatures.push(text);
  });

  // ── Property Types ─────────────────────────────────────────────────────────
  const PROPERTY_TYPE_KEYWORDS = [
    'Villa Plots', 'Open Plots', 'Commercial Plots', 'Commercial Spaces',
    'Simplex Houses', 'Duplex Houses', 'Independent Houses', 'Villas',
    'Apartments', 'Row Houses', 'Farm Plots', 'Agricultural Plots',
  ];
  const allText = $('body').text();
  const rawPropertyTypes = PROPERTY_TYPE_KEYWORDS.filter(pt =>
    allText.toLowerCase().includes(pt.toLowerCase())
  );

  // ── Location Nearby Landmarks ──────────────────────────────────────────────
  const rawNearbyLandmarks: string[] = [];
  $('p, li').each((_, el) => {
    const text = $(el).text().trim();
    const lower = text.toLowerCase();
    if (
      (lower.includes('km') || lower.includes('min') || lower.includes('minutes')) &&
      (lower.includes('from') || lower.includes('away') || lower.includes('near'))
    ) {
      if (text.length > 5 && text.length < 300) {
        rawNearbyLandmarks.push(text);
      }
    }
  });

  // ── Approval Info ──────────────────────────────────────────────────────────
  let rawApprovalType: string | undefined;
  const approvalMatch = allText.match(
    /(?:LP\s*No\.?|TLP\s*No\.?|CRDA\s*No\.?|RERA\s*No\.?|DTCP\s*No\.?|AP\s*RERA)[^\n<.,;)]{3,60}/i
  );
  if (approvalMatch) rawApprovalType = approvalMatch[0].trim();

  // ── Price ──────────────────────────────────────────────────────────────────
  let rawPrice: string | undefined;
  const priceMatch = allText.match(
    /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\s*\/\s*(?:sqyd|sq\.?yd|sq\.?ft|sqft|cent|acre|plot))?(?:\s*onwards)?/i
  );
  if (priceMatch) rawPrice = priceMatch[0].trim();

  // ── Brochure URL ───────────────────────────────────────────────────────────
  let rawBrochureUrl: string | undefined;
  let rawLayoutPdfUrl: string | undefined;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const text = $(el).text().toLowerCase();
    if (href.endsWith('.pdf')) {
      if (
        text.includes('brochure') ||
        text.includes('download') ||
        href.toLowerCase().includes('brochure')
      ) {
        rawBrochureUrl = href;
      } else if (
        text.includes('layout') ||
        href.toLowerCase().includes('layout')
      ) {
        rawLayoutPdfUrl = href;
      }
    }
  });

  // ── Google Maps URL ────────────────────────────────────────────────────────
  let rawGoogleMapsUrl: string | undefined;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    if (href.includes('maps.google.com') || href.includes('goo.gl/maps') || href.includes('maps.app.goo.gl')) {
      rawGoogleMapsUrl = href;
    }
  });

  // Also check iframes for Google Maps embeds
  $('iframe[src]').each((_, el) => {
    const src = $(el).attr('src') ?? '';
    if (src.includes('maps.google.com') || src.includes('google.com/maps')) {
      rawGoogleMapsUrl = rawGoogleMapsUrl ?? src;
    }
  });

  // ── Location Text ──────────────────────────────────────────────────────────
  // Try to infer from the description / title
  const locationKeywords = [
    // Villages / mandals (more specific — check first)
    'Edupugallu', 'Medaramatla', 'Kaza', 'Gudavalli', 'Gangur',
    'Chinna Palakaluru', 'China Palakaluru',
    // Districts / major cities
    'Markapuram', 'Guntur', 'Bapatla', 'Darsi', 'Vinukonda', 'Kanigiri',
    'Vijayawada', 'Ongole', 'Chirala', 'Tenali', 'Narasaraopet',
    'Nellore', 'Kurnool', 'Tirupati', 'Kadapa', 'Anantapur', 'Prakasam',
    'Amaravati', 'Mangalagiri', 'Tadepalligudem', 'Eluru', 'Machilipatnam',
    'Bhimavaram', 'Rajahmundry', 'Kakinada', 'Vizag', 'Vizianagaram',
  ];
  const locationSearchText = `${rawTitle} ${rawDescription}`;
  const rawLocationText =
    locationKeywords.find(loc =>
      locationSearchText.toLowerCase().includes(loc.toLowerCase())
    ) ?? extracted_location_from_meta(seoTitle ?? '', seoDescription ?? '', locationKeywords) ?? 'Unknown';

  // ── Area ───────────────────────────────────────────────────────────────────
  let rawArea: string | undefined;
  const areaMatch = allText.match(/(\d+(?:\.\d+)?)\s*(?:acre|acres|Acres|Acre)/i);
  if (areaMatch) rawArea = `${areaMatch[1]} Acres`;

  // ── Assemble ParsedProject ─────────────────────────────────────────────────
  const result: ParsedProject = {
    rawTitle,
    sourceUrl: discovered.projectUrl,
    sourceId: slug,

    rawShortDescription,
    rawDescription,

    rawLocationText,
    rawNearbyLandmarks,
    rawGoogleMapsUrl,
    rawLocationMapUrl,

    rawHeroImages: deduplicateImageGroup([
      ...(discovered.thumbnailUrl ? [discovered.thumbnailUrl] : []),
      ...rawHeroImages,
    ]),
    rawGalleryImages: deduplicateImageGroup(rawGalleryImages),
    rawLayoutImages: deduplicateImageGroup(rawLayoutImages),

    rawFeatures: [...new Set(rawFeatures)],
    rawPropertyTypes: [...new Set(rawPropertyTypes)],
    rawApprovalType,
    rawPrice,
    rawArea,

    rawBrochureUrl,
    rawLayoutPdfUrl,

    seoTitle,
    seoDescription,
  };

  console.log(
    `  ✅ Parsed: "${rawTitle}" | ` +
    `Hero: ${result.rawHeroImages.length} | ` +
    `Gallery: ${result.rawGalleryImages.length} | ` +
    `Layout: ${result.rawLayoutImages.length} | ` +
    `Amenities: ${result.rawFeatures.length}`
  );

  return result;
}

/**
 * Helper: look for location keywords in meta text when description lookup fails.
 */
function extracted_location_from_meta(
  title: string,
  description: string,
  keywords: string[]
): string | undefined {
  const text = `${title} ${description}`.toLowerCase();
  return keywords.find(k => text.includes(k.toLowerCase()));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Importer Class
// ─────────────────────────────────────────────────────────────────────────────

export class SriBhramaraImporter {
  /** The listing page URL (used only for discovery, not as data source) */
  readonly listingUrl =
    'https://sribhramara.com/wp-json/wp/v2/pages?slug=ongoing-projects';

  /**
   * Two-stage parse:
   *   Stage 1 — Discover project URLs from the listing page
   *   Stage 2 — Fetch and parse every individual project page
   */
  async parse(): Promise<ParsedProject[]> {
    // ── Stage 1: Discovery ─────────────────────────────────────────────────
    const discovered = await discoverProjectUrls();

    if (discovered.length === 0) {
      throw new Error('[SriBhramaraImporter] No project URLs discovered from listing page');
    }

    // ── Stage 2: Per-project extraction ────────────────────────────────────
    console.log(`\n[Stage 2] Parsing ${discovered.length} project pages...\n`);

    const results: ParsedProject[] = [];

    for (let i = 0; i < discovered.length; i++) {
      const disc = discovered[i];
      console.log(`[${i + 1}/${discovered.length}] ${disc.projectUrl}`);

      try {
        const parsed = await parseProjectPage(disc);
        if (parsed) results.push(parsed);
      } catch (err: any) {
        console.error(`  ❌ Error parsing ${disc.projectUrl}: ${err.message}`);
      }

      // Polite delay between requests
      if (i < discovered.length - 1) await sleep(800);
    }

    console.log(
      `\n[SriBhramaraImporter] ✅ Stage 2 complete. ` +
      `${results.length}/${discovered.length} pages parsed successfully.\n`
    );

    return results;
  }
}
