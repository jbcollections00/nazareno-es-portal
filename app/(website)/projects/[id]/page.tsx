import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProjectDetailsClient from "./ProjectDetailsClient"; // This will be your UI component
import Link from "next/link";

type Props = {
  params: { id: string };
};

// 1. Centralized server-side data fetcher
async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// 2. DYNAMIC OPEN GRAPH METADATA GENERATOR
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.id);

  const title = project ? `${project.title} | Nazareno Elementary School` : "Project Not Found";
  const description = project ? project.description : "Official School Portal";
  
  // NOTE: Meta requires full absolute URLs (starting with https://)
  const imageUrl = project?.image_url 
    ? project.image_url 
    : "https://nazareno-es-portal.vercel.app/default-logo.png"; 

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://nazareno-es-portal.vercel.app/projects/${params.id}`,
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

// 3. MAIN SERVER ROUTE CONTROLLER
export default async function ProjectDetailsPage({ params }: Props) {
  const project = await getProject(params.id);

  // If the record isn't in your database, render the fallback immediately
  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center max-w-md">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-6">The developmental record you are searching for could not be located or has changed position.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Pass the pre-fetched project data directly into the Client layout
  return <ProjectDetailsClient project={project} />;
}