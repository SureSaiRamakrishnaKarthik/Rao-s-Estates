import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { LocationService } from "@/services/location.service";

export default async function LocationsPage() {
  const locations = await LocationService.getAllLocations();

  // Location fallback visual mockups
  const getLocationImage = (loc: any) => {
    if (loc.image_url) return loc.image_url;
    
    // Aesthetic fallbacks matching our villa look
    const fallbacks = [
      "/images/properties/plot-01.jpg",
      "/images/properties/plot-02.jpg",
      "/images/properties/plot-03.jpg",
    ];
    const slug = loc.slug || "";
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % fallbacks.length;
    return fallbacks[idx];
  };

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
          {/* Header Block */}
          <div className="mb-14 border-b border-stone-950/15 pb-8">
            <span className="text-[10px] tracking-[0.25em] text-gold-700 font-bold uppercase font-sans">
              PRESTIGE REGIONS
            </span>
            <h1 className="mt-3 font-display text-4xl text-stone-900 sm:text-5xl font-light">
              Featured Locations
            </h1>
            <p className="mt-4 text-sm text-stone-600 max-w-xl font-display font-light">
              Discover prime developments, approved residential plots, and investment opportunities in Andhra Pradesh's most promising districts.
            </p>
          </div>

          {/* Grid of locations */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc: any) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group relative block overflow-hidden border border-stone-950/10 bg-[#E2DBC6]/40 transition-all hover:border-stone-950/20 hover:shadow-2xl hover:shadow-stone-950/5 aspect-[1.4]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={getLocationImage(loc)}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3] via-transparent to-transparent" />
                  </div>

                  {/* Location label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-white/70 backdrop-blur-md border-t border-stone-200/50">
                    <h3 className="font-display text-xl font-light text-stone-900">
                      {loc.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-stone-600 font-display font-light uppercase tracking-wider">
                      <span>Explore Layouts</span>
                      <span className="text-stone-900 group-hover:translate-x-1 transition-transform">
                        Explore &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="font-display text-xl text-stone-900 font-light">
                No active locations logged
              </h3>
              <p className="mt-2 text-sm text-stone-600 max-w-xs mx-auto font-display font-light">
                We are currently auditing properties and land registry details. Check back shortly to view active districts!
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}