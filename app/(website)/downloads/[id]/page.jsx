"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  FaTimes,
  FaEye,
  FaPrint,
} from "react-icons/fa";

export default function FolderPage() {
  const params = useParams();

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] =
    useState(null);

  useEffect(() => {
    if (params?.id) {
      loadFolder();
    }
  }, [params]);

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

  async function incrementDownloadCount(
    fileId
  ) {
    const file = files.find(
      (f) => f.id === fileId
    );

    if (!file) return;

    await supabase
      .from("downloads")
      .update({
        download_count:
          (file.download_count || 0) + 1,
      })
      .eq("id", fileId);

    setFiles((prev) =>
      prev.map((item) =>
        item.id === fileId
          ? {
              ...item,
              download_count:
                (item.download_count || 0) + 1,
            }
          : item
      )
    );
  }

  function getFileExtension(url) {
    return (
      url?.split(".").pop()?.toLowerCase() ||
      ""
    );
  }

  function getFileIcon(url) {
    const ext = getFileExtension(url);

    switch (ext) {
      case "pdf":
        return (
          <FaFilePdf className="text-red-600 text-2xl" />
        );

      case "doc":
      case "docx":
        return (
          <FaFileWord className="text-blue-600 text-2xl" />
        );

      case "xls":
      case "xlsx":
        return (
          <FaFileExcel className="text-green-600 text-2xl" />
        );

      case "ppt":
      case "pptx":
        return (
          <FaFilePowerpoint className="text-orange-600 text-2xl" />
        );

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return (
          <FaFileImage className="text-purple-600 text-2xl" />
        );

      case "zip":
      case "rar":
      case "7z":
        return (
          <FaFileArchive className="text-yellow-600 text-2xl" />
        );

      default:
        return (
          <FaFileAlt className="text-gray-600 text-2xl" />
        );
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "";

    const sizes = [
      "B",
      "KB",
      "MB",
      "GB",
      "TB",
    ];

    const i = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes / Math.pow(1024, i)
    ).toFixed(1)} ${sizes[i]}`;
  }

  function canPreview(url) {
    const ext = getFileExtension(url);

    return [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ].includes(ext);
  }

  function handleView(file) {
    if (canPreview(file.file_url)) {
      setPreviewFile(file);
      return;
    }

    window.open(
      file.file_url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleDownload(file) {
    await incrementDownloadCount(file.id);

    const link =
      document.createElement("a");

    link.href = file.file_url;
    link.download = "";
    link.click();
  }

  function handlePrint() {
    window.print();
  }

  function getOfficeViewerUrl(url) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url
    )}`;
  }

  function getOneDriveViewerUrl(url) {
    return `https://onedrive.live.com/embed?resid=${encodeURIComponent(
      url
    )}`;
  }

  if (!folder) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <FaHome />
        <span>Home</span>

        <FaChevronRight />

        <span>Downloads</span>

        <FaChevronRight />

        <span>{folder.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <FaFolder className="text-5xl text-blue-600" />

        <h1 className="text-5xl font-bold">
          {folder.name}
        </h1>
      </div>

      {files.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow">
          No files available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-xl shadow border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {getFileIcon(file.file_url)}

                <div>
                  <h3 className="font-semibold text-lg">
                    {file.title}
                  </h3>

                  <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
                    {file.file_size && (
                      <span>
                        Size:{" "}
                        {formatFileSize(
                          file.file_size
                        )}
                      </span>
                    )}

                    {file.created_at && (
                      <span>
                        Uploaded{" "}
                        {new Date(
                          file.created_at
                        ).toLocaleDateString()}
                      </span>
                    )}

                    <span>
                      Downloads:{" "}
                      {file.download_count ||
                        0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {canPreview(
                  file.file_url
                ) && (
                  <button
                    onClick={() =>
                      setPreviewFile(file)
                    }
                    className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FaEye />
                    Preview
                  </button>
                )}

                <button
                  onClick={() =>
                    handleView(file)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    handleDownload(file)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">
                {previewFile.title}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
                >
                  <FaPrint />
                  Print
                </button>

                <button
                  onClick={() =>
                    setPreviewFile(null)
                  }
                  className="text-xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {["jpg", "jpeg", "png", "gif", "webp"].includes(
                getFileExtension(
                  previewFile.file_url
                )
              ) ? (
                <img
                  src={previewFile.file_url}
                  alt={previewFile.title}
                  className="w-full h-full object-contain"
                />
              ) : getFileExtension(
                  previewFile.file_url
                ) === "pdf" ? (
                <iframe
                  src={previewFile.file_url}
                  className="w-full h-full"
                  title={previewFile.title}
                />
              ) : [
                  "doc",
                  "docx",
                  "xls",
                  "xlsx",
                  "ppt",
                  "pptx",
                ].includes(
                  getFileExtension(
                    previewFile.file_url
                  )
                ) ? (
                <iframe
                  src={getOfficeViewerUrl(
                    previewFile.file_url
                  )}
                  className="w-full h-full"
                  title={previewFile.title}
                  onError={() =>
                    window.open(
                      getOneDriveViewerUrl(
                        previewFile.file_url
                      ),
                      "_blank"
                    )
                  }
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                  Preview is not available for this file format.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}