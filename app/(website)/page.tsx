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
    <main className="relative min-h-screen bg-slate-50 overflow-x-hidden selection:bg-indigo-500 selection:text-white scroll-smooth">
      
      {/* 
        Global Decorative Background 
        FIX: Nagdagdag tayo ng 'overflow-hidden' dito para hindi lumampas sa screen ang mga blurs
      */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center opacity-40 mix-blend-multiply overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-300 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-indigo-300 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-40 left-1/4 w-[40rem] h-[40rem] bg-purple-300 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col gap-y-8 md:gap-y-16 pb-16">
        <Hero />
        <QuickLinks />
        <Stats />
        <PrincipalMessage />
        <NewsSection />
        <GalleryPreview />
        <FutureSection />
        <ProgramsSection /> 
        <CTA />
      </div>
      
    </main>
  );
}