"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaHandHoldingHeart,
  FaSpinner
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header - Completed Title Version */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Into the Future: School Improvement Plan 2026-2028
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Explore upcoming projects designed to uplift Nazareno Elementary School. Together with our community, we can turn these visions into reality for our learners.
        </p>
      </div>

      {/* Conditional Content Section */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-5xl text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white shadow rounded-xl border">
          No current projects listed right now. Check back soon!
        </div>
      ) : (
        /* In-update sa 4-columns para swak sa buong design architecture ng app ninyo */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => router.push(`/projects/${project.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-full"
            >
              {/* Image Illustration Display Header Container */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden shrink-0">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border-b">
                    <span className="text-4xl">🏫</span>
                    <span className="text-xs font-bold mt-2 uppercase tracking-wider text-slate-400">School Vision</span>
                  </div>
                )}

                {/* Absolute Status Badge Indicator Overlay */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1 ${
                  project.status === "Completed" ? "bg-green-100 text-green-700" :
                  project.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {project.status === "Completed" && <FaCheckCircle />}
                  {project.status === "In Progress" && <FaHourglassHalf />}
                  {project.status === "Seeking Support" && <FaHandHoldingHeart />}
                  {project.status}
                </span>
              </div>

              {/* Main Information Block Area */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 text-xs mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Progress Bar Container */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-1">
                      <span>Progress to Target</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    {project.target && (
                      <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
                        <strong>Goal:</strong> {project.target}
                      </p>
                    )}
                  </div>

                  {/* Specific items needed section */}
                  {project.needed_support && project.needed_support.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-wide mb-1.5">
                        How you can help:
                      </h4>
                      <ul className="text-[10px] text-gray-600 space-y-1 list-disc list-inside">
                        {project.needed_support.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="line-clamp-1">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 bg-gray-50/75 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 shrink-0">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt />
                  {formatDate(project.date_posted)}
                </span>
                <span className="text-blue-600 font-bold group-hover:underline transition-all">
                  View Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}