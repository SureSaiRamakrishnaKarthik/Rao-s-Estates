"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function WhyChooseUs() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="bg-[#EAE5D8] py-24 relative overflow-hidden font-sans text-stone-850">
      {/* Luxury Soft Cloud Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column (6 cols): Key Logo, Title, and Sub-tagline */}
          <div className="lg:col-span-6 flex flex-col items-start justify-center lg:pr-10">
            <ScrollReveal variant="fade-up" duration={1000}>
              {/* Elegant Golden Key Icon */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="h-8 w-auto text-gold-700 mb-8"
                stroke="currentColor"
              >
                <path 
                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 0 5.5 5.5 0 017.777 0zM19 4l-5 5m5-5h-3m3 0v3" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light leading-[1.1] tracking-tight">
                About <br />
                Rao&apos;s Estates
              </h2>

              <p className="mt-8 text-xs tracking-[0.2em] text-stone-500 uppercase font-bold max-w-md leading-relaxed">
                PREMIUM APPROVED RESIDENTIAL LAND DEVELOPMENTS WITH UNCOMPROMISED TITLE SEGREGATION
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column (6 cols): Founder Portrait & Editorial Legacy Paragraph */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <ScrollReveal variant="fade-up" delay={200} duration={1200}>
              {/* Founder Portrait (Vertical Rectangular Image) */}
              <div className="relative w-full max-w-sm aspect-[4/5] overflow-hidden border border-stone-950/10 bg-stone-950/5 rounded-none shadow-lg">
                {!imageError ? (
                  <Image
                    src="/images/owner-v2.jpg"
                    alt="K. Rao"
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-[1200ms] hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
                    <svg className="w-16 h-16 text-stone-900/10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="mt-8 text-sm text-stone-700 leading-relaxed font-display font-light max-w-sm">
                Rao&apos;s Estates is Prakasam&apos;s premier real estate advisory firm, built on a foundation of deep industry knowledge, strict legal title diligence, and strategic growth mapping. Drawing on years of inside experience with top developers like Sri Bhramara, SV KRISHNA Rao guides clients toward secure, AP RERA & DTCP approved land acquisitions ready for immediate construction.
              </p>
            </ScrollReveal>
          </div>

        </div>
      </Container>
    </section>
  );
}
