import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import PropertySearch from "@/components/home/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedLocations from "@/components/home/FeaturedLocations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Developers from "@/components/home/Developers";
import CTA from "@/components/home/CTA";
import { HomeService } from "@/services/home.service";
export default async function Home() {
  const homepageData = await HomeService.getHomepageData();
  const combinedProjects = homepageData.featuredProjects;

  return (
    <>
      <Navbar transparent />
      <main>
        <Hero />
        <PropertySearch />
        <FeaturedProperties projects={combinedProjects} />
        <FeaturedLocations locations={homepageData.locations} />
        <WhyChooseUs />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
