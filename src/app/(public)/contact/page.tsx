"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { contactDetails } from "@/data/nav-links";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        source: 'contact_page',
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D4CBB3] via-[#EAE5D8] to-[#ECE7D9] py-24 text-stone-800 font-sans">
        {/* Luxury Soft Cloud Glow Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-white/30 blur-[130px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_80%)] blur-[120px]" />
          <div className="absolute -left-[10%] bottom-[10%] w-[50%] h-[50%] rounded-full bg-[#CFC8B7]/30 blur-[110px]" />
        </div>

        <Container className="relative z-10">
          {/* Header Block */}
          <div className="mb-16 border-b border-stone-950/15 pb-8">
            <span className="text-[10px] tracking-[0.25em] text-gold-700 font-bold uppercase font-sans">
              CONNECT WITH US
            </span>
            <h1 className="mt-3 font-display text-4xl text-stone-900 sm:text-5xl font-light">
              Contact Our Office
            </h1>
            <p className="mt-4 text-sm text-stone-600 max-w-2xl font-display font-light">
              Arrange a private viewing of our premier layout developments or speak to our executive partners about land portfolio strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Office details */}
            <div className="space-y-10">
              <div>
                <h3 className="text-[10px] tracking-[0.2em] font-bold text-stone-900 uppercase font-sans">
                  Corporate Headquarters
                </h3>
                <p className="mt-4 font-display text-base text-stone-800 leading-relaxed max-w-sm font-light">
                  Opposite RTC Bus Stand, Markapur,<br />
                  Prakasam District, Andhra Pradesh, India.
                </p>
              </div>

              <div>
                <h3 className="text-[10px] tracking-[0.2em] font-bold text-stone-900 uppercase font-sans">
                  Telephone Contact
                </h3>
                <a
                  href={"tel:" + contactDetails.phoneHref}
                  className="mt-4 block font-display text-2xl text-gold-700 hover:text-gold-600 transition-colors font-light"
                >
                  {contactDetails.phone}
                </a>
                <span className="text-[10px] text-stone-500 font-sans block mt-1 uppercase">
                  Monday to Saturday, 9:00 AM &mdash; 7:00 PM IST
                </span>
              </div>

              <div>
                <h3 className="text-[10px] tracking-[0.2em] font-bold text-stone-900 uppercase font-sans">
                  Email Correspondence
                </h3>
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="mt-4 block font-display text-base text-stone-800 hover:text-stone-900 transition-colors font-light"
                >
                  {contactDetails.email}
                </a>
              </div>

              <div className="pt-6 border-t border-stone-200/50">
                <a
                  href={"https://wa.me/" + contactDetails.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-stone-950/20 text-stone-800 hover:bg-stone-950/5 px-8 py-3 text-xs tracking-wider uppercase font-semibold transition-all rounded-none"
                >
                  Message on WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Right Column: Outlineless contact form */}
            <div className="bg-white/70 border border-stone-200/50 p-8 shadow-sm text-stone-800">
              <h3 className="font-display text-xl text-stone-900 font-light border-b border-stone-200/50 pb-4">
                Inquiry Registry
              </h3>
              
              <form onSubmit={handleSubmit} className="mt-8 space-y-6 font-sans text-left">
                <div>
                  <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-stone-800/40 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider"
                    placeholder="YOUR FULL NAME"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-stone-800/40 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider"
                    placeholder="YOUR EMAIL"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full bg-transparent border-b border-stone-800/40 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider"
                    placeholder="YOUR PHONE NUMBER"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest text-stone-500 uppercase font-semibold block mb-1">
                    Message Summary
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    className="w-full bg-transparent border-b border-stone-800/40 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-wider resize-none"
                    placeholder="HOW CAN WE ASSIST IN YOUR REAL ESTATE ACQUISITIONS..."
                  />
                </div>

                <div className="pt-4 space-y-4">
                  {success && (
                    <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 border border-emerald-100 font-medium">
                      Thank you! Your message has been received. Our advisory team will contact you shortly.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 hover:bg-stone-950 text-white py-4 text-xs font-bold tracking-widest uppercase transition-colors rounded-none disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}