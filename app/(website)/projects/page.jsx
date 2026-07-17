"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FaHammer, 
  FaBookReader, 
  FaLaptopCode, 
  FaHandsHelping, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaSpinner
} from "react-icons/fa";

export default function IntoTheFuturePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchLiveProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchLiveProjects();
  }, []);

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "infrastructure": return <FaHammer className="text-orange-500" />;
      case "materials": return <FaBookReader className="text-blue-500" />;
      case "technology": return <FaLaptopCode className="text-purple-500" />;
      default: return <FaHandsHelping />;
    }
  };

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
          Into the Future
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore upcoming projects designed to uplift Nazareno Elementary School. Together with our community, we can turn these visions into reality for our learners.
        </p>
      </div>

      {/* Category Filter Controls */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {["all", "infrastructure", "technology", "materials"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 uppercase ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conditional Content Section */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-5xl text-blue-600" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white shadow rounded-xl border">
          No current projects listed under this category. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Status Bar and Category Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-xl font-bold">
                    {getCategoryIcon(project.category)}
                    <span className="capitalize text-xs text-gray-400 font-medium">
                      {project.category}
                    </span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    project.status === "Completed" 
                      ? "bg-green-100 text-green-700" 
                      : project.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {project.status === "Completed" ? <FaCheckCircle /> : <FaHourglassHalf />}
                    {project.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {project.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-4">
                  {project.description}
                </p>

                {/* Progress Bar Container */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                    <span>Progress to Target</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Goal:</strong> {project.target}
                  </p>
                </div>

                {/* Specific items needed section */}
                {project.needed_support && project.needed_support.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">
                      How you can help:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                      {project.needed_support.map((item, idx) => (
                        <li key={idx} className="line-clamp-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button Footer */}
              <div className="p-6 bg-gray-50/75 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt />
                  {formatDate(project.date_posted)}
                </span>
                <button 
                  onClick={() => window.location.href = "/contact"}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Get Involved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}