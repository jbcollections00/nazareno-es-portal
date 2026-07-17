"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaBookOpen, FaHeart, FaSpinner, FaAward } from "react-icons/fa";

export default function ProgramsSection() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProgramsData() {
      setLoading(true);
      
      // Kukunin ang parehong 'real' at 'hope' projects sa iisang database call
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("section_type", ["real", "hope"])
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setPrograms(data);
      }
      setLoading(false);
    }

    fetchProgramsData();
  }, []);

  return (
    <section className="bg-white py-16 px-4 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Integrated Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold uppercase tracking-wider text-sm mb-2">
              <FaAward />
              <span>Institutional Initiatives</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Academic Advocacy & Community Extension — Project REAL 3.0 & Journey of HOPE
            </h2>
            <p className="text-slate-600 mt-3 max-w-5xl text-sm md:text-base leading-relaxed">
              As signature core projects of SDO Sorsogon, these flagship initiatives represent our strategic roadmap for cultivating reading fluency, academic interventions, and robust foundational development for all learners, partner with us on community feeding setups, healthcare missions, value orientation tracking, and direct student wellness support ecosystems.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-emerald-600" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-sm">
            No active core programs posted right now.
          </div>
        ) : (
          /* Single unified display configuration grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((project) => (
              <div 
                key={project.id} 
                onClick={() => router.push(`/projects/${project.id}`)}
                className="bg-slate-50 hover:bg-slate-100/70 border border-slate-100 shadow-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full"
              >
                {/* Image top container layout graphic view context */}
                <div className="h-40 w-full relative overflow-hidden shrink-0 bg-slate-200">
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl">
                      {project.section_type === "real" ? "📖" : "❤️"}
                    </div>
                  )}

                  {/* Absolute Badge Category Identifier setup styling */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1 ${
                    project.section_type === "real" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-rose-100 text-rose-700"
                  }`}>
                    {project.section_type === "real" ? <FaBookOpen className="text-[9px]" /> : <FaHeart className="text-[9px]" />}
                    {project.section_type === "real" ? "REAL 3.0" : "HOPE"}
                  </span>
                </div>

                {/* Information segment configuration parameters */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {project.title}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Progress configuration segment tracker tracking */}
                  <div className="mt-auto pt-2 border-t border-slate-200/60">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Support Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          project.section_type === "real" ? "bg-emerald-600" : "bg-rose-600"
                        }`}
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