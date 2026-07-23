"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaHandHoldingHeart,
  FaArrowRight
} from "react-icons/fa";

export default function IntoTheFuturePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchLiveProjects() {
      setLoading(true);
      
      // Sinasala lamang ang mga may section_type na "future" at hindi isinasama ang real at hope
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("section_type", "future")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchLiveProjects();
  }, []);

  // Safe helper to format DB timestamp strings to standard local text layouts
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper for dynamic colorful badges
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-200 shadow-md";
      case "In Progress":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-200 shadow-md";
      case "Seeking Support":
        return "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200 shadow-md";
      default:
        return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-200 shadow-md";
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Into the Future: <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">School Improvement Plan 2026-2028</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Explore upcoming projects designed to uplift Nazareno Elementary School. Together with our community, we can turn these visions into reality for our learners.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>
        </div>

        {/* Conditional Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-indigo-600 font-semibold">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              No current projects listed right now.
            </h2>
            <p className="text-slate-500">Check back soon to see our future initiatives!</p>
          </div>
        ) : (
          /* Grid Container */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group relative bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 h-full"
              >
                {/* Image & Badge Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-400">
                      <span className="text-5xl mb-2">🏫</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">School Vision</span>
                    </div>
                  )}

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Vibrant Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 text-[11px] font-extrabold rounded-full flex items-center gap-1.5 uppercase tracking-wide ${getStatusStyle(project.status)}`}>
                    {project.status === "Completed" && <FaCheckCircle className="text-sm" />}
                    {project.status === "In Progress" && <FaHourglassHalf className="text-sm" />}
                    {project.status === "Seeking Support" && <FaHandHoldingHeart className="text-sm" />}
                    {project.status}
                  </div>
                </div>

                {/* Main Information Block Area */}
                <div className="p-6 flex-grow flex flex-col justify-between bg-white relative z-10">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress Bar Container */}
                    <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>Progress</span>
                        <span className="text-indigo-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      {project.target && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
                          <strong className="text-slate-700">Goal:</strong> {project.target}
                        </p>
                      )}
                    </div>

                    {/* Specific items needed section */}
                    {project.needed_support && project.needed_support.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FaHandHoldingHeart /> How you can help:
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium pl-1">
                          {project.needed_support.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="line-clamp-1">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 rounded-b-3xl">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <FaCalendarAlt className="text-slate-400" />
                    {formatDate(project.date_posted)}
                  </span>
                  <span className="text-indigo-600 text-sm font-bold flex items-center gap-1 group-hover:text-indigo-800 transition-colors">
                    View Details
                    <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}