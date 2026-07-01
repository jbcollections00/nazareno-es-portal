import { supabase } from "@/lib/supabase";
import GalleryViewer from "@/components/gallery/GalleryViewer";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();

  const { data: media } = await supabase
    .from("gallery")
    .select("*")
    .eq("album_id", id)
    .order("id", {
      ascending: false,
    });

  if (!album) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Album not found
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-[1800px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            {album.title}
          </h1>

          {album.description && (
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {album.description}
            </p>
          )}

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>

          <p className="text-slate-500 mt-6">
            {media?.length || 0} media item
            {(media?.length || 0) !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {!media || media.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No media available in this album.
            </h2>
          </div>
        ) : (
          <GalleryViewer
            media={media || []}
          />
        )}
      </div>
    </section>
  );
}