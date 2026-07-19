"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaNewspaper } from "react-icons/fa";

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

    return text.length > 120
      ? text.substring(0, 120) + "..."
      : text;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            News
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stay informed with the latest announcements, activities,
            achievements, and important school events.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>

          <p className="text-slate-500 mt-6">
            {news.length} Article
            {news.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">
            Loading news...
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No news articles available.
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/news/${item.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full justify-between"
              >
                <div>
                  {/* The magic fix: Strict height container with object-cover crops everything uniformly */}
                  <div className="w-full h-56 md:h-60 overflow-hidden bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <FaNewspaper className="text-5xl text-blue-700" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-blue-700 font-semibold text-sm mb-3">
                      {formatDate(item.created_at)}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-slate-600 line-clamp-3 mb-2 text-sm leading-relaxed">
                      {getExcerpt(item.content)}
                    </p>
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