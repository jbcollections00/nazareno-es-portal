import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import Stats from "@/components/home/Stats";
import PrincipalMessage from "@/components/home/PrincipalMessage";
import NewsSection from "@/components/home/NewsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import FutureSection from "@/components/home/FutureSection"; 
import ProgramsSection from "@/components/home/ProgramsSection"; 
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
      <FutureSection /> {/* Dito muling lalabas ang 'Into the Future' section sa iyong screen */}
      <ProgramsSection /> 
      <CTA />
    </>
  );
}