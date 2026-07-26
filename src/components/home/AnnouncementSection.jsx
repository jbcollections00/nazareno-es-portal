"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaImage } from "react-icons/fa";

export default function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveAnnouncements() {
      // Current ISO timestamp string to filter out past/expired date and time
      const nowIso = new Date().toISOString();

      // Automatically filters out expired events based on exact date & time
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .gte("event_date", nowIso)
        .order("event_date", { ascending: true });

      if (!error && data) {
        setAnnouncements(data);
      }
      setLoading(false);
    }

    fetchActiveAnnouncements();
  }, []);

  if (loading || announcements.length === 0) return null;

  return (
    <section className="bg-amber-500/10 border-b border-amber-200 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Single Top Moving Banner */}
        <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base md:text-lg py-3 rounded-2xl shadow-md overflow-hidden border border-amber-400 tracking-widest">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-8 flex items-center gap-4">
              <span>📢</span> A N N O U N C E M E N T <span>📢</span>
            </span>
            <span className="mx-8 flex items-center gap-4">
              <span>📢</span> A N N O U N C E M E N T <span>📢</span>
            </span>
            <span className="mx-8 flex items-center gap-4">
              <span>📢</span> A N N O U N C E M E N T <span>📢</span>
            </span>
            <span className="mx-8 flex items-center gap-4">
              <span>📢</span> A N N O U N C E M E N T <span>📢</span>
            </span>
          </div>
        </div>

        {/* Announcement Cards List */}
        {announcements.map((item) => (
          <Link
            key={item.id}
            href={`/announcements/${item.id}`}
            className="group block bg-white rounded-3xl p-4 md:p-6 border border-amber-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            {/* Centered Picture Container */}
            <div className="w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-amber-50">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title || "Announcement Poster"}
                  className="w-full h-auto object-contain mx-auto rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
                />
              ) : (
                <div className="py-16 flex flex-col items-center gap-2 text-amber-600/60">
                  <FaImage className="text-5xl" />
                  <span className="text-sm font-semibold">
                    {item.title || "Nazareno ES"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}