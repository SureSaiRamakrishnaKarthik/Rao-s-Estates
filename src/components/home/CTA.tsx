import Container from "@/components/layout/Container";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24">
      <Container className="relative z-10 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl leading-[1.2] text-cream-50 sm:text-4xl">
          Interested in Our Properties?
        </h2>
        
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream-50/70">
          Contact us for a private consultation or to arrange a viewing of any property in our collection.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="flex h-12 items-center justify-center bg-white px-8 text-xs font-semibold tracking-widest text-black hover:bg-white/90 transition-all uppercase"
          >
            Contact Us &rarr;
          </Link>
          <Link
            href="/properties"
            className="flex h-12 items-center justify-center border border-white/20 bg-transparent px-8 text-xs font-semibold tracking-widest text-cream-50 hover:border-white hover:bg-white/5 transition-all uppercase"
          >
            View Properties
          </Link>
        </div>
      </Container>
    </section>
  );
}
