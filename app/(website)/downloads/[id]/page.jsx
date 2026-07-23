"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileArchive,
  FaFileAlt,
  FaDownload,
  FaFolder,
  FaHome,
  FaChevronRight,
  FaSearch,
  FaEye,
  FaLayerGroup,
} from "react-icons/fa";

export default function FolderPage() {
  const params = useParams();
  const router = useRouter();

  const [folder, setFolder] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAllFolders();
    if (params?.id) {
      loadFolder();
    }
  }, [params]);

  async function loadAllFolders() {
    const { data } = await supabase
      .from("download_folders")
      .select("*")
      .order("name");
    setAllFolders(data || []);
  }

  async function loadFolder() {
    const { data: folderData } = await supabase
      .from("download_folders")
      .select("*")
      .eq("id", params.id)
      .single();

    const { data: fileData } = await supabase
      .from("downloads")
      .select("*")
      .eq("folder_id", params.id)
      .order("title");

    setFolder(folderData);
    setFiles(fileData || []);
  }

  function handleFolderChange(e) {
    const newFolderId = e.target.value;
    if (newFolderId) {
      router.push(`/downloads/${newFolderId}`);
    }
  }

  async function incrementDownloadCount(fileId) {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    await supabase
      .from("downloads")
      .update({
        download_count: (file.download_count || 0) + 1,
      })
      .eq("id", fileId);

    setFiles((prev) =>
      prev.map((item) =>
        item.id === fileId
          ? { ...item, download_count: (item.download_count || 0) + 1 }
          : item
      )
    );
  }

  function getFileExtension(url) {
    return url?.split(".").pop()?.toLowerCase() || "";
  }

  // Colorful Gradient Icons & Badges
  function getFileIcon(url) {
    const ext = getFileExtension(url);

    switch (ext) {
      case "pdf":
        return (
          <div className="p-3.5 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl shadow-md shadow-red-200 shrink-0">
            <FaFilePdf className="text-2xl" />
          </div>
        );
      case "doc":
      case "docx":
        return (
          <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-200 shrink-0">
            <FaFileWord className="text-2xl" />
          </div>
        );
      case "xls":
      case "xlsx":
        return (
          <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-2xl shadow-md shadow-emerald-200 shrink-0">
            <FaFileExcel className="text-2xl" />
          </div>
        );
      case "ppt":
      case "pptx":
        return (
          <div className="p-3.5 bg-gradient-to-br from-orange-400 to-amber-600 text-white rounded-2xl shadow-md shadow-orange-200 shrink-0">
            <FaFilePowerpoint className="text-2xl" />
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return (
          <div className="p-3.5 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-md shadow-purple-200 shrink-0">
            <FaFileImage className="text-2xl" />
          </div>
        );
      case "zip":
      case "rar":
      case "7z":
        return (
          <div className="p-3.5 bg-gradient-to-br from-amber-400 to-yellow-600 text-white rounded-2xl shadow-md shadow-yellow-200 shrink-0">
            <FaFileArchive className="text-2xl" />
          </div>
        );
      default:
        return (
          <div className="p-3.5 bg-gradient-to-br from-gray-400 to-slate-600 text-white rounded-2xl shadow-md shadow-gray-200 shrink-0">
            <FaFileAlt className="text-2xl" />
          </div>
        );
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  function handleView(file) {
    const ext = getFileExtension(file.file_url);
    const officeExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (officeExtensions.includes(ext)) {
      const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        file.file_url
      )}`;
      window.open(viewerUrl, "_blank", "noopener,noreferrer");
    } else {
      window.open(file.file_url, "_blank", "noopener,noreferrer");
    }
  }

  async function handleDownload(file) {
    await incrementDownloadCount(file.id);
    const link = document.createElement("a");
    link.href = file.file_url;
    link.download = "";
    link.click();
  }

  const filteredFiles = files.filter((file) =>
    file.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!folder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-semibold text-lg">
          Loading materials...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500 font-medium">
          <FaHome className="text-indigo-500" />
          <span>Home</span>
          <FaChevronRight className="text-xs text-slate-300" />
          <span>Downloads</span>
          <FaChevronRight className="text-xs text-slate-300" />
          <span className="text-slate-900 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            {folder.name}
          </span>
        </div>

        {/* Header & Controls Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Folder Title with Gradient Effect */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <FaFolder className="text-3xl" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Folder Category
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {folder.name}
              </h1>
            </div>
          </div>

          {/* Controls: Folder Select & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Folder Dropdown */}
            <div className="relative w-full sm:w-52">
              <FaLayerGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select
                value={params?.id || ""}
                onChange={handleFolderChange}
                className="w-full pl-9 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer appearance-none"
              >
                {allFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Elegant Search Bar */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Files Grid Section */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            {searchTerm ? "No files matched your search term." : "No files available in this folder."}
          </div>
        ) : (
          /* 2-Column Grid with Floating Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-200 transition duration-300 flex flex-col justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {getFileIcon(file.file_url)}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition truncate">
                      {file.title}
                    </h3>

                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1 mt-2 font-medium">
                      {file.file_size && (
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                          {formatFileSize(file.file_size)}
                        </span>
                      )}
                      {file.created_at && (
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      )}
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full">
                        {file.download_count || 0} Downloads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Elegant Gradient Action Buttons */}
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleView(file)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
                  >
                    <FaEye className="text-xs text-slate-500" />
                    View
                  </button>

                  <button
                    onClick={() => handleDownload(file)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-200 transition"
                  >
                    <FaDownload className="text-xs" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}