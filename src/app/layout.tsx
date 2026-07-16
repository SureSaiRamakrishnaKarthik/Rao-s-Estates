import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rao's Estates",
  description: "Rao's Estates Next.js app scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorantGaramond.variable}`}>
      <body className="font-sans">
        {children}
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}