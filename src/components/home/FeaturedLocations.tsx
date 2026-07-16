import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { Location } from "@/types/location";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function FeaturedLocations({ locations }: { locations?: Location[] }) {
  const displayLocations = locations || [];

  if (displayLocations.length === 0) return null;

  return (
    <section className="bg-[#EAE5D8] py-24 relative overflow-hidden font-sans text-stone-850">
      {/* Luxury Soft Cloud Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
      </div>

      <Container className="relative z-10">
        <ScrollReveal variant="fade-up">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-start gap-5">
              <span className="font-display text-5xl leading-none text-stone-900/10">
                02
              </span>
              <div>
                <span className="text-[10px] tracking-[0.25em] text-gold-700 font-bold uppercase">
                  EXPLORE REGIONS
                </span>
                <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl font-light">
                  Featured Locations
                </h2>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {displayLocations.map((loc, idx) => (
            <ScrollReveal 
              key={loc.slug} 
              variant="fade-up" 
              delay={idx * 100} 
              duration={800}
              className="w-full aspect-square"
            >
              <Link
                href={`/locations/${loc.slug}`}
                className="group relative block overflow-hidden rounded-none w-full h-full bg-[#E2DBC6]/40 border border-stone-950/10 transition-all duration-700 hover:scale-[1.03] hover:shadow-lg"
              >
                <Image
                  src={`/images/locations/location-${(idx % 5) + 1}.jpg`} // Fallback to demo images for now
                  alt={loc.name}
                  fill
                  className="object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3] via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="font-display text-base font-light text-stone-900">
                    {loc.name}
                  </h3>
                  <div className="mt-1 font-display text-xs text-stone-600 font-light">
                    Explore
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
