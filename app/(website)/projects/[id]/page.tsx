import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProjectDetailsClient from "./ProjectDetailsClient";
import Link from "next/link";

// 1. Next.js 15+ requires params to be typed as a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// 2. Fetcher updated to accept the already-resolved id string
async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// 3. Updated Dynamic Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // CRITICAL: Await the dynamic params promise before reading its properties
  const { id } = await params;
  const project = await getProject(id);

  const title = project ? `${project.title} | Nazareno Elementary School` : "Project Not Found";
  const description = project ? project.description : "Official School Portal";
  
  // Use the project's actual image, or fall back to an existing asset
  const imageUrl = project?.image_url 
    ? project.image_url 
    : "https://nazareno-es-portal.vercel.app/images/logo.png"; // <-- Make sure this fallback URL is a valid image in your public folder!

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://nazareno-es-portal.vercel.app/projects/${id}`,
      siteName: "Nazareno Elementary School Portal",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project?.title || "School Logo",
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// 4. Updated Main Server Route Controller
export default async function ProjectDetailsPage({ params }: Props) {
  // CRITICAL: Await the dynamic params promise here as well
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center max-w-md">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-6">The developmental record you are searching for could not be located.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectDetailsClient project={project} />;
}