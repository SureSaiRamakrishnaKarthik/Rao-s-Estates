import Container from "@/components/layout/Container";
import Link from "next/link";

const services = [
  {
    title: "Premium Plots",
    description: "Discover verified open plots in prime locations, perfect for building your dream home or for long-term high-yield investment.",
  },
  {
    title: "Commercial Lands",
    description: "Strategic commercial spaces designed to maximize your business visibility and guarantee exceptional ROI.",
  },
  {
    title: "Legal Assistance",
    description: "End-to-end legal support ensuring clear titles, hassle-free registration, and complete peace of mind.",
  },
  {
    title: "Vastu Consultation",
    description: "Expert Vastu guidance to ensure your new property brings prosperity, harmony, and positive energy.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#050814] py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-800/10 blur-[150px]" />

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-5">
            <span className="font-display text-5xl leading-none text-gold-500/40">
              04
            </span>
            <div>
              <span className="text-xs tracking-[0.3em] text-gold-500">
                WHAT WE DO
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream-50 sm:text-4xl">
                Our Services
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-cream-50/10 border-t border-cream-50/10">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="group flex flex-col items-start justify-between py-10 transition-colors hover:bg-black/20 sm:flex-row sm:items-center sm:px-8"
            >
              <div className="flex-1 pr-8">
                <h3 className="font-display text-3xl text-cream-50 transition-colors group-hover:text-gold-400">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-50/50">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 sm:mt-0">
                <Link
                  href="/contact"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-50/20 text-cream-50 transition-all group-hover:border-gold-500 group-hover:bg-gold-500/10 group-hover:text-gold-500"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
