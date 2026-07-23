"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaArrowLeft, FaTrash, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

export default function AlbumDetailsPage() {
  const params = useParams();

  const [album, setAlbum] = useState(null);
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Bagong state para sa Full Screen Modal
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    if (params?.id) {
      loadAlbum();
      loadMedia();
    }
  }, [params?.id]);

  async function loadAlbum() {
    const { data } = await supabase
      .from("albums")
      .select("*")
      .eq("id", params.id)
      .single();

    setAlbum(data);
  }

  async function loadMedia() {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("album_id", params.id)
      .order("id", { ascending: false });

    setMedia(data || []);
  }

  async function uploadFiles(e) {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select files.");
      return;
    }

    setUploading(true);

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        alert(uploadError.message);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      const fileType = file.type.startsWith("video")
        ? "video"
        : "photo";

      await supabase
        .from("gallery")
        .insert([
          {
            album_id: params.id,
            title: file.name,
            file_url: publicUrl,
            file_type: fileType,
          },
        ]);
    }

    setFiles([]);
    setUploading(false);

    loadMedia();
    alert("Upload successful!");
  }

  async function deleteMedia(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this media file?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    // Isara ang modal kapag na-delete na
    setSelectedMedia(null);
    loadMedia();
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/albums"
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-full transition shadow-sm"
          title="Back to Albums"
        >
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {album?.title || "Loading Album..."}
          </h1>
          {album?.description && (
            <p className="text-slate-500 mt-1 text-lg">
              {album.description}
            </p>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <form
        onSubmit={uploadFiles}
        className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-slate-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Upload Photos & Videos
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) =>
              setFiles(Array.from(e.target.files || []))
            }
            className="text-sm text-slate-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer border border-slate-200 rounded-xl w-full md:w-auto"
          />

          {files.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                Selected Files ({files.length})
              </p>
              <ul className="list-disc ml-5 text-sm text-slate-600 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <li key={index} className="truncate">{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm w-fit flex items-center gap-2"
          >
            <FaCloudUploadAlt className="text-xl" />
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </form>

      {/* Media Gallery Grid (Masonry Layout) */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Gallery
        </h2>
        
        {media.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No media found in this album yet. Upload some files above.
          </div>
        ) : (
          /* Pinalitan ang grid ng columns para sa Masonry style */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)} // I-open sa modal pag na-click
                className="break-inside-avoid mb-4 group rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow relative"
              >
                {/* Media Element (Inalis ang aspect-square at object-cover para sumunod sa size) */}
                {item.file_type === "video" ? (
                  <video
                    src={item.file_url}
                    className="w-full h-auto"
                  />
                ) : (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                
                {/* Play icon indicator para sa mga video */}
                {item.file_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-4">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 text-3xl transition"
            title="Close"
          >
            <FaTimes />
          </button>

          {/* Media Content */}
          <div className="w-full max-w-5xl max-h-[75vh] flex items-center justify-center">
            {selectedMedia.file_type === "video" ? (
              <video
                src={selectedMedia.file_url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={selectedMedia.file_url}
                alt={selectedMedia.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Delete Action Bar */}
          <div className="mt-8">
            <button
              onClick={() => deleteMedia(selectedMedia.id)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <FaTrash /> Delete File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}