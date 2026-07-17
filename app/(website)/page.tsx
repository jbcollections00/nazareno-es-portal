import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import Stats from "@/components/home/Stats";
import PrincipalMessage from "@/components/home/PrincipalMessage";
import NewsSection from "@/components/home/NewsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import FutureSection from "@/components/home/FutureSection";
import ProgramsSection from "@/components/home/ProgramsSection"; // Imported the new combined section
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <Stats />
      <PrincipalMessage />
      <NewsSection />
      <GalleryPreview />
      <FutureSection /> 
      <ProgramsSection /> {/* Placed right after Into the Future and before the CTA banner */}
      <CTA />
    </>
  );
}