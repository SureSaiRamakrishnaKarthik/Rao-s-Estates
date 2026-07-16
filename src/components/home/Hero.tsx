"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";

const heroImages = [
  "/images/locations/location-1.jpg",
  "/images/locations/location-2.jpg",
  "/images/locations/location-3.jpg",
  "/images/locations/location-4.jpg",
  "/images/locations/location-5.jpg"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500); // Crossfade every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section key="hero-slider-v2" className="relative min-h-screen overflow-hidden bg-black">
      {/* Crossfading background slides from locations folder */}
      <div className="absolute inset-0 bg-black">
        {heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Premium real estate location ${index + 1}`}
            fill
            priority={true}
            unoptimized
            className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        {/* Neutral overlays to keep text readable without color tinting the photos */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <Container className="relative flex min-h-screen flex-col justify-center pb-20 pt-32 sm:pt-40">
        <div className="max-w-3xl">
          {/* <span className="mb-4 block text-[10px] font-semibold tracking-[0.3em] uppercase text-cream-50/90 sm:text-[11px]">
            Exceptional
          </span> */}

          <h1 className="font-display text-5xl leading-[1.1] text-cream-50 sm:text-7xl lg:text-[5.5rem]">
            Find Your Perfect Property
          </h1>

          <p className="mt-8 max-w-lg text-[10px] leading-loose tracking-[0.2em] uppercase text-cream-50/70 sm:text-[11px]">
            Markapur &middot; Vijayawada &middot; Guntur
            <br />
            Amaravati &middot; Chirala &middot; Bapatla
          </p>

          <div className="mt-14">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center border border-cream-50/50 bg-transparent px-10 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase text-cream-50 transition-colors hover:border-cream-50 hover:bg-cream-50/10"
            >
              Our Properties
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
