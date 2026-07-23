"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
// Pinalitan ang icons para sa Save at Cancel
import { FaEdit, FaTrash, FaSave, FaTimesCircle, FaFolderOpen } from "react-icons/fa";

export default function DownloadFoldersPage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    const { data, error } = await supabase
      .from("download_folders")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setFolders(data || []);
  }

  // Helper to handle storage uploads
  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Gumamit na tayo ng "gallery" bucket imbes na "folders" para iwas "Bucket not found"
    const { error: uploadError } = await supabase.storage
      .from("gallery") 
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function addFolder(e) {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a cover picture for the folder!");
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadImage(imageFile);

      const { error } = await supabase
        .from("download_folders")
        .insert([
          {
            name,
            image: publicUrl, // Saves the cover image URL to the database
          },
        ]);

      if (error) throw error;

      setName("");
      setImageFile(null);
      // Reset the file input field layout
      e.target.reset();
      loadFolders();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveFolder(id, currentImageUrl) {
    setUploading(true);

    try {
      let publicUrl = currentImageUrl;

      // If a new image is selected during edit, upload it
      if (editImageFile) {
        publicUrl = await uploadImage(editImageFile);
      }

      const { error } = await supabase
        .from("download_folders")
        .update({
          name: editName,
          image: publicUrl,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      setEditName("");
      setEditImageFile(null);
      loadFolders();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function deleteFolder(id) {
    const { count } = await supabase
      .from("downloads")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("folder_id", id);

    if (count > 0) {
      alert("This folder contains files. Move or delete the files first.");
      return;
    }

    if (!confirm("Delete this folder?")) {
      return;
    }

    const { error } = await supabase
      .from("download_folders")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFolders();
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-5xl font-bold mb-8 text-slate-900 tracking-tight">
        Folder Management
      </h1>

      {/* Creation Form Area */}
      <form
        onSubmit={addFolder}
        className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-slate-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Create New Folder
        </h2>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="e.g., Learning Materials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
              required
            />
          </div>

          {/* Cover Image Upload Section */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm font-semibold text-slate-700">Folder Cover Banner:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer w-fit transition"
              required
            />
          </div>

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Cover Preview"
              className="w-48 h-48 object-cover rounded-xl border border-slate-200 mt-2 shadow-sm"
            />
          )}

          <button
            type="submit"
            disabled={uploading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm"
          >
            {uploading ? "Uploading Folder..." : "Add Folder"}
          </button>
        </div>
      </form>

      {/* Records Display Container */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Active Folders
        </h2>

        <div className="space-y-4">
          {folders.length === 0 ? (
            <p className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              No folders found. Create your first folder above.
            </p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:border-slate-300"
              >
                {editingId === folder.id ? (
                  // --- EDIT MODE ---
                  <div className="bg-slate-50 p-5 md:p-6 flex flex-col gap-4 border-b border-slate-200">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Edit Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Update Cover Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditImageFile(e.target.files[0] || null)}
                          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer border border-slate-300 rounded-xl"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        {folder.image && !editImageFile && (
                          <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">Current Cover:</span>
                            <img src={folder.image} alt="Current Cover" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                          </div>
                        )}
                        {editImageFile && (
                          <div>
                            <span className="text-xs font-bold text-amber-500 block mb-1">New Preview:</span>
                            <img src={URL.createObjectURL(editImageFile)} alt="New Preview" className="w-24 h-24 object-cover rounded-lg border border-amber-300" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-2">
                      <button
                        onClick={() => saveFolder(folder.id, folder.image)}
                        disabled={uploading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
                      >
                        <FaSave /> {uploading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditName("");
                          setEditImageFile(null);
                        }}
                        disabled={uploading}
                        className="bg-slate-400 hover:bg-slate-500 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- NORMAL VIEW MODE ---
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    {/* Cover Image Thumbnail */}
                    {folder.image ? (
                      <img
                        src={folder.image}
                        alt={folder.name}
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
                          {folder.name}
                        </h3>
                      </div>

                      {/* Icon Actions */}
                      <div className="flex gap-2 shrink-0 md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <button
                          onClick={() => {
                            setEditingId(folder.id);
                            setEditName(folder.name);
                            setEditImageFile(null);
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                          title="Edit Folder"
                        >
                          <FaEdit className="text-base" />
                        </button>

                        <button
                          onClick={() => deleteFolder(folder.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                          title="Delete Folder"
                        >
                          <FaTrash className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}