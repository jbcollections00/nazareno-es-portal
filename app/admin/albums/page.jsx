"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaFolderOpen, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function AlbumsAdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [albums, setAlbums] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState(null);

  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    const { data } = await supabase
      .from("albums")
      .select("*")
      .order("id", { ascending: false });

    setAlbums(data || []);
  }

  async function addAlbum(e) {
    e.preventDefault();
    setSaving(true);

    let coverImageUrl = null;

    if (coverImage) {
      const fileName = `${Date.now()}-${coverImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, coverImage);

      if (uploadError) {
        setSaving(false);
        alert("Error uploading cover: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      coverImageUrl = publicUrl;
    }

    const { error } = await supabase
      .from("albums")
      .insert([
        {
          title,
          description,
          cover_photo: coverImageUrl, // <-- Pinalitan ng cover_photo
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setCoverImage(null);

    loadAlbums();
    alert("Album created successfully!");
  }

  async function updateAlbum(id, currentCoverImage) {
    setUpdating(true);
    let coverImageUrl = currentCoverImage;

    if (editCoverImage) {
      const fileName = `${Date.now()}-${editCoverImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, editCoverImage);

      if (uploadError) {
        setUpdating(false);
        alert("Error uploading new cover: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      coverImageUrl = publicUrl;
    }

    const { error } = await supabase
      .from("albums")
      .update({
        title: editTitle,
        description: editDescription,
        cover_photo: coverImageUrl, // <-- Pinalitan ng cover_photo
      })
      .eq("id", id);

    setUpdating(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    setEditCoverImage(null);
    loadAlbums();
    alert("Album updated successfully!");
  }

  async function deleteAlbum(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("albums")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadAlbums();
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-5xl font-bold mb-8 text-slate-900 tracking-tight">
        Album Management
      </h1>

      {/* Add Form Area */}
      <form
        onSubmit={addAlbum}
        className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-slate-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Create Album
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            required
          />

          <textarea
            placeholder="Album Description (Optional, won't show on cards)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 min-h-[8rem] resize-y"
          />

          {/* Cover Image Upload Section */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm font-semibold text-slate-700">Album Cover Image (Optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer w-fit transition"
            />
          </div>

          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover Preview"
              className="w-48 h-48 object-cover rounded-xl border border-slate-200 mt-2 shadow-sm"
            />
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm"
          >
            {saving ? "Creating..." : "Create Album"}
          </button>
        </div>
      </form>

      {/* Records Display Container */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Albums
        </h2>

        <div className="space-y-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:border-slate-300"
            >
              {editingId === album.id ? (
                // --- EDIT MODE ---
                <div className="bg-slate-50 p-5 md:p-6 flex flex-col gap-4 border-b border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Edit Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Edit Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[6rem] resize-y"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Update Cover Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditCoverImage(e.target.files?.[0] || null)}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer border border-slate-300 rounded-xl"
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      {album.cover_photo && !editCoverImage && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 block mb-1">Current Cover:</span>
                          <img src={album.cover_photo} alt="Current Cover" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                        </div>
                      )}
                      {editCoverImage && (
                        <div>
                          <span className="text-xs font-bold text-amber-500 block mb-1">New Preview:</span>
                          <img src={URL.createObjectURL(editCoverImage)} alt="New Preview" className="w-24 h-24 object-cover rounded-lg border border-amber-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-2">
                    <button
                      onClick={() => updateAlbum(album.id, album.cover_photo)}
                      disabled={updating}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
                    >
                      <FaCheck /> {updating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditCoverImage(null);
                      }}
                      disabled={updating}
                      className="bg-slate-400 hover:bg-slate-500 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // --- NORMAL VIEW MODE ---
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {/* Cover Image Thumbnail (Left Side) */}
                  {album.cover_photo ? ( // <-- Pinalitan ng cover_photo
                    <img
                      src={album.cover_photo} // <-- Pinalitan ng cover_photo
                      alt={album.title}
                      className="w-full sm:w-40 sm:h-32 object-cover shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200"
                    />
                  ) : (
                    <div className="w-full sm:w-40 h-32 bg-slate-50 flex flex-col items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200 p-4 text-center">
                      <FaFolderOpen className="text-3xl text-slate-300 mb-2" />
                      <span className="text-xs text-slate-400 font-medium">No Cover</span>
                    </div>
                  )}

                  {/* Content & Actions Container */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl md:text-2xl text-slate-900 break-words leading-snug">
                        {album.title}
                      </h3>
                    </div>

                    {/* Icon Actions */}
                    <div className="flex gap-2 shrink-0 md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <Link
                        href={`/admin/albums/${album.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                        title="Open Album Content"
                      >
                        <FaFolderOpen className="text-base" />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingId(album.id);
                          setEditTitle(album.title);
                          setEditDescription(album.description || "");
                          setEditCoverImage(null);
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                        title="Edit Album Settings"
                      >
                        <FaEdit className="text-base" />
                      </button>

                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                        title="Delete Album"
                      >
                        <FaTrash className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {albums.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              No albums found. Create your first album above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}