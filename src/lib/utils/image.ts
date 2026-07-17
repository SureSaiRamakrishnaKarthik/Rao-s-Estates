export const getPropertyImage = (property: any) => {
  // 1. Check for manual uploads based on slug
  const manualUploads: Record<string, string> = {
    'alohaa-resort-beach': '/images/manual-uploads/aloha-beach-resort.png',
    'apex-heights': '/images/manual-uploads/apex-heights(gudavalli).avif',
    'apex': '/images/manual-uploads/apex-heights(gudavalli).avif',
    'bankers-colony': '/images/manual-uploads/bankers-colony.jpg',
    'sree-nivasam-chinna-palakaluru': '/images/manual-uploads/sree-nivasam.jpeg',
    'sree-nivasam-phase-2': '/images/manual-uploads/sree-nivasam.jpeg',
    'sri-city-markapuram': '/images/manual-uploads/sricity-markapur.jpg',
    'zenith': '/images/manual-uploads/zenith-city.jpg',
    'zenith-city-phase-2': '/images/manual-uploads/zenith-city.jpg',
    'zenith-city-phase-i': '/images/manual-uploads/zenith-city.jpg',
    'zenith-city-phase-ii': '/images/manual-uploads/zenith-city.jpg',
  };

  if (manualUploads[property.slug]) {
    return manualUploads[property.slug];
  }

  // 2. Fallback to Supabase media if available
  if (property.media && property.media.length > 0) {
    const cover = property.media.find((m: any) => m.is_cover);
    const target = cover || property.media[0];
    if (target.url) return target.url;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    return `${supabaseUrl}/storage/v1/object/public/${target.bucket}/${target.path}`;
  }

  // 3. Keep dummy for those without media or manual upload
  const fallbackImages = [
    "/images/properties/plot-01.jpg",
    "/images/properties/plot-02.jpg",
    "/images/properties/plot-03.jpg",
  ];
  
  const slug = property.slug || "";
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[idx];
};
