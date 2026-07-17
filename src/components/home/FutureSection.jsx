"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaRocket, FaArrowRight, FaSpinner, FaCheckCircle, FaHourglassHalf, FaHandHoldingHeart } from "react-icons/fa";

export default function FutureSection() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFeaturedProjects() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("section_type", "future") 
        .order("sort_order", { ascending: true }) 
        .limit(3); // Populates the new 3-card grid layout

      if (!error && data) {
        setFeaturedProjects(data);
      }
      setLoading(false);
    }

    fetchFeaturedProjects();
  }, []);

  return (
    <section className="bg-slate-50 py-16 px-4 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2">
              <FaRocket />
              <span>School Development</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Into the Future: School Improvement Plan 2026-2028
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Take a glance at our active school improvement visions. See how you can partner with us to upgrade facilities and learning tools.
            </p>
          </div>
          
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group self-start md:self-auto text-sm shrink-0"
          >
            View All Projects 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading / Grid State Handling */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No active development plans posted right now.
          </div>
        ) : (
          /* Three Card Layout Grid Configuration */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-full"
              >
                {/* Project Image Header Display Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
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

                  {/* Absolute Badge Status Indicator overlayed on graphic */}
                  <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 ${
                    project.status === "Completed" ? "bg-green-100 text-green-700" :
                    project.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {project.status === "Completed" && <FaCheckCircle />}
                    {project.status === "In Progress" && <FaHourglassHalf />}
                    {project.status === "Seeking Support" && <FaHandHoldingHeart />}
                    {project.status}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Simple progress preview */}
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                      <span>Support Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}