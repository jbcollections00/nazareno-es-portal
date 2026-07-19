"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  FaNewspaper,
  FaArrowRight,
} from "react-icons/fa";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(3);

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

    return text.length > 100
      ? text.substring(0, 100) + "..."
      : text;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-5xl font-bold text-slate-900">
              Latest News
            </h2>

            <p className="text-slate-600 mt-3 text-lg">
              Stay informed with the latest school activities, announcements, and achievements.
            </p>
          </div>

          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900"
          >
            View All News
            <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Loading news...
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            No news articles available.
          </div>
        ) : (
          /* Using items-stretch to balance out grid item heights */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/news/${item.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 cursor-pointer group flex flex-col h-full justify-between"
              >
                <div>
                  {/* Strict portrait-to-landscape image cropper container */}
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

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 leading-7 line-clamp-3 text-sm">
                      {getExcerpt(item.content)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-blue-700 font-semibold"
          >
            View All News
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}