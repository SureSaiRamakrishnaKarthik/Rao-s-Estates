"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import { getPropertyImage } from "@/lib/utils/image";

export default function PropertiesList({ projects }: { projects: any[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "All");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "All");

  // Get unique locations and types for filters
  const uniqueLocations = useMemo(() => {
    const locations = projects
      .map((p) => p.locations?.name)
      .filter((name): name is string => typeof name === "string" && name.trim() !== "");
    
    const set = new Set(locations);
    if (selectedLocation && selectedLocation !== "All") set.add(selectedLocation);
    return ["All", ...Array.from(set)];
  }, [projects, selectedLocation]);

  const uniqueTypes = useMemo(() => {
    const types = projects
      .map((p) => p.project_types?.name)
      .filter((type): type is string => typeof type === "string" && type.trim() !== "");
    
    const set = new Set(types);
    if (selectedType && selectedType !== "All") set.add(selectedType);
    return ["All", ...Array.from(set)];
  }, [projects, selectedType]);



  // Filter logic
  const filteredProjects = useMemo(() => {
    return projects.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        (property.locations?.name || "").toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType.toLowerCase() === "all" || 
        (property.project_types?.name || "").toLowerCase().includes(selectedType.toLowerCase());

      const matchesLocation =
        selectedLocation.toLowerCase() === "all" || 
        (property.locations?.name || "").toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [projects, search, selectedType, selectedLocation]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D4CBB3] via-[#EAE5D8] to-[#ECE7D9] py-24 text-stone-800 font-sans">
      {/* Luxury Soft Cloud Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_80%)] blur-[120px]" />
        <div className="absolute -left-[10%] bottom-[10%] w-[50%] h-[50%] rounded-full bg-[#CFC8B7]/30 blur-[110px]" />
      </div>

      <Container className="relative z-10">
        {/* Header Block with thin sand divider */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end border-b border-stone-950/15 pb-8">
          <div className="flex items-start gap-5">
            <span className="font-display text-5xl leading-none text-stone-900/10">
              01
            </span>
            <div>
              <span className="text-[10px] tracking-[0.25em] text-gold-700 font-bold uppercase font-sans">
                EXQUISITE PORTFOLIO
              </span>
              <h1 className="mt-3 font-display text-4xl text-stone-900 sm:text-5xl font-light">
                Our Properties
              </h1>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="relative max-w-sm w-full font-sans">
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 border border-stone-950/15 rounded-none px-6 py-3 text-xs tracking-wider uppercase text-stone-900 placeholder-stone-500 focus:outline-none focus:border-stone-950 transition-all"
            />
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="mb-12 flex flex-col gap-6 font-sans">
          {/* Location Filters */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold">
              Filter By Region:
            </span>
            <div className="flex flex-wrap gap-2">
              {uniqueLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-1.5 text-[10px] tracking-wider uppercase transition-all duration-300 ${selectedLocation === loc
                    ? "border border-stone-950 bg-stone-950 text-white font-semibold"
                    : "border border-stone-950/15 text-stone-700 bg-white/20 hover:border-stone-950/30 hover:text-stone-900"
                    }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type Filters */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold">
              Filter By Type:
            </span>
            <div className="flex flex-wrap gap-2">
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 text-[10px] tracking-wider uppercase transition-all duration-300 ${selectedType === type
                    ? "border border-stone-950 bg-stone-950 text-white font-semibold"
                    : "border border-stone-950/15 text-stone-700 bg-white/20 hover:border-stone-950/30 hover:text-stone-900"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((property: any) => (
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

                {/* Price tag top-right */}
                <span className="absolute right-4 top-4 border border-stone-950/10 bg-stone-950 px-3 py-1.5 text-[9px] font-semibold tracking-widest text-white backdrop-blur-md">
                  {property.starting_price ? `₹${Number(property.starting_price).toLocaleString('en-IN')}` : 'Price on request'}
                </span>

                {/* Floating Capsule with 4-side spacing - Styled with classic Cormorant Garamond */}
                <div className="absolute bottom-0 left-0 right-0 m-4 bg-white/70 backdrop-blur-md p-4 border border-stone-200/50 z-10">
                  <h3 className="font-display text-base font-light text-stone-900 truncate">
                    {property.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 font-display font-light">
                    <PinIcon className="text-gold-700" />
                    {property.locations?.name || 'Various Locations'}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-stone-200/50 pt-2 text-[10px] text-stone-500 font-display font-light">
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
              No properties matched
            </h3>
            <p className="mt-2 text-sm text-stone-700/60 max-w-xs">
              Try adjusting your search criteria or resetting filters to see all listing projects.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("All");
                setSelectedLocation("All");
              }}
              className="mt-6 border border-stone-950 hover:bg-stone-950 hover:text-white text-stone-900 px-6 py-2 rounded-none text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-3 w-3 shrink-0 ${className}`}>
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}
