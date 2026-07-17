"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaArrowLeft, FaSpinner, FaCheckCircle, FaHourglassHalf, FaHandHoldingHeart, FaImages } from "react-icons/fa";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!id) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading project:", error);
      } else {
        setProject(data);
      }
      setLoading(false);
    }

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20">
        <FaSpinner className="animate-spin text-5xl text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading project vision data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center max-w-md">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-6">The developmental record you are searching for could not be located or has changed position.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Dynamic Cover Banner Header */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-slate-900 overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
            <span className="text-9xl opacity-20">🏫</span>
          </div>
        )}
        {/* Soft layout visual contrast protection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Float Controls Layer */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 bg-white/95 text-slate-900 font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-white transition-all transform hover:-translate-x-1"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
        </div>
      </div>

      {/* Main Structural Detail Segment Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 space-y-8">
          
          {/* Section Header Labels */}
          <div className="space-y-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
              project.status === "Completed" ? "bg-green-100 text-green-700" :
              project.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
            }`}>
              {project.status === "Completed" && <FaCheckCircle />}
              {project.status === "In Progress" && <FaHourglassHalf />}
              {project.status === "Seeking Support" && <FaHandHoldingHeart />}
              {project.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h1>
          </div>

          <hr className="border-slate-100" />

          {/* Progress Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Objective Support Progress</span>
              <span className="text-lg font-black text-blue-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-blue-500/50"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Target Goal Milestone Content Block */}
          {project.target && (
            <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-6 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Target Goal Milestone</h3>
              <p className="text-slate-800 text-lg font-semibold leading-snug">{project.target}</p>
            </div>
          )}

          {/* Core Description Segment Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Details & Scope Context</h3>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* CONDITIONAL SEE DOCUMENTATION BUTTON */}
          {project.documentation_link && (
            <div className="pt-2">
              <Link 
                href={project.documentation_link}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg active:scale-95 text-sm md:text-base"
              >
                <FaImages className="text-lg" />
                See Documentation
              </Link>
            </div>
          )}

          {/* Itemized Checkbox Lists Elements For Operations */}
          {project.needed_support && project.needed_support.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Elements Needed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.needed_support.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl p-4 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-sm shadow-blue-500/30" />
                    <span className="text-slate-700 text-sm md:text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fully Dynamic Redirect CTA Button Area */}
          <div className="pt-8 mt-6 border-t border-slate-100 text-center">
            <h4 className="text-slate-900 font-extrabold text-lg md:text-xl mb-2">
              Ready to support {project.title}?
            </h4>
            <p className="text-slate-500 text-sm md:text-base mb-6 max-w-lg mx-auto leading-relaxed">
              {project.target 
                ? `Help us achieve our milestone: "${project.target}". Contact us to volunteer, donate, or partner today.`
                : "Every hand counts! Join us in turning this school vision into a reality. Explore our support opportunities today."
              }
            </p>
            <Link 
              href={`/contact?project=${encodeURIComponent(project.title)}`}
              className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 text-sm md:text-base tracking-wide"
            >
              <FaHandHoldingHeart className="text-lg text-white" />
              <span className="text-white">Join this Project</span>
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}