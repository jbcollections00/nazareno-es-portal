"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaNewspaper, FaRegCalendarAlt, FaArrowRight } from "react-icons/fa";

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setNews(data || []);
    setLoading(false);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getExcerpt(text) {
    if (!text) return "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            School <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">News</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Stay informed with the latest announcements, activities, achievements, and important school events.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>

          <p className="text-sm font-semibold text-slate-500 mt-6 bg-white/70 backdrop-blur-sm inline-block px-5 py-2 rounded-full border border-slate-200/60 shadow-xs">
            {news.length} {news.length === 1 ? "Article Published" : "Articles Published"}
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-indigo-600 font-semibold">Loading latest news...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700">
              No news articles available at the moment.
            </h2>
            <p className="text-slate-500 mt-2">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/news/${item.id}`)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="w-full h-56 md:h-60 relative overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50/50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-600">
                      <FaNewspaper className="text-6xl text-white/80 drop-shadow-lg" />
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white relative z-10">
                  <div>
                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4">
                      <FaRegCalendarAlt />
                      {formatDate(item.created_at)}
                    </div>

                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                      {item.title}
                    </h2>

                    <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed mb-4">
                      {getExcerpt(item.content)}
                    </p>
                  </div>

                  {/* Read More Indicator */}
                  <div className="flex items-center text-sm font-bold text-indigo-500 group-hover:text-indigo-700 transition-colors mt-2">
                    Read full article
                    <FaArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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