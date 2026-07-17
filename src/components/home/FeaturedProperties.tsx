import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ScrollReveal from "@/components/common/ScrollReveal";
import { getPropertyImage } from "@/lib/utils/image";

export default function FeaturedProperties({ projects }: { projects?: any[] }) {
  const featured = (projects || []).slice(0, 5);
  const [flagship, ...rest] = featured;



  if (featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#EAE5D8] py-24 text-stone-800 font-sans">
      {/* Luxury Soft Cloud Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_80%)] blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <ScrollReveal variant="fade-up">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end border-b border-stone-950/15 pb-6">
            <div className="flex items-start gap-5">
              <span className="font-display text-5xl leading-none text-stone-900/10">
                01
              </span>
              <div>
                <span className="text-xs tracking-[0.3em] text-gold-700 font-bold uppercase">
                  CURRENTLY AVAILABLE
                </span>
                <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl tracking-tight font-light">
                  Featured Properties
                </h2>
              </div>
            </div>
            <Link
              href="/properties"
              className="text-sm font-medium tracking-wide text-stone-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700"
            >
              View All Properties &rarr;
            </Link>
          </div>
        </ScrollReveal>

        {/* Sharp Rectangular layout matching Signature Selection */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {flagship && (
            <ScrollReveal variant="fade-up" className="row-span-2 w-full h-full">
              <Link
                href={`/properties/${flagship.slug}`}
                className="group relative block overflow-hidden rounded-none bg-[#E2DBC6]/40 border border-stone-950/10 transition-all duration-700 hover:scale-[1.01] hover:shadow-xl w-full h-full"
              >
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[544px]">
                  <Image
                    src={flagship.slug === 'sri-city-markapuram' ? '/images/properties/plot-01.jpg' : getPropertyImage(flagship)}
                    alt={flagship.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3] via-transparent to-transparent" />
                </div>

                <span className="absolute left-6 top-6 border border-stone-950/10 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-800 backdrop-blur-md rounded-none">
                  {flagship.approval_type || 'Premium'}
                </span>
                <span className="absolute right-6 top-6 border border-stone-950/10 bg-stone-950 px-4 py-2 text-[10px] font-bold tracking-widest text-white backdrop-blur-md rounded-none">
                  {flagship.starting_price ? `₹${Number(flagship.starting_price).toLocaleString('en-IN')}` : 'Price on request'}
                </span>

                {/* docked sharp text banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md p-6 border-t border-stone-950/10 rounded-none z-20">
                  <h3 className="font-display text-2xl text-stone-900 sm:text-3xl font-light">
                    {flagship.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-stone-600 font-display font-light">
                    <PinIcon className="text-gold-700" />
                    {flagship.locations?.name || 'Various Locations'}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-stone-200/50 pt-4 text-[11px] uppercase tracking-widest text-stone-500 font-display font-light">
                    <span className="flex items-center gap-2 text-stone-600">
                      <RulerIcon /> {flagship.construction_status}
                    </span>
                    <span>{flagship.developers?.name || 'Rao\'s Estates'}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((property: any, idx: number) => (
              <ScrollReveal
                key={property.slug}
                variant="fade-up"
                delay={idx * 150}
                className="w-full aspect-[1.3] lg:aspect-auto lg:h-[260px]"
              >
                <Link
                  href={`/properties/${property.slug}`}
                  className="group relative block overflow-hidden rounded-none border border-stone-950/10 bg-[#E2DBC6]/40 transition-all duration-700 hover:scale-[1.02] hover:shadow-lg w-full h-full"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={getPropertyImage(property)}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3] via-transparent to-transparent" />
                  </div>

                  <span className="absolute right-3 top-3 border border-stone-950/10 bg-stone-950 px-2.5 py-1 text-[8px] font-bold tracking-widest text-white backdrop-blur-md rounded-none">
                    {property.starting_price ? `₹${Number(property.starting_price).toLocaleString('en-IN')}` : 'Price on request'}
                  </span>

                  {/* docked sharp text banner */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md p-4 border-t border-stone-950/10 rounded-none z-20">
                    <h3 className="font-display text-sm font-light text-stone-900 truncate">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
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

function RulerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <rect x="2" y="7" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7v2M10 7v2M14 7v2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
