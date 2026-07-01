import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import Stats from "@/components/home/Stats";
import PrincipalMessage from "@/components/home/PrincipalMessage";
import NewsSection from "@/components/home/NewsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
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
      <CTA />
    </>
  );
}