"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // Cards structured to match your layout's exact grid style
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
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold text-slate-900">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* Grid container matches your layout perfectly */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className={`${card.color} w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl mb-4`}>
                {card.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-600">{card.title}</h2>
            </div>
            <p className="text-5xl font-extrabold text-slate-900 mt-2">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}