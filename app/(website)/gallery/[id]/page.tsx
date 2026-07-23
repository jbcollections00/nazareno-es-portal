import { supabase } from "@/lib/supabase";
import GalleryViewer from "@/components/gallery/GalleryViewer";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Dynamic Metadata Generation for explicit OG tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Fetch the specific album data for the metadata tags
  const { data: album } = await supabase
    .from("albums")
    .select("title, description, cover_photo")
    .eq("id", id)
    .single();

  if (!album) return {};

  const title = `${album.title} | School Gallery`;
  const description = album.description || "View photos and videos from this album.";
  const fallbackDomain = "https://nazareno-es-portal.vercel.app";
  const imageUrl = album.cover_photo || `${fallbackDomain}/default-logo.png`; 

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${fallbackDomain}/gallery/${id}`,
      siteName: "School Portal",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: album.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

// 2. Beautiful & Colorful Component Logic
export default async function AlbumPage({ params }: Props) {
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
      <section className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Album not found</h1>
          <p className="text-slate-500">The gallery you are looking for does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-slate-50 overflow-hidden selection:bg-pink-200 selection:text-pink-900 pb-20">
      
      {/* Makulay na Ambient Background (Blurs) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center opacity-60 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-pink-300 rounded-full blur-[120px] opacity-50 mix-blend-multiply" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-blue-300 rounded-full blur-[120px] opacity-50 mix-blend-multiply" />
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-yellow-200 rounded-full blur-[120px] opacity-40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          
          {/* Pill Badge para sa Media Count */}
          <div className="inline-flex items-center justify-center px-6 py-2 mb-8 bg-gradient-to-r from-blue-50 to-pink-50 border border-white/60 shadow-sm rounded-full backdrop-blur-sm">
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-pink-600 uppercase tracking-widest">
              {media?.length || 0} Media Item{(media?.length || 0) !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Gradient Text Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 mb-8 leading-tight tracking-tight">
            {album.title}
          </h1>

          {/* Description */}
          {album.description && (
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              {album.description}
            </p>
          )}

          {/* Makulay na Divider */}
          <div className="w-40 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mx-auto mt-12 shadow-md"></div>
        </div>

        {/* Content Section */}
        {!media || media.length === 0 ? (
          /* Magandang Empty State */
          <div className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-xl border border-white/50 p-16 text-center max-w-2xl mx-auto transition-transform hover:scale-[1.02] duration-300">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-4xl">📸</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Walang laman ang album!
            </h2>
            <p className="text-lg text-slate-500">
              Kasalukuyang wala pang litrato dito. Balikan ito mamaya para sa mga makukulay na memories.
            </p>
          </div>
        ) : (
          /* Glassmorphism Wrapper para sa GalleryViewer */
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-4 sm:p-8 shadow-2xl border border-white/50 ring-1 ring-slate-900/5">
            <GalleryViewer media={media || []} />
          </div>
        )}
      </div>
    </section>
  );
}