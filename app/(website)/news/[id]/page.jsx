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

  // Hinati ang paragraphs at inalis ang mga blank spaces
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
              {(paragraphs.length > 0 ? paragraphs : [article.content]).map((paragraph, index) => {
                
                // CATCHY FEATURE 2: PULL-QUOTE
                // Titingnan natin kung ang talata ay nagsisimula at nagtatapos sa quotation mark (")
                const isQuote = paragraph.trim().startsWith('"') && paragraph.trim().endsWith('"');
                
                if (isQuote) {
                  return (
                    <blockquote 
                      key={index} 
                      className="border-l-4 border-blue-500 bg-blue-50/70 p-6 my-10 rounded-r-2xl font-sans font-medium text-blue-900 italic text-xl shadow-sm indent-0 text-left"
                    >
                      {paragraph}
                    </blockquote>
                  );
                }

                // CATCHY FEATURE 1: DROP CAP
                // I-a-apply lang natin ang malaking unang letra sa pinakaunang paragraph
                if (index === 0) {
                  return (
                    <p 
                      key={index} 
                      className="mb-6 first-letter:text-6xl first-letter:font-black first-letter:text-blue-700 first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:font-sans"
                    >
                      {paragraph}
                    </p>
                  );
                }

                // Default paragraph styling (ang orihinal na gusto mo)
                return (
                  <p key={index} className="indent-12 mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* CATCHY FEATURE 4: DOCUMENTATION CTA BANNER */}
            {article.album_id && (
              <div className="mt-16 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                
                {/* Text Area ng Banner */}
                <div className="text-center md:text-left font-sans">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                    Event Documentation
                  </h3>
                  <p className="text-slate-600">
                    Browse our gallery to see more captured moments and photos from this event.
                  </p>
                </div>

                {/* Ang Catchy Button */}
                <Link
                  href={`/gallery/${article.album_id}`} 
                  className="shrink-0 inline-flex items-center gap-3 bg-[#1d6bf3] hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 hover:-translate-y-1 hover:shadow-blue-500/40 hover:shadow-xl transition-all duration-300 font-sans"
                >
                  <FaImages className="text-xl" />
                  <span>See Documentation</span>
                </Link>
                
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}