import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { LocationService } from "@/services/location.service";
import { ProjectService } from "@/services/project.service";
import { getPropertyImage } from "@/lib/utils/image";


export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch Location details
  const location = await LocationService.getLocationBySlug(slug);

  if (!location) {
    return (
      <>
        <Navbar />
        <main className="bg-black min-h-screen flex items-center justify-center text-cream-50 py-24">
          <Container className="text-center space-y-6">
            <svg
              className="h-16 w-16 text-gold-500/30 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="font-display text-2xl text-cream-50">
              Region Not Found
            </h1>
            <p className="text-sm text-cream-50/50 max-w-sm mx-auto">
              The location page you are trying to view does not exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex border border-gold-500 text-gold-400 hover:bg-gold-500/10 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Go to Homepage
            </Link>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // 2. Fetch all published projects and filter by this location
  const allProjects = await ProjectService.getAllProjects();
  const dbLocationProjects = allProjects.filter(
    (p) => p.location_id === location.id && p.publish_status === "published"
  );

  const combinedProjects = dbLocationProjects;



  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D4CBB3] via-[#EAE5D8] to-[#ECE7D9] py-24 text-stone-800 font-sans">
        {/* Luxury Soft Cloud Glow Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_80%)] blur-[120px]" />
          <div className="absolute -left-[10%] bottom-[10%] w-[50%] h-[50%] rounded-full bg-[#CFC8B7]/30 blur-[110px]" />
        </div>

        <Container className="relative z-10">
          {/* Header row matching Properties grid */}
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end border-b border-stone-950/15 pb-6">
            <div className="flex items-start gap-5">
              <span className="font-display text-5xl leading-none text-stone-900/10">
                02
              </span>
              <div>
                <span className="text-xs tracking-[0.25em] text-gold-700 font-bold uppercase font-sans">
                  REGION INVESTMENTS
                </span>
                <h1 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl font-light">
                  Properties in {location.name}
                </h1>
              </div>
            </div>
            <Link
              href="/properties"
              className="text-sm font-medium tracking-wide text-stone-900 underline decoration-gold-700 decoration-2 underline-offset-4 transition-colors hover:text-gold-700"
            >
              View All Properties &rarr;
            </Link>
          </div>

          {/* Grid of properties */}
          {combinedProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {combinedProjects.map((property: any) => (
                <Link
                  key={property.slug}
                  href={`/properties/${property.slug}`}
                  className="group relative block overflow-hidden border border-stone-950/10 bg-[#E2DBC6]/40 transition-all hover:border-stone-950/20 hover:shadow-2xl hover:shadow-stone-950/5 aspect-[1.3] lg:aspect-auto lg:h-[280px]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={getPropertyImage(property)}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3] via-transparent to-transparent" />
                  </div>

                  <span className="absolute right-3 top-3 border border-stone-950/10 bg-stone-950 px-2.5 py-1 text-[8px] font-bold tracking-widest text-white backdrop-blur-md">
                    {property.starting_price ? `₹${Number(property.starting_price).toLocaleString('en-IN')}` : 'Price on request'}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 m-3.5 bg-white/70 backdrop-blur-md p-3.5 border border-stone-200/50 z-10">
                    <h3 className="font-display text-base font-light text-stone-900 truncate">
                      {property.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-600 font-display font-light">
                      <PinIcon className="text-gold-700" />
                      {property.locations?.name || 'Various Locations'}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-stone-200/50 pt-1.5 text-[10px] text-stone-500 font-display font-light">
                      <span>{property.construction_status}</span>
                      <span className="flex items-center gap-1.5 text-stone-900 transition-transform group-hover:translate-x-1">
                        View
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
              <svg
                className="h-16 w-16 text-stone-500/30 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-display text-xl text-stone-900">
                No active listings here
              </h3>
              <p className="mt-2 text-sm text-stone-700/60 max-w-xs mx-auto">
                We are currently cataloging layouts and developments in {location.name}. Please check back soon or browse other regions!
              </p>
              <Link
                href="/properties"
                className="mt-6 border border-stone-950 hover:bg-stone-950 hover:text-white text-stone-900 px-6 py-2 rounded-none text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Explore All Regions
              </Link>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-3 w-3 shrink-0 ${className}`}>
      <path
        d="M10 18s6-5.686 6-10a6 6 0 10-12 0c0 4.314 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}