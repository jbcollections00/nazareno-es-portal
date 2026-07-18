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

  const siteDomain = "https://nazareno-es-portal.vercel.app";
  
  // 1. Ensure the image path is a full, absolute URL. 
  // If it's already a full Supabase HTTP link, use it. Otherwise, attach your domain.
  const imageUrl = article.image 
    ? (article.image.startsWith("http") ? article.image : `${siteDomain}${article.image}`)
    : `${siteDomain}/default-logo.png`; // Fallback image if the article has no image

  return {
    title: article.title,
    description: article.content?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 160),
      url: `${siteDomain}/news/${id}`,
      type: "article",
      siteName: "Nazareno Elementary School Portal",
      // 2. Added explicit width, height, and alt tags for Facebook's crawler
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
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