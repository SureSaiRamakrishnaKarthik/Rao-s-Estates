"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";

const faqs = [
  {
    question: "Are your properties legally verified?",
    answer: "Yes, 100% of our properties undergo rigorous legal vetting before they are listed. We ensure clear titles and seamless registration for complete peace of mind.",
  },
  {
    question: "Do you offer loan assistance?",
    answer: "Absolutely. We are partnered with all major national banks to provide quick, hassle-free financing options with the best interest rates for our clients.",
  },
  {
    question: "What areas do you currently serve?",
    answer: "We focus on high-growth corridors across Andhra Pradesh, including prime layouts in Vijayawada, Guntur, Amaravati, Markapur, and surrounding coastal regions.",
  },
  {
    question: "Can non-residents (NRIs) invest?",
    answer: "Yes, we have a dedicated NRI desk to facilitate remote investments, complete with digital documentation and video-assisted property tours.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black py-24 relative overflow-hidden">
      <Container className="relative z-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-5">
            <span className="font-display text-5xl leading-none text-gold-500/40">
              07
            </span>
            <div>
              <span className="text-xs tracking-[0.3em] text-gold-500">
                CLARITY FIRST
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream-50 sm:text-4xl">
                Common Questions
              </h2>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl divide-y divide-cream-50/10 border-y border-cream-50/10">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left focus:outline-none"
              >
                <h3 className={`font-display text-xl transition-colors ${openIndex === i ? "text-gold-500" : "text-cream-50 hover:text-gold-300"}`}>
                  {faq.question}
                </h3>
                <span className="ml-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream-50/20 text-cream-50/50 transition-colors">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="mt-4 pr-12 text-sm leading-relaxed text-cream-50/60 animate-in slide-in-from-top-2 fade-in duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
