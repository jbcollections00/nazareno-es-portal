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
              Explore memorable moments, school activities, and celebrations.
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
          /* Using items-stretch to balance out grid container row heights uniformly */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full justify-between"
              >
                <div>
                  {/* Strict horizontal landscape crop container to make portrait entries look uniform */}
                  <div className="w-full h-56 md:h-60 overflow-hidden bg-slate-100 relative">
                    {album.cover_photo ? (
                      <img
                        src={album.cover_photo}
                        alt={album.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <FaImages className="text-5xl text-blue-700" />
                      </div>
                    )}
                  </div>

                  {/* Title card text box positioned below the graphic layer for complete symmetry */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
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