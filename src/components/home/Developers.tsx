import Container from "@/components/layout/Container";
import { Developer } from "@/types/developer";

export default function Developers({ developers }: { developers?: Developer[] }) {
  const displayDevelopers = developers || [];
  
  if (displayDevelopers.length === 0) return null;

  return (
    <section className="bg-black py-12 relative overflow-hidden border-y border-cream-50/5">
      <Container className="relative z-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-5">
            <span className="font-display text-5xl leading-none text-gold-500/40">
              04
            </span>
            <div>
              <span className="text-xs tracking-[0.3em] text-gold-500">
                OUR PARTNERS
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream-50 sm:text-4xl">
                Trusted Developers
              </h2>
            </div>
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className="relative flex w-full overflow-hidden bg-[#0a0a0a] py-6 rounded-3xl border border-cream-50/10">
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
          
          <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap">
            {[...displayDevelopers, ...displayDevelopers, ...displayDevelopers].map((dev, i) => (
              <div
                key={i}
                className="mx-12 text-lg font-display text-cream-50/40 transition-colors hover:text-gold-500"
              >
                {dev.name}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
