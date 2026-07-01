import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FaImages,
  FaArrowRight,
} from "react-icons/fa";

export default async function GalleryPreview() {
  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .order("id", { ascending: false })
    .limit(6);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-5xl font-bold text-slate-900">
              School Gallery
            </h2>

            <p className="text-lg text-slate-600 mt-3">
              Explore memorable moments,
              school activities, and
              celebrations.
            </p>
          </div>

          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center gap-2 text-blue-700 font-semibold"
          >
            View All
            <FaArrowRight />
          </Link>
        </div>

        {!albums || albums.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            No gallery albums available.
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
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-64 bg-blue-100 flex items-center justify-center">
                      <FaImages className="text-6xl text-blue-700" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white">
                      {album.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-blue-700 font-semibold"
          >
            View All
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}