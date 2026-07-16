import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertiesList from "@/components/properties/PropertiesList";
import { ProjectService } from "@/services/project.service";
import { properties as dummyProperties } from "@/data/properties";

export default async function PropertiesPage() {
  const dbProjects = await ProjectService.getAllProjects();
  const publishedProjects = dbProjects.filter(p => p.publish_status === "published");

  // Map the first dummy property to look like a database project for visual consistency
  const dummyProject = {
    title: dummyProperties[0].title,
    slug: dummyProperties[0].slug,
    approval_type: dummyProperties[0].type,
    starting_price: 1850000,
    locations: { name: dummyProperties[0].location },
    construction_status: dummyProperties[0].plotSize,
    developers: { name: dummyProperties[0].developer },
    media: [
      {
        url: dummyProperties[0].image,
        is_cover: true
      }
    ]
  };

  // Combine dummy project with database projects so the user can inspect both
  const combinedProjects = [dummyProject, ...publishedProjects];

  return (
    <>
      <Navbar />
      <main>
        <PropertiesList projects={combinedProjects} />
      </main>
      <Footer />
    </>
  );
}