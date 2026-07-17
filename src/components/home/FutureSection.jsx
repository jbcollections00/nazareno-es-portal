"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaRocket, FaHammer, FaBookReader, FaLaptopCode, FaArrowRight, FaSpinner } from "react-icons/fa";

export default function FutureSection() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      setLoading(true);
      // Fetches the 2 latest projects added to the dashboard
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false })
        .limit(2);

      if (!error && data) {
        setFeaturedProjects(data);
      }
      setLoading(false);
    }

    fetchFeaturedProjects();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "infrastructure": return <FaHammer className="text-orange-500 text-lg" />;
      case "materials": return <FaBookReader className="text-blue-500 text-lg" />;
      case "technology": return <FaLaptopCode className="text-purple-500 text-lg" />;
      default: return <FaRocket className="text-blue-500 text-lg" />;
    }
  };

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
              Into the Future: Community Projects
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Take a glance at our active school improvement visions. See how you can partner with us to upgrade facilities and learning tools.
            </p>
          </div>
          
          <Link
            href="/projects" // Points to your updated public projects route
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryIcon(project.category)}
                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Simple progress preview */}
                <div>
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}