"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FaUsers,
  FaNewspaper,
  FaImages,
  FaDownload,
  FaEnvelope,
  FaRocket,
} from "react-icons/fa";

export default function AdminPage() {
  const [stats, setStats] = useState({
    faculty: 0,
    news: 0,
    projects: 0,
    albums: 0,
    downloads: 0,
    messages: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [
      facultyResult,
      newsResult,
      projectsResult,
      albumsResult,
      downloadsResult,
      messagesResult,
    ] = await Promise.all([
      supabase.from("faculty").select("*", { count: "exact", head: true }),
      supabase.from("news").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("albums").select("*", { count: "exact", head: true }),
      supabase.from("downloads").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      faculty: facultyResult.count || 0,
      news: newsResult.count || 0,
      projects: projectsResult.count || 0,
      albums: albumsResult.count || 0,
      downloads: downloadsResult.count || 0,
      messages: messagesResult.count || 0,
    });
  }

  const cards = [
    {
      title: "Faculty",
      count: stats.faculty,
      icon: <FaUsers />,
      href: "/admin/faculty",
      color: "bg-blue-600",
    },
    {
      title: "News",
      count: stats.news,
      icon: <FaNewspaper />,
      href: "/admin/news",
      color: "bg-green-600",
    },
    {
      title: "Projects",
      count: stats.projects,
      icon: <FaRocket />,
      href: "/admin/projects",
      color: "bg-blue-700",
    },
    {
      title: "Albums",
      count: stats.albums,
      icon: <FaImages />,
      href: "/admin/albums",
      color: "bg-purple-600",
    },
    {
      title: "Downloads",
      count: stats.downloads,
      icon: <FaDownload />,
      href: "/admin/downloads",
      color: "bg-orange-600",
    },
    {
      title: "Messages",
      count: stats.messages,
      icon: <FaEnvelope />,
      href: "/admin/messages",
      color: "bg-red-600",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      {/* Grid: 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-2xl shadow hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between"
          >
            <div>
              <div
                className={`${card.color} w-10 h-10 rounded-xl text-white flex items-center justify-center text-lg mb-3`}
              >
                {card.icon}
              </div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </h2>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}