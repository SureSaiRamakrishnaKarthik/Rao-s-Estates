export type Property = {
  slug: string;
  title: string;
  type: "Open Plots" | "Residential Plots" | "Commercial Lands" | "Farm Lands" | "Apartments";
  price: string;
  location: string;
  plotSize: string;
  developer: string;
  image: string;
  featured: boolean;
};

// Dummy data — will be replaced by a Supabase query (`properties` table) later.
// Keep the shape identical so swapping the data source doesn't touch any component.
export const properties: Property[] = [
  {
    slug: "green-valley-plot-14",
    title: "Green Valley Layout, Plot 14",
    type: "Open Plots",
    price: "₹18,50,000",
    location: "Markapur",
    plotSize: "200 sq. yards",
    developer: "Sri Lakshmi Developers",
    image: "/images/properties/plot-01.jpg",
    featured: true,
  },
  {
    slug: "riverside-residency-a7",
    title: "Riverside Residency, Unit A7",
    type: "Apartments",
    price: "₹42,00,000",
    location: "Vijayawada",
    plotSize: "1,450 sq. ft.",
    developer: "Krishna Towers",
    image: "/images/properties/plot-02.jpg",
    featured: true,
  },
  {
    slug: "highway-commercial-plot-3",
    title: "NH-40 Highway Frontage Plot",
    type: "Commercial Lands",
    price: "₹65,00,000",
    location: "Guntur",
    plotSize: "600 sq. yards",
    developer: "Amaravati Estates",
    image: "/images/properties/plot-03.jpg",
    featured: true,
  },
  {
    slug: "sunrise-farms-plot-9",
    title: "Sunrise Farms, Plot 9",
    type: "Farm Lands",
    price: "₹28,00,000",
    location: "Chirala",
    plotSize: "2 acres",
    developer: "Coastal Agro Lands",
    image: "/images/properties/plot-01.jpg",
    featured: true,
  },
  {
    slug: "amaravati-heights-plot-2",
    title: "Amaravati Heights, Plot 2",
    type: "Residential Plots",
    price: "₹22,75,000",
    location: "Amaravati",
    plotSize: "240 sq. yards",
    developer: "Capital City Builders",
    image: "/images/properties/plot-02.jpg",
    featured: true,
  },
  {
    slug: "bapatla-beach-view-plot-5",
    title: "Beach View Layout, Plot 5",
    type: "Open Plots",
    price: "₹15,20,000",
    location: "Bapatla",
    plotSize: "180 sq. yards",
    developer: "Sri Lakshmi Developers",
    image: "/images/properties/plot-03.jpg",
    featured: true,
  },
];
