import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from "next";
import {
  FaCalendarAlt,
  FaBullhorn,
  FaInfoCircle,
} from "react-icons/fa";

type Props = {
  params: Promise<{ id: string }>;
};

// 🚀 DYNAMIC METADATA PARA SA FACEBOOK/MESSENGER PREVIEW
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: announcement } = await supabase
    .from("announcements")
    .select("title, content, image_url")
    .eq("id", id)
    .single();

  if (!announcement) {
    return {
      title: "Anunsyo - Nazareno Elementary School",
    };
  }

  // Default fallback image kung sakaling walang nai-upload na poster
  const previewImage = announcement.image_url || "https://nazareno-es-portal.vercel.app/logo.png";

  return {
    title: announcement.title,
    description: announcement.content?.slice(0, 160) || "Magbasa ng karagdagang detalye ukol sa anunsyong ito.",
    openGraph: {
      title: announcement.title,
      description: announcement.content?.slice(0, 160),
      url: `https://nazareno-es-portal.vercel.app/announcements/${id}`,
      siteName: "Nazareno Elementary School Portal",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: announcement.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: announcement.title,
      description: announcement.content?.slice(0, 160),
      images: [previewImage],
    },
  };
}

export default async function AnnouncementDetailsPage({ params }: Props) {
  const { id } = await params;

  // Fetch announcement data from Supabase
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (!announcement) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-800">
          Hindi mahanap ang anunsyo.
        </h1>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:underline font-semibold"
        >
          Bumalik sa Home Page
        </Link>
      </div>
    );
  }

  // Format the event date cleanly
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-slate-100 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* 1. Left Side: Illustrated Poster Image */}
            {announcement.image_url && (
              <div className="md:col-span-5 w-full bg-amber-50/50 rounded-2xl border border-amber-100 p-2 overflow-hidden shadow-inner shrink-0">
                <img
                  src={announcement.image_url}
                  alt={announcement.title}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            )}

            {/* 2. Right Side: Event Info & Content */}
            <div
              className={`${
                announcement.image_url ? "md:col-span-7" : "md:col-span-12"
              } space-y-6`}
            >
              {/* Category & Date Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-amber-500 text-slate-900 font-extrabold uppercase text-xs px-4 py-1.5 rounded-full tracking-wider flex items-center gap-1.5 shadow-sm">
                  <FaBullhorn />
                  {announcement.category || "Event"}
                </span>

                {announcement.event_date && (
                  <span className="bg-amber-50 text-amber-800 font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-200/60">
                    <FaCalendarAlt className="text-amber-600" />
                    {formatDate(announcement.event_date)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {announcement.title}
              </h1>

              <hr className="border-slate-100" />

              {/* Detailed Content */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FaInfoCircle className="text-amber-500" /> Mga Detalye ng Anunsyo
                </h2>

                <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-normal bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                  {announcement.content}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}