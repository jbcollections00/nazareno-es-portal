import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FaImages,
  FaArrowRight,
} from "react-icons/fa";

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
            Explore memorable moments,
            school activities, programs,
            achievements, and celebrations
            captured throughout the school
            year.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>

          <p className="text-slate-500 mt-6">
            {albums?.length || 0} Album
            {(albums?.length || 0) !== 1
              ? "s"
              : ""}
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
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  {album.cover_photo ? (
                    <img
                      src={album.cover_photo}
                      alt={album.title}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-72 bg-slate-200 flex items-center justify-center">
                      <FaImages className="text-6xl text-slate-400" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white">
                      {album.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-slate-600 line-clamp-3 mb-5">
                    {album.description ||
                      "View photos and videos from this album."}
                  </p>

                  <div className="inline-flex items-center gap-2 text-blue-700 font-semibold">
                    Open Album
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