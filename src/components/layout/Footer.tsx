import Image from "next/image";
import Container from "@/components/layout/Container";
import { contactDetails } from "@/data/nav-links";

export default function Footer() {
  return (
    <footer className="bg-[#12110f] text-cream-50 border-t border-white/5 font-sans">
      <Container className="pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/10 pb-12 items-center">
          
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col items-start space-y-6">
            {/* Logo with bright shadow for visibility on dark bg */}
            <div className="relative inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <Image
                src="/images/logo/logo.png"
                alt="Sri Bhramara"
                width={200}
                height={60}
                className="h-10 w-auto object-contain object-left filter brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-xs text-[#C0B79E] leading-relaxed max-w-sm font-light">
              Guiding you to premium real estate investments. We help you secure approved, high-growth layouts designed for immediate construction and long-term prosperity.
            </p>
          </div>

          {/* Column 2: Minimal Contact Details */}
          <div className="flex flex-col md:items-end space-y-3">
            <a href={"tel:" + contactDetails.phoneHref} className="text-lg font-display font-light text-cream-50 hover:text-[#8B6A30] transition-colors">
              {contactDetails.phone}
            </a>
            <a href={`mailto:${contactDetails.email}`} className="text-sm text-[#C0B79E] hover:text-[#8B6A30] transition-colors">
              {contactDetails.email}
            </a>
            <p className="text-xs text-stone-500 max-w-xs md:text-right mt-2 leading-relaxed">
              {contactDetails.address}
            </p>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[10px] text-stone-500 sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} Sri Bhramara Real Estate. All rights reserved.
          </span>
          <span className="tracking-widest uppercase text-[#8B6A30]/80 font-semibold text-[9px]">
            CLEAR TITLES &middot; TRUSTED TRANSACTIONS
          </span>
        </div>
      </Container>
    </footer>
  );
}
