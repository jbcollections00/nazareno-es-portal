"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaBookOpen, FaHeart, FaHammer, FaBookReader, FaLaptopCode, FaArrowRight, FaSpinner } from "react-icons/fa";

export default function ProgramsSection() {
  const [realProjects, setRealProjects] = useState([]);
  const [hopeProjects, setHopeProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgramsData() {
      setLoading(true);
      
      // 1. Fetch Project REAL 3.0 items
      const { data: realData } = await supabase
        .from("projects")
        .select("*")
        .eq("section_type", "real")
        .order("sort_order", { ascending: true })
        .limit(2);

      // 2. Fetch Journey of HOPE items
      const { data: hopeData } = await supabase
        .from("projects")
        .select("*")
        .eq("section_type", "hope")
        .order("sort_order", { ascending: true })
        .limit(2);

      if (realData) setRealProjects(realData);
      if (hopeData) setHopeProjects(hopeData);
      setLoading(false);
    }

    fetchProgramsData();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "infrastructure": return <FaHammer className="text-orange-500" />;
      case "materials": return <FaBookReader className="text-blue-500" />;
      case "technology": return <FaLaptopCode className="text-purple-500" />;
      default: return <FaBookOpen className="text-slate-500" />;
    }
  };

  return (
    <section className="bg-white py-16 px-4 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* COLUMN 1: PROJECT REAL 3.0 */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold uppercase tracking-wider text-sm mb-2">
                  <FaBookOpen />
                  <span>Academic Advocacy</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Project REAL 3.0
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                  Explore our strategic roadmap for cultivating reading fluency, academic interventions, and robust foundational development for all learners.
                </p>

                {/* Sub-grid for REAL project items */}
                <div className="space-y-4">
                  {realProjects.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-sm">
                      No active literacy updates posted right now.
                    </div>
                  ) : (
                    realProjects.map((project) => (
                      <div key={project.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {getCategoryIcon(project.category)}
                          <span>{project.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1 text-base">{project.title}</h4>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-4">{project.description}</p>
                        
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Link href="/projects" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 transition-colors group text-sm mt-6">
                View All REAL Initiatives <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* COLUMN 2: JOURNEY OF HOPE */}
            <div className="flex flex-col justify-between border-t pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-16 border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-semibold uppercase tracking-wider text-sm mb-2">
                  <FaHeart />
                  <span>Community & Extension</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Journey of HOPE
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                  Partner with us on community feeding setups, healthcare missions, value orientation tracking, and direct student wellness support ecosystems.
                </p>

                {/* Sub-grid for HOPE project items */}
                <div className="space-y-4">
                  {hopeProjects.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-sm">
                      No outreach campaigns listed right now.
                    </div>
                  ) : (
                    hopeProjects.map((project) => (
                      <div key={project.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {getCategoryIcon(project.category)}
                          <span>{project.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1 text-base">{project.title}</h4>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-4">{project.description}</p>
                        
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Outreach Milestone</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-rose-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Link href="/projects" className="inline-flex items-center gap-2 text-rose-600 font-bold hover:text-rose-800 transition-colors group text-sm mt-6">
                View All Outreaches <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}