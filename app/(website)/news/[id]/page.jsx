import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaImages } from "react-icons/fa";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    return {
      title: "News",
    };
  }

  const siteDomain = "https://nazareno-es-portal.vercel.app";
  
  const imageUrl = article.image 
    ? (article.image.startsWith("http") ? article.image : `${siteDomain}${article.image}`)
    : `${siteDomain}/default-logo.png`;

  return {
    title: article.title,
    description: article.content?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 160),
      url: `${siteDomain}/news/${id}`,
      type: "article",
      siteName: "Nazareno Elementary School Portal",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        {
          url: `${siteDomain}/default-logo.png`,
          width: 1200,
          height: 630,
          alt: "Nazareno Elementary School",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content?.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function NewsArticlePage({ params }) {
  const { id } = await params;

  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  const paragraphs = (article.content || "")
    .split("\n")
    .filter((p) => p.trim() !== "");

  return (
    <section className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-[400px] object-cover" />
          )}

          <div className="p-10 md:p-16">
            <p className="text-sm text-slate-500 mb-6">
              {new Date(article.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-10">
              {article.title}
            </h1>

            <div className="font-serif text-slate-800 text-[1.15rem] leading-10 text-justify mb-12">
              {(paragraphs.length > 0 ? paragraphs : [article.content]).map((paragraph, index) => (
                <p key={index} className="indent-12 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* See Documentation Button (Styled to exactly match project layout view uniform blue styling) */}
            {article.album_id && (
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center md:justify-start">
                <Link
                  href={`/gallery/${article.album_id}`} 
                  className="inline-flex items-center gap-2 bg-[#1d6bf3] hover:bg-blue-600 text-blue-950 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md"
                >
                  <FaImages className="text-lg" />
                  See Documentation
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}