"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function DownloadsAdminPage() {
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const [file, setFile] = useState(null);

  const [downloads, setDownloads] = useState([]);
  const [folders, setFolders] = useState([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFolderId, setEditFolderId] = useState("");

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDownloads();
    loadFolders();
  }, []);

  async function loadFolders() {
    const { data } = await supabase
      .from("download_folders")
      .select("*")
      .order("name");

    setFolders(data || []);
  }

  async function loadDownloads() {
    const { data } = await supabase
      .from("downloads")
      .select(`
        *,
        download_folders (
          id,
          name
        )
      `)
      .order("id", {
        ascending: false,
      });

    setDownloads(data || []);
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

  async function uploadFile(e) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("downloads")
        .upload(fileName, file);

    if (uploadError) {
      setUploading(false);
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("downloads")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("downloads")
      .insert([
        {
          title,
          folder_id: folderId,
          file_url: publicUrl,
          file_size: file.size,
        },
      ]);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setFolderId("");
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    loadDownloads();
  }

  async function saveEdit(id) {
    const { error } = await supabase
      .from("downloads")
      .update({
        title: editTitle,
        folder_id: editFolderId,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    loadDownloads();
  }

  async function deleteDownload(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const filePath =
      item.file_url.split("/").pop();

    await supabase.storage
      .from("downloads")
      .remove([filePath]);

    await supabase
      .from("downloads")
      .delete()
      .eq("id", item.id);

    loadDownloads();
  }

  const filtered = downloads.filter((x) =>
    x.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const grouped = filtered.reduce(
    (acc, item) => {
      const folder =
        item.download_folders?.name ||
        "No Folder";

      if (!acc[folder]) {
        acc[folder] = [];
      }

      acc[folder].push(item);

      return acc;
    },
    {}
  );

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">
        Downloads Management
      </h1>

      <div className="bg-white p-8 rounded-xl shadow mb-8">
        <h2 className="text-3xl font-semibold mb-5">
          Upload File
        </h2>

        <form
          onSubmit={uploadFile}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            value={folderId}
            onChange={(e) =>
              setFolderId(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">
              Select Folder
            </option>

            {folders.map((folder) => (
              <option
                key={folder.id}
                value={folder.id}
              >
                {folder.name}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
            required
          />

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">
                  ⏳
                </span>
                Uploading...
              </span>
            ) : (
              "Upload File"
            )}
          </button>
        </form>
      </div>

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-8"
      />

      {Object.keys(grouped).map(
        (folderName) => (
          <div
            key={folderName}
            className="bg-white rounded-xl p-6 shadow mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">
              📁 {folderName}
            </h2>

            {grouped[folderName].map(
              (item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 mb-4"
                >
                  {editingId === item.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(
                            e.target.value
                          )
                        }
                        className="border p-2 rounded w-full mb-2"
                      />

                      <select
                        value={editFolderId}
                        onChange={(e) =>
                          setEditFolderId(
                            e.target.value
                          )
                        }
                        className="border p-2 rounded w-full mb-2"
                      >
                        {folders.map(
                          (folder) => (
                            <option
                              key={folder.id}
                              value={folder.id}
                            >
                              {folder.name}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        onClick={() =>
                          saveEdit(item.id)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          setEditingId(null)
                        }
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold">
                        {item.title}
                      </h3>

                      {item.file_size && (
                        <p className="text-sm text-gray-500 mt-1">
                          Size:{" "}
                          {formatFileSize(
                            item.file_size
                          )}
                        </p>
                      )}

                      <div className="flex gap-2 mt-3 flex-wrap">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          View
                        </a>

                        <a
                          href={item.file_url}
                          download
                          className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Download
                        </a>

                        <button
                          onClick={() => {
                            setEditingId(
                              item.id
                            );
                            setEditTitle(
                              item.title
                            );
                            setEditFolderId(
                              item.folder_id
                            );
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteDownload(
                              item
                            )
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        )
      )}
    </div>
  );
}