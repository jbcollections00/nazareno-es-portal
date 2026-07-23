"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaHourglassHalf, FaHandHoldingHeart, FaImages, FaBullseye } from "react-icons/fa";

export default function ProjectDetailsClient({ project }: { project: any }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Clean Cover Banner Header */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-slate-900 overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-8xl opacity-10 transform -rotate-12">🏫</span>
          </div>
        )}
        {/* Simple dark overlay for better text contrast at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-white transition-all duration-300"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>
      </div>

      {/* Main Structural Detail Segment Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-6 sm:p-10 md:p-12 space-y-10">
          
          {/* Section Header Labels */}
          <div className="space-y-4 text-center md:text-left">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
              project.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
              project.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              {project.status === "Completed" && <FaCheckCircle className="text-sm" />}
              {project.status === "In Progress" && <FaHourglassHalf className="text-sm" />}
              {project.status === "Seeking Support" && <FaHandHoldingHeart className="text-sm" />}
              {project.status}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Progress Section (Clean Blue Variant) */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Objective Progress</span>
              <span className="text-2xl font-black text-blue-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out bg-blue-600 relative"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Target Goal Milestone Content Block */}
          {project.target && (
            <div className="bg-blue-50/50 border-l-4 border-blue-600 rounded-r-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2 mb-2">
                <FaBullseye /> Target Goal Milestone
              </h3>
              <p className="text-slate-800 text-lg sm:text-xl font-bold leading-snug">{project.target}</p>
            </div>
          )}

          {/* Core Description Segment Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Details & Scope Context
            </h3>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* CONDITIONAL SEE DOCUMENTATION BUTTON */}
          {project.documentation_link && (
            <div className="pt-2">
              <Link 
                href={project.documentation_link}
                className="group inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm md:text-base"
              >
                <FaImages className="text-lg group-hover:scale-110 transition-transform" />
                See Documentation
              </Link>
            </div>
          )}

          {/* Itemized Checkbox Lists Elements */}
          {project.needed_support && project.needed_support.length > 0 && (
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                 Support Elements Needed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.needed_support.map((item: string, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">
                       <FaCheckCircle className="text-blue-600 text-base" />
                    </div>
                    <span className="text-slate-700 text-sm md:text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clean & Professional CTA Button Area */}
          <div className="mt-10 bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center shadow-lg border border-slate-800 text-white">
            <h4 className="font-extrabold text-2xl md:text-3xl mb-4 text-white">
              Ready to support {project.title}?
            </h4>
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              {project.target 
                ? `Help us achieve our milestone: "${project.target}". Contact us to volunteer, donate, or partner today.`
                : "Every hand counts! Join us in turning this school vision into a reality. Explore our support opportunities today."
              }
            </p>
            <Link 
              href={`/contact?project=${encodeURIComponent(project.title)}`}
              className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-base"
            >
              <FaHandHoldingHeart className="text-lg" />
              <span>Join this Project</span>
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}