"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

    const { error: uploadError } = await supabase.storage
      .from("folders") // Change this to your public bucket name
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("folders").getPublicUrl(filePath);
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
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Folder Management</h1>

      {/* Creation Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
        <form onSubmit={addFolder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
            <input
              type="text"
              placeholder="e.g., Learning Materials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Folder Cover Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border p-2 rounded-lg bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400 transition"
          >
            {uploading ? "Uploading Folder..." : "Add Folder"}
          </button>
        </form>
      </div>

      {/* Existing Folders List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Active Folders</h2>
        {folders.length === 0 ? (
          <p className="text-slate-500">No folders found.</p>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              className="border rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {editingId === folder.id ? (
                <div className="flex flex-col gap-3 w-full">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                    placeholder="Edit folder name"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">Change cover image (optional):</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditImageFile(e.target.files[0])}
                      className="border p-2 rounded-lg text-sm"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => saveFolder(folder.id, folder.image)}
                      disabled={uploading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:bg-slate-400"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditName("");
                        setEditImageFile(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    {folder.image && (
                      <img
                        src={folder.image}
                        alt=""
                        className="w-16 h-12 object-cover rounded-md bg-slate-100 border shadow-sm"
                      />
                    )}
                    <div className="font-bold text-slate-800 text-lg">
                      {folder.name}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingId(folder.id);
                        setEditName(folder.name);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteFolder(folder.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}