import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | Rao's Estates",
  description: "Expert real estate advisory and investment consulting by SV KRISHNA Rao.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-gradient-to-b from-[#D4CBB3] via-[#EAE5D8] to-[#ECE7D9] pt-32 pb-24 text-stone-800 font-sans overflow-hidden">
        {/* Soft Background Glow Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/40 blur-[140px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_80%)] blur-[120px]" />
        </div>

        <Container className="relative z-10 max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <span className="text-[10px] tracking-[0.3em] text-[#8B6A30] font-bold uppercase font-sans">
              Expert Advisory
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl text-stone-900 font-light leading-tight">
              About Rao&apos;s Estates
            </h1>
            <p className="mt-6 text-sm sm:text-base text-stone-600 font-display font-light leading-relaxed max-w-2xl mx-auto">
              Rao&apos;s Estates is a premier real estate advisory firm dedicated to guiding families and investors toward the safest and most lucrative property investments in Andhra Pradesh. We specialize in curating top-tier, DTCP & AP RERA approved residential plots from leading developers like Sri Bhramara.
            </p>
          </div>

          {/* Founder Section */}
          <div className="bg-stone-900 text-stone-100 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              
              {/* Image */}
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden border border-stone-700/50 shadow-inner">
                <Image
                  src="/images/owner-v2.jpg"
                  alt="SV KRISHNA Rao"
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>

              {/* Biography */}
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.3em] text-[#C19B54] font-bold uppercase font-sans">
                  Principal Advisor
                </span>
                
                <h2 className="font-display text-3xl sm:text-4xl font-light">
                  SV KRISHNA Rao
                </h2>
                
                <div className="h-px w-16 bg-[#C19B54]/50" />
                
                <p className="text-sm text-stone-300 font-display font-light leading-relaxed">
                  With years of hands-on experience working directly with industry giants like Sri Bhramara, SV KRISHNA Rao brings an insider&apos;s perspective to real estate investment. 
                </p>
                
                <p className="text-sm text-stone-300 font-display font-light leading-relaxed">
                  Having overseen layout engineering, regulatory scrutiny, and title compliance from the inside, he now leverages that deep industry knowledge to advise clients independently. His mission is to cut through the noise of the real estate market and provide straightforward, honest guidance to help you secure the perfect property with a 100% clean title.
                </p>

                <div className="pt-6">
                  <Link
                    href="/contact"
                    className="inline-flex bg-stone-100 hover:bg-white text-stone-900 px-8 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors rounded-none"
                  >
                    Consult With Us &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}