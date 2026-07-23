import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaImages } from "react-icons/fa";

export default async function GalleryPage() {
  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .order("id", { ascending: false });

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            School <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Gallery</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Explore memorable moments, school activities, programs, achievements, and celebrations captured throughout the school year.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8 mb-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>

          {/* FIXED: Perfectly aligned vibrant badge using inline-flex */}
          <div className="inline-flex items-center gap-3 px-2 py-2 pr-5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 shadow-inner">
              <FaImages className="text-indigo-600 text-sm" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              {albums?.length || 0} {(albums?.length || 0) !== 1 ? "Albums Available" : "Album Available"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {!albums || albums.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700">
              No albums available at the moment.
            </h2>
            <p className="text-slate-500 mt-2">Check back later for new pictures!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* 1. Uniform Image Container with Hover Gradient */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50/50">
                  {album.cover_photo ? (
                    <img
                      src={album.cover_photo}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200">
                      <FaImages className="text-6xl text-slate-300 drop-shadow-sm mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Empty Album</span>
                    </div>
                  )}

                  {/* Gradient Overlay for subtle dramatic effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* 2. Uniform Title Content Container */}
                <div className="p-6 flex items-center min-h-[100px] bg-white relative z-10 grow">
                  <h2 className="text-xl font-extrabold text-slate-800 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all leading-snug">
                    {album.title}
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