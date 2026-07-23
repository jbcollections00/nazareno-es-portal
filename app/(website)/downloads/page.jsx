"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaFolder } from "react-icons/fa";

export default function DownloadsPage() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    const { data } = await supabase
      .from("download_folders")
      .select("*")
      .order("name");

    setFolders(data || []);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 relative overflow-hidden pb-20">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            School <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Downloads</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Access official forms, memorandums, policies, learning materials, and downloadable resources.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-3 h-1 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>

          <p className="text-sm font-semibold text-slate-500 mt-4 bg-white/70 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
            {folders.length} {folders.length === 1 ? "Folder Available" : "Folders Available"}
          </p>
        </div>

        {/* Folders Grid Section */}
        {folders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700">
              No folders available yet.
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/downloads/${folder.id}`}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image / Banner Container */}
                <div className="h-60 bg-gradient-to-br from-slate-100 to-blue-50/50 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                  {folder.image ? (
                    <img
                      src={folder.image}
                      alt={folder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="p-6 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl shadow-lg shadow-indigo-200 text-white">
                      <FaFolder className="text-6xl" />
                    </div>
                  )}

                  {/* Gradient Overlay for seamless blend */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info Container - Centered Text for Minimalist Look */}
                <div className="p-6 flex items-center justify-center text-center">
                  <h2 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                    {folder.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}