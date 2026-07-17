"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaBookOpen, FaHeart, FaArrowRight, FaSpinner } from "react-icons/fa";

export default function ProgramsSection() {
  const [realProjects, setRealProjects] = useState([]);
  const [hopeProjects, setHopeProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
                  As a banner <strong className="text-emerald-700 font-bold">core project of SDO Sorsogon</strong>, this initiative represents our strategic roadmap for cultivating reading fluency, academic interventions, and robust foundational development for all learners.
                </p>

                {/* Vertical Stacked Cards for REAL project items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {realProjects.length === 0 ? (
                    <div className="col-span-full text-center py-6 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-sm">
                      No active literacy updates posted right now.
                    </div>
                  ) : (
                    realProjects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="bg-slate-50 hover:bg-slate-100/70 border border-slate-100 shadow-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full"
                      >
                        {/* Photo Displayed On Top */}
                        <div className="h-40 w-full relative overflow-hidden shrink-0 bg-slate-200">
                          {project.image_url ? (
                            <img 
                              src={project.image_url} 
                              alt={project.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl">📖</div>
                          )}
                        </div>

                        {/* Card Content Segment */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {project.title}
                            </h4>
                            <p className="text-slate-600 text-xs line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-2 border-t border-slate-200/60">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                              <span>Support Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                            </div>
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
                  Driven as a signature <strong className="text-rose-700 font-bold">core project of SDO Sorsogon</strong>, partner with us on community feeding setups, healthcare missions, value orientation tracking, and direct student wellness support ecosystems.
                </p>

                {/* Vertical Stacked Cards for HOPE project items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hopeProjects.length === 0 ? (
                    <div className="col-span-full text-center py-6 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-sm">
                      No outreach campaigns listed right now.
                    </div>
                  ) : (
                    hopeProjects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="bg-slate-50 hover:bg-slate-100/70 border border-slate-100 shadow-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full"
                      >
                        {/* Photo Displayed On Top */}
                        <div className="h-40 w-full relative overflow-hidden shrink-0 bg-slate-200">
                          {project.image_url ? (
                            <img 
                              src={project.image_url} 
                              alt={project.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl">❤️</div>
                          )}
                        </div>

                        {/* Card Content Segment */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-rose-600 transition-colors line-clamp-2">
                              {project.title}
                            </h4>
                            <p className="text-slate-600 text-xs line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-2 border-t border-slate-200/60">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                              <span>Outreach Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                            </div>
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