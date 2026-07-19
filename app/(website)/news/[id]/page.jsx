import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaImages } from "react-icons/fa";
import FloatingBackButton from "@/components/FloatingBackButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: article } = await supabase.from("news").select("*").eq("id", id).single();
  if (!article) return { title: "News" };

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
      images: [{ url: imageUrl }],
    },
  };
}

export default async function NewsArticlePage({ params }) {
  const { id } = await params;
  const { data: article, error } = await supabase.from("news").select("*").eq("id", id).single();

  if (error || !article) {
    notFound();
  }

  const paragraphs = (article.content || "").split("\n").filter((p) => p.trim() !== "");

  return (
    <section className="bg-slate-50 min-h-screen pb-16 relative">
      {/* Global Fixed Hovering Back Button */}
      <FloatingBackButton fallbackUrl="/news" />

      {/* Hero Banner Image Area */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900">
        {article.image ? (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900" />
        )}
      </div>

      {/* Floating Card Content Wrapper Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-20">
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-16">
            <p className="text-sm font-semibold text-blue-700 mb-4">
              {new Date(article.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-10">
              {article.title}
            </h1>

            <div className="font-serif text-slate-800 text-[1.15rem] leading-10 text-justify mb-12">
              {(paragraphs.length > 0 ? paragraphs : [article.content]).map((paragraph, index) => (
                <p key={index} className="indent-12 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* See Documentation Button Option */}
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