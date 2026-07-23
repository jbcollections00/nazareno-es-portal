"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaFolder,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFolder, setFilterFolder] = useState("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    // Fetch Folders
    const { data: folderData } = await supabase
      .from("download_folders")
      .select("*")
      .order("name", { ascending: true });

    if (folderData) setFolders(folderData);

    // Fetch Downloads
    const { data: downloadData } = await supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false });

    if (downloadData) setDownloads(downloadData);

    setLoading(false);
  }

  // Helper to resolve folder name for any file item
  function getFileFolderName(file) {
    if (file.folder_name) return file.folder_name;
    if (file.folder_id) {
      const matched = folders.find(
        (f) => String(f.id) === String(file.folder_id)
      );
      if (matched) return matched.name;
    }
    return null;
  }

  // File Upload / Save Handler
  async function handleSaveFile(e) {
    e.preventDefault();
    if (!title) return;

    setUploading(true);
    let fileUrl = editingItem ? editingItem.file_url : "";
    let fileSizeStr = editingItem ? editingItem.file_size : "";

    // Upload file to Supabase Storage if a new file is chosen
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("downloads")
        .upload(filePath, selectedFile);

      if (uploadError) {
        alert("File upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("downloads")
        .getPublicUrl(filePath);

      fileUrl = publicUrlData.publicUrl;
      fileSizeStr = formatBytes(selectedFile.size);
    }

    const matchedFolderObj = folders.find(
      (f) => String(f.id) === String(selectedFolderId) || f.name === selectedFolderId
    );

    const folderIdVal = matchedFolderObj ? matchedFolderObj.id : null;
    const folderNameVal = matchedFolderObj ? matchedFolderObj.name : null;

    if (editingItem) {
      // Update Record
      const { error } = await supabase
        .from("downloads")
        .update({
          title,
          folder_id: folderIdVal,
          folder_name: folderNameVal,
          ...(fileUrl && { file_url: fileUrl }),
          ...(fileSizeStr && { file_size: fileSizeStr }),
        })
        .eq("id", editingItem.id);

      if (error) {
        alert("Failed to update file: " + error.message);
      } else {
        resetForm();
        fetchData();
      }
    } else {
      // Insert Record
      const { error } = await supabase.from("downloads").insert([
        {
          title,
          folder_id: folderIdVal,
          folder_name: folderNameVal,
          file_url: fileUrl,
          file_size: fileSizeStr || "500 KB",
        },
      ]);

      if (error) {
        alert("Failed to save file: " + error.message);
      } else {
        resetForm();
        fetchData();
      }
    }

    setUploading(false);
  }

  function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function resetForm() {
    setTitle("");
    setSelectedFolderId("");
    setSelectedFile(null);
    setEditingItem(null);
  }

  function handleEditClick(item) {
    setEditingItem(item);
    setTitle(item.title || "");
    const resolvedFolderName = getFileFolderName(item);
    const matched = folders.find((f) => f.name === resolvedFolderName);
    setSelectedFolderId(matched ? matched.id : item.folder_id || "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    const { error } = await supabase.from("downloads").delete().eq("id", id);
    if (error) {
      alert("Failed to delete file: " + error.message);
    } else {
      fetchData();
    }
  }

  // Filter Logic
  const filteredDownloads = downloads.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const itemFolderName = getFileFolderName(item);
    const itemFolderId = item.folder_id;

    const matchesFolder =
      filterFolder === "ALL" ||
      String(itemFolderId) === String(filterFolder) ||
      itemFolderName === filterFolder;

    return matchesSearch && matchesFolder;
  });

  // Group filtered downloads by folder name
  const groupedDownloads = filteredDownloads.reduce((acc, item) => {
    const key = getFileFolderName(item) || "Unassigned Files";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl space-y-8 pb-12 px-4 lg:pr-8">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
        Downloads Management
      </h1>

      {/* Upload File Section Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {editingItem ? "Edit File" : "Upload File"}
        </h2>

        <form onSubmit={handleSaveFile} className="space-y-5">
          {/* Document Title */}
          <div>
            <input
              type="text"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Select Folder */}
          <div>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* Choose File + Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl border border-slate-300 transition text-sm">
                Choose File
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-slate-500 truncate max-w-[200px] md:max-w-xs">
                {selectedFile
                  ? selectedFile.name
                  : editingItem
                  ? "Keep current file"
                  : "No file chosen"}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {editingItem && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm disabled:opacity-50 w-full sm:w-auto whitespace-nowrap"
              >
                {uploading
                  ? "Uploading..."
                  : editingItem
                  ? "Update File"
                  : "Upload File"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search Bar + Folder Filter Dropdown */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full flex-1">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Folders</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Files List Display */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading files...</div>
      ) : Object.keys(groupedDownloads).length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          No files found.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDownloads).map(([folderName, files]) => (
            <div
              key={folderName}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 overflow-hidden"
            >
              {/* Folder Group Header */}
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-900 pb-2 border-b">
                <FaFolder className="text-amber-400 text-3xl shrink-0" />
                <span className="truncate">{folderName}</span>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white"
                  >
                    {/* Left Side: Document Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {file.title}
                      </h3>
                      {file.file_size && (
                        <p className="text-xs text-slate-400 mt-1">
                          Size: {file.file_size}
                        </p>
                      )}
                    </div>

                    {/* Right-Most Side: Action Icon Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                      {/* Preview / View Icon Button */}
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition flex items-center justify-center text-base"
                        title="Preview File"
                      >
                        <FaEye />
                      </a>

                      {/* Edit Icon Button */}
                      <button
                        onClick={() => handleEditClick(file)}
                        className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition flex items-center justify-center text-base"
                        title="Edit File"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Icon Button */}
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition flex items-center justify-center text-base"
                        title="Delete File"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}