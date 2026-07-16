"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { primaryNavLinks, contactDetails } from "@/data/nav-links";
import Container from "@/components/layout/Container";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);

  const headerClass = transparent
    ? "absolute top-0 left-0 right-0 z-50 w-full bg-transparent"
    : "sticky top-0 z-50 w-full border-b border-navy-950/8 bg-cream-50/95 backdrop-blur-sm";

  const textColor = transparent ? "text-cream-50" : "text-navy-950";
  const textHoverColor = transparent ? "hover:text-gold-300" : "hover:text-navy-950";
  const linkBaseColor = transparent ? "text-cream-50/90" : "text-navy-950/80";
  const btnBaseClass = transparent
    ? "border-cream-50/40 text-cream-50 hover:border-cream-50 hover:bg-cream-50/10"
    : "border-navy-950/15 text-navy-950 hover:border-navy-950/40";

  const hamburgerLine = transparent && !open ? "bg-cream-50" : "bg-navy-950";

  return (
    <header className={headerClass}>
      <Container className="flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="Rao's Estates"
            width={180}
            height={60}
            className={`h-10 w-auto shrink-0 object-contain ${transparent ? "brightness-0 invert" : ""}`}
            priority
          />
          <div className="hidden flex-col leading-none sm:flex">
            <span className={`font-display text-lg ${textColor}`}>
              Rao&rsquo;s Estates
            </span>
            <span className="mt-0.5 text-[10px] tracking-[0.2em] text-gold-500">
              ANDHRA PRADESH
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {primaryNavLinks.map((link: any) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${linkBaseColor} ${textHoverColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={"tel:" + contactDetails.phoneHref}
            className={`flex items-center gap-2 border px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${btnBaseClass}`}
          >
            Call Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-px w-6 transition-transform ${open ? "translate-y-[3px] rotate-45 bg-navy-950" : hamburgerLine}`} />
          <span className={`h-px w-6 transition-opacity ${open ? "opacity-0 bg-navy-950" : hamburgerLine}`} />
          <span className={`h-px w-6 transition-transform ${open ? "-translate-y-[3px] -rotate-45 bg-navy-950" : hamburgerLine}`} />
        </button>
      </Container>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 right-0 top-full border-t border-navy-950/8 bg-cream-50">
          <Container className="flex flex-col gap-6 py-8 shadow-2xl">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {primaryNavLinks.map((link: any) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-widest uppercase text-navy-950/80 hover:text-navy-950"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={"tel:" + contactDetails.phoneHref}
                className="flex-1 border border-navy-950 py-3 text-center text-xs tracking-widest uppercase text-navy-950"
              >
                Call Now
              </a>
              <a
                href={"https://wa.me/" + contactDetails.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gold-500 py-3 text-center text-xs font-medium tracking-widest uppercase text-navy-950"
              >
                WhatsApp
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
