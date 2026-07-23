import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaImages } from "react-icons/fa"; // Cleaned up unused arrow icon

export default async function GalleryPage() {
  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .order("id", { ascending: false });

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            School Gallery
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore memorable moments, school activities, programs, achievements, and celebrations captured throughout the school year.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>

          <p className="text-slate-500 mt-6">
            {albums?.length || 0} Album
            {(albums?.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {!albums || albums.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No albums available.
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* 1. Uniform Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {album.cover_photo ? (
                    <img
                      src={album.cover_photo}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImages className="text-6xl text-slate-300" />
                    </div>
                  )}
                </div>

                {/* 2. Uniform Title Content Container (No descriptions or buttons) */}
                <div className="p-6 flex items-center min-h-[100px]">
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
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