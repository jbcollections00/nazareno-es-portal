"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FaFolder,
  FaArrowRight,
} from "react-icons/fa";

export default function DownloadsPage() {
  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Downloads
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Access forms, memorandums,
            policies, learning materials,
            and other downloadable school
            resources.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>

          <p className="text-slate-500 mt-6">
            {filteredFolders.length} Folder
            {filteredFolders.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <div className="mb-10">
          <input
            type="text"
            placeholder="Search folders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredFolders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No folders available.
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFolders.map((folder) => (
              <Link
                key={folder.id}
                href={`/downloads/${folder.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-56 bg-blue-50 flex items-center justify-center">
                  <FaFolder className="text-7xl text-blue-700" />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {folder.name}
                  </h2>

                  <div className="inline-flex items-center gap-2 text-blue-700 font-semibold">
                    Open Folder
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}