import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

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

  return {
    title: article.title,
    description: article.content?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 160),
      url: `https://nazareno-es-portal.vercel.app/news/${id}`,
      images: article.image ? [{ url: article.image }] : [],
      type: "article",
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

            <div className="font-serif text-slate-800 text-[1.15rem] leading-10 text-justify">
              {(paragraphs.length > 0 ? paragraphs : [article.content]).map((paragraph, index) => (
                <p key={index} className="indent-12 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
