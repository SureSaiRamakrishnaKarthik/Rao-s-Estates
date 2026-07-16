import Container from "@/components/layout/Container";

const testimonials = [
  {
    quote: "Rao's Estates helped us find the perfect commercial plot. Their transparency and legal support made the entire process seamless.",
    author: "Rajesh Kumar",
    role: "Business Owner",
  },
  {
    quote: "I bought my first residential plot with them 5 years ago, and its value has doubled. Truly the most trusted real estate brand.",
    author: "Sunita Reddy",
    role: "Investor",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#050814] py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-gold-500/5 blur-[120px]" />

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-5">
            <span className="font-display text-5xl leading-none text-gold-500/40">
              06
            </span>
            <div>
              <span className="text-xs tracking-[0.3em] text-gold-500">
                CLIENT SUCCESS
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream-50 sm:text-4xl">
                Testimonials
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((test, i) => (
            <div key={i} className="relative rounded-3xl border border-cream-50/10 bg-black p-10 sm:p-14">
              <div className="absolute top-8 left-8 text-8xl leading-none text-gold-500/10 font-display">
                &ldquo;
              </div>
              <p className="relative z-10 font-display text-xl leading-relaxed text-cream-50 sm:text-2xl">
                {test.quote}
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-cream-50/10 pt-8">
                <div className="h-12 w-12 rounded-full bg-navy-800" />
                <div>
                  <h4 className="text-sm font-bold tracking-wide text-gold-400 uppercase">{test.author}</h4>
                  <p className="text-xs text-cream-50/50">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
