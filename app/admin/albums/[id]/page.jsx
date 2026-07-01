"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AlbumDetailsPage() {
  const params = useParams();

  const [album, setAlbum] = useState(null);
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  async function setCoverPhoto(url) {
    const { error } = await supabase
      .from("albums")
      .update({
        cover_photo: url,
      })
      .eq("id", params.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadAlbum();

    alert("Cover photo updated!");
  }

  async function deleteMedia(id) {
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMedia();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        {album?.title || "Album"}
      </h1>

      <p className="text-slate-600 mb-8">
        {album?.description}
      </p>

      {album?.cover_photo && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">
            Album Cover
          </h2>

          <img
            src={album.cover_photo}
            alt="Album Cover"
            className="w-64 h-40 object-cover rounded-lg border"
          />
        </div>
      )}

      <form
        onSubmit={uploadFiles}
        className="bg-white rounded-xl shadow p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Upload Photos & Videos
        </h2>

        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) =>
            setFiles(Array.from(e.target.files || []))
          }
          className="mb-4"
        />

        {files.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-2">
              Selected Files
            </p>

            <ul className="list-disc ml-6">
              {files.map((file, index) => (
                <li key={index}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4"
          >
            {item.file_type === "video" ? (
              <video
                controls
                className="w-full rounded"
              >
                <source
                  src={item.file_url}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={item.file_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />
            )}

            <h3 className="font-bold mt-3 break-words">
              {item.title}
            </h3>

            {item.file_type === "photo" && (
              <button
                onClick={() =>
                  setCoverPhoto(item.file_url)
                }
                className="mt-3 mr-2 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Set As Cover
              </button>
            )}

            <button
              onClick={() => deleteMedia(item.id)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}