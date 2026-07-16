"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";

export default function PropertyDetailsClient({ project }: { project: any }) {
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"gallery" | "layout" | "map">("gallery");
  const [showInquireModal, setShowInquireModal] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const resolveMediaUrl = (m: any): string => {
    if (m.url) return m.url;
    return `${supabaseUrl}/storage/v1/object/public/${m.bucket}/${m.path}`;
  };

  // Classify all project media by type
  const { galleryImages, layoutImages, locationMapImage } = useMemo(() => {
    if (!project.media || project.media.length === 0) {
      const fallbackImages = [
        "/images/properties/plot-01.jpg",
        "/images/properties/plot-02.jpg",
        "/images/properties/plot-03.jpg",
      ];
      const slug = project.slug || "";
      let hash = 0;
      for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
      return {
        galleryImages: [{ url: fallbackImages[Math.abs(hash) % fallbackImages.length], is_cover: true }],
        layoutImages: [] as { url: string }[],
        locationMapImage: null as string | null,
      };
    }

    const gallery: { url: string; is_cover: boolean }[] = [];
    const layouts: { url: string }[] = [];
    let locMap: string | null = null;

    const thumbnailPath = project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/') 
      ? project.thumbnail 
      : project.thumbnail ? `${supabaseUrl}/storage/v1/object/public/projects/${project.thumbnail}` : null;

    let foundThumbnail = false;

    for (const m of project.media) {
      const url = resolveMediaUrl(m);
      if (url === thumbnailPath) foundThumbnail = true;

      const type = m.type || "image";
      if (type === "layout") {
        layouts.push({ url });
      } else if (type === "location_map") {
        locMap = url;
      } else {
        gallery.push({ url, is_cover: m.is_cover ?? false });
      }
    }

    // Sort gallery so cover is first
    gallery.sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0));

    // If there's a custom thumbnail (like manual upload) not in media, insert it as the primary cover!
    if (thumbnailPath && !foundThumbnail) {
      gallery.unshift({ url: thumbnailPath, is_cover: true });
    }

    return { galleryImages: gallery, layoutImages: layouts, locationMapImage: locMap };
  }, [project]);

  // Determine which tabs to show
  const hasTabs = layoutImages.length > 0 || locationMapImage;

  // Active image for the main viewer based on tab
  const viewerImages = useMemo(() => {
    if (activeTab === "layout") return layoutImages;
    if (activeTab === "map" && locationMapImage) return [{ url: locationMapImage }];
    return galleryImages;
  }, [activeTab, galleryImages, layoutImages, locationMapImage]);

  const amenities = useMemo(() => {
    if (!project.project_amenities || project.project_amenities.length === 0) return [];
    return project.project_amenities
      .map((pa: any) => pa.amenities?.name)
      .filter((name: string) => name && name.trim() !== "");
  }, [project]);

  const mapsEmbedUrl = useMemo(() => {
    if (project.latitude && project.longitude) {
      return `https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`;
    }
    const mapUrl = project.google_map_url || "";
    const coordMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
    }
    return null;
  }, [project]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#D4CBB3] via-[#EAE5D8] to-[#ECE7D9] py-12 text-stone-800 min-h-screen font-sans animate-[fadeIn_0.8s_ease-out]">
      {/* Luxury Soft Cloud Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[5%] left-[10%] w-[50%] h-[40%] rounded-full bg-white/40 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[60%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_75%)] blur-[110px]" />
      </div>

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-stone-600 hover:text-stone-900 transition-colors mb-8 font-semibold"
        >
          &larr; Back to Listings
        </Link>

        {/* Title Header */}
        <div className="mb-10 border-b border-stone-950/15 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#8B6A30] uppercase font-bold font-sans">
              {project.approval_type || "Premium Real Estate"}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mt-2 font-light">
              {project.title}
            </h1>
            {/* Short description / tagline */}
            {project.short_description && (
              <p className="mt-2 text-sm text-stone-600 font-display font-light max-w-xl leading-relaxed">
                {project.short_description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-sm text-stone-600 font-display font-light">
              <PinIcon className="text-[#8B6A30]" />
              <span>{project.locations?.name || "Andhra Pradesh"}</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 tracking-wider uppercase">
              Starting Price
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1 font-display font-light">
              {project.starting_price
                ? `₹${Number(project.starting_price).toLocaleString("en-IN")}`
                : "Price on Request"}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider bg-stone-950 text-white mt-2 font-sans">
              {project.construction_status}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Media Viewer & Details */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── Media Viewer with Tabs ── */}
            <div className="space-y-4">
              {/* Tab switcher */}
              {hasTabs && (
                <div className="flex gap-1 border-b border-stone-950/10">
                  {(["gallery", ...(layoutImages.length > 0 ? ["layout"] : []), ...(locationMapImage ? ["map"] : [])] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab as any); setActiveGalleryIdx(0); }}
                      className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-[2px] ${
                        activeTab === tab
                          ? "border-stone-900 text-stone-900"
                          : "border-transparent text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      {tab === "gallery" ? "📸 Photos" : tab === "layout" ? "🗺 Site Layout" : "📍 Location Map"}
                    </button>
                  ))}
                </div>
              )}

              {/* Main viewer */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-none bg-stone-200 border border-stone-950/10 shadow-sm">
                {viewerImages.length > 0 ? (
                  <Image
                    src={viewerImages[activeGalleryIdx]?.url || "/images/placeholder.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                    No image available
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              {viewerImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {viewerImages.map((media: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveGalleryIdx(index)}
                      className={`relative h-16 w-28 shrink-0 overflow-hidden border-2 transition-all ${
                        activeGalleryIdx === index
                          ? "border-stone-900 scale-95"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-stone-400"
                      }`}
                    >
                      <Image
                        src={media.url}
                        alt={`${project.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Description & Overview ── */}
            <div className="bg-white/70 rounded-none p-8 border border-stone-200/50 shadow-sm space-y-6">
              <h2 className="font-display text-xl text-stone-900 border-b border-stone-200/50 pb-3 font-light">
                Overview & Description
              </h2>
              {project.description ? (
                <div
                  className="prose prose-stone max-w-none text-sm leading-relaxed text-stone-700 font-display font-light space-y-4"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <p className="text-sm text-stone-500 italic font-display font-light">
                  No detailed description has been uploaded for this project yet.
                </p>
              )}
            </div>

            {/* ── Property Types ── */}
            {project.property_types && project.property_types.length > 0 && (
              <div className="bg-white/70 rounded-none p-8 border border-stone-200/50 shadow-sm space-y-6">
                <h2 className="font-display text-xl text-stone-900 border-b border-stone-200/50 pb-3 font-light">
                  Available Property Types
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.property_types.map((pt: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-950/20 text-xs font-semibold uppercase tracking-wider text-stone-800 bg-stone-50/80"
                    >
                      <span className="text-[#8B6A30]">●</span>
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Key Amenities ── */}
            {amenities.length > 0 && (
              <div className="bg-white/70 rounded-none p-8 border border-stone-200/50 shadow-sm space-y-6">
                <h2 className="font-display text-xl text-stone-900 border-b border-stone-200/50 pb-3 font-light">
                  Key Amenities & Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8B6A30]/10 text-[#8B6A30]">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm text-stone-800 font-display font-light">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Maps & Directions Embed ── */}
            {mapsEmbedUrl && (
              <div className="bg-white/70 rounded-none p-8 border border-stone-200/50 shadow-sm space-y-6">
                <h2 className="font-display text-xl text-stone-900 border-b border-stone-200/50 pb-3 font-light">
                  Location & Directions
                </h2>
                <div className="relative w-full aspect-[16/7] overflow-hidden border border-stone-950/10 bg-stone-100">
                  <iframe
                    src={mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, opacity: 0.9 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${project.title} location map`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Actions & Facts */}
          <div className="space-y-6 lg:sticky lg:top-12">

            {/* Request Private Viewing */}
            <div className="bg-white/70 rounded-none p-6 border border-stone-200/50 shadow-sm text-center space-y-4">
              <h3 className="font-display text-lg text-stone-900 font-light">Private Viewing</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                Schedule a private consultation or visit this property in person with our executive team.
              </p>
              <button
                onClick={() => setShowInquireModal(true)}
                className="inline-flex w-full justify-center items-center gap-2 bg-stone-900 hover:bg-stone-950 text-white py-3 text-xs tracking-wider uppercase font-semibold transition-colors font-sans rounded-none"
              >
                Request Viewing &rarr;
              </button>
            </div>

            {/* Quick Facts */}
            <div className="bg-white/70 rounded-none p-6 border border-stone-200/50 shadow-sm space-y-4">
              <h3 className="font-display text-lg text-stone-900 border-b border-stone-200/50 pb-3 font-light">
                Project Overview
              </h3>
              <div className="space-y-3.5 text-sm font-display font-light">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Developer</span>
                  <span className="text-stone-950 font-medium text-right">
                    {project.developers?.name || "Rao's Estates"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Location</span>
                  <span className="text-stone-950 font-medium">
                    {project.locations?.name || "Andhra Pradesh"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Status</span>
                  <span className="text-stone-950 font-medium capitalize">
                    {project.construction_status}
                  </span>
                </div>
                {project.approval_type && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Approval</span>
                    <span className="text-stone-950 font-medium text-right text-xs">
                      {project.approval_type}
                    </span>
                  </div>
                )}
                {project.starting_price && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Price</span>
                    <span className="text-stone-950 font-semibold">
                      ₹{Number(project.starting_price).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Brochure Download */}
            {project.brochure_url && (
              <div className="bg-white/70 rounded-none p-6 border border-stone-200/50 shadow-sm text-center space-y-4">
                <h3 className="font-display text-lg text-stone-900 font-light">Project Brochure</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  Download layout maps, plot dimension charts, and the full project details package.
                </p>
                <a
                  href={project.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full justify-center items-center gap-2 border border-stone-950/20 text-stone-850 hover:bg-stone-950/5 py-3 text-xs tracking-wider uppercase font-semibold transition-all font-sans rounded-none"
                >
                  <svg className="h-4 w-4 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Brochure PDF
                </a>
              </div>
            )}

            {/* Open in Google Maps */}
            {project.google_map_url && (
              <div className="bg-white/70 rounded-none p-6 border border-stone-200/50 shadow-sm text-center space-y-4">
                <h3 className="font-display text-lg text-stone-900 font-light">Navigation</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  Get turn-by-turn driving directions directly on Google Maps.
                </p>
                <a
                  href={project.google_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full justify-center items-center gap-2 border border-stone-950/20 text-stone-850 hover:bg-stone-950/5 py-3 text-xs tracking-wider uppercase font-semibold transition-all font-sans rounded-none"
                >
                  <PinIcon className="h-4 w-4 text-stone-800" />
                  Open in Google Maps
                </a>
              </div>
            )}

            {/* Source Link (if imported) */}
            {project.source_url && (
              <div className="text-center pt-2">
                <a
                  href={project.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-stone-400 hover:text-stone-600 tracking-wider uppercase transition-colors"
                >
                  View Original Listing ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Inquiry Modal */}
      {showInquireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-md bg-[#EAE5D8] border border-stone-950/15 p-8 shadow-2xl rounded-none text-stone-850">
            <button
              onClick={() => setShowInquireModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display italic text-2xl text-stone-900 font-normal tracking-wide text-center">
              Inquire About This Property
            </h3>
            <p className="mt-2 text-xs text-stone-600 text-center font-sans tracking-wide">
              Please leave your details below to schedule a private viewing.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowInquireModal(false);
                alert("Thank you! Our consultant will contact you shortly.");
              }}
              className="mt-8 space-y-6 font-sans text-left"
            >
              {[
                { label: "Full Name", type: "text", placeholder: "YOUR NAME" },
                { label: "Email Address", type: "email", placeholder: "YOUR EMAIL" },
                { label: "Phone Number", type: "tel", placeholder: "YOUR PHONE NUMBER" },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    className="w-full bg-transparent border-b border-stone-800/40 py-2 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                  Message (Optional)
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-b border-stone-800/40 py-2 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider resize-none"
                  placeholder="I AM INTERESTED IN A PRIVATE VIEWING..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-950 text-white py-3.5 text-xs font-bold tracking-widest uppercase transition-colors rounded-none mt-4"
              >
                Submit Inquiry &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 shrink-0 ${className}`}>
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
