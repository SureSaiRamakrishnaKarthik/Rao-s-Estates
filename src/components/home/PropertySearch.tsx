"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const propertyTypes = [
  "Open Plots",
  "Residential Plots",
  "Commercial Lands",
  "Farm Lands",
  "Apartments",
];

// Dummy list — will come from the locations table in Supabase later
const locations = [
  "Markapur",
  "Vijayawada",
  "Guntur",
  "Amaravati",
  "Chirala",
  "Bapatla",
];

const priceRanges = [
  { label: "Under ₹10L", value: "0-1000000" },
  { label: "₹10L - ₹25L", value: "1000000-2500000" },
  { label: "₹25L - ₹50L", value: "2500000-5000000" },
  { label: "₹50L+", value: "5000000-" },
];

// Custom sleek dropdown to replace the ugly native <select>
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 text-[11px] tracking-widest text-cream-50 focus:outline-none"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`ml-2 h-3 w-3 text-cream-50/40 transition-transform ${open ? "rotate-180" : ""
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-4 w-56 overflow-hidden rounded-2xl border border-cream-50/10 bg-black/95 py-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            className="w-full px-5 py-2.5 text-left text-[11px] tracking-widest text-cream-50/50 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="w-full px-5 py-2.5 text-left text-[11px] tracking-widest text-cream-50 transition-colors hover:bg-cream-50/10"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertySearch() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (price) params.set("price", price);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-black py-4 lg:py-6">
      <div className="mx-auto w-full max-w-5xl px-4 xl:px-0">
        <section className="flex flex-col rounded-3xl border border-cream-50/15 bg-[#0a0a0a] px-5 py-4 shadow-2xl lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:px-8 lg:py-2.5">
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 lg:divide-x lg:divide-cream-50/15">
            {/* Location */}
            <IconField icon={<PinIcon />} label="Location">
              <CustomDropdown
                value={location}
                onChange={setLocation}
                placeholder="All Cities"
                options={locations.map((loc) => ({ label: loc, value: loc }))}
              />
            </IconField>

            {/* Type */}
            <IconField
              icon={<BuildingIcon />}
              label="Property Type"
              className="border-t border-cream-50/10 pt-4 lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <CustomDropdown
                value={type}
                onChange={setType}
                placeholder="All Types"
                options={propertyTypes.map((t) => ({ label: t, value: t }))}
              />
            </IconField>

            {/* Budget */}
            <IconField
              icon={<CoinIcon />}
              label="Budget"
              className="border-t border-cream-50/10 pt-4 lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <CustomDropdown
                value={price}
                onChange={setPrice}
                placeholder="Any Budget"
                options={priceRanges}
              />
            </IconField>
          </div>

          <button
            onClick={handleSearch}
            className="mt-6 flex shrink-0 items-center justify-center gap-2 rounded-full bg-cream-50 px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-black transition-transform hover:scale-105 lg:mt-0 lg:ml-8"
          >
            <SearchIcon />
            Search
          </button>
        </section>
      </div>
    </div>
  );
}

function IconField({
  icon,
  label,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-cream-50/40 shrink-0">{icon}</span>
      <div className="flex flex-1 flex-col min-w-0">
        <div className="mb-0.5 text-[9px] font-medium tracking-[0.2em] text-cream-50/40 uppercase">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M10 18s6-5.686 6-10a6 6 0 10-12 0c0 4.314 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <rect
        x="4"
        y="3"
        width="8"
        height="14"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="12"
        y="7"
        width="4"
        height="10"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6.5 6h1M6.5 9h1M6.5 12h1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 6.5v7M8 7.8h2.5a1.3 1.3 0 010 2.6H9.5a1.3 1.3 0 000 2.6H12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M17 17l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
