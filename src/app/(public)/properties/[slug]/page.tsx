import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyDetailsClient from "@/components/properties/PropertyDetailsClient";
import { ProjectService } from "@/services/project.service";

import Link from "next/link";
import Container from "@/components/layout/Container";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let project: any = null;
  
  try {
    project = await ProjectService.getProjectBySlug(slug);
  } catch (e) {
    project = null;
  }

  if (!project) {
    return (
      <>
        <main className="bg-[#0B0F19] min-h-screen flex items-center justify-center text-cream-50 py-24 relative overflow-hidden">
          {/* Luxury Aurora */}
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -left-[10%] -top-[10%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-[80px]" />
            <div className="absolute -right-[10%] top-[20%] h-[60%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(26,47,76,0.15)_0%,transparent_70%)] blur-[100px]" />
          </div>

          <Container className="relative z-10 text-center space-y-6">
            <svg
              className="h-16 w-16 text-gold-500/50 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="font-display text-2xl text-cream-50">
              Project Not Found
            </h1>
            <p className="text-sm text-cream-50/70 max-w-sm mx-auto">
              The property you are looking for might have been archived, unpublished, or the web link is incorrect.
            </p>
            <Link
              href="/properties"
              className="inline-flex border border-gold-500 text-gold-400 hover:bg-gold-500/10 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Back to Listings
            </Link>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main>
        <PropertyDetailsClient project={project} />
      </main>
      <Footer />
    </>
  );
}