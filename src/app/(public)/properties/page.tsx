import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertiesList from "@/components/properties/PropertiesList";
import { ProjectService } from "@/services/project.service";
import { Suspense } from "react";

export default async function PropertiesPage() {
  const dbProjects = await ProjectService.getAllProjects();
  const publishedProjects = dbProjects.filter(p => p.publish_status === "published");

  const combinedProjects = publishedProjects;

  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#ECE7D9] flex justify-center items-center">Loading properties...</div>}>
          <PropertiesList projects={combinedProjects} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}