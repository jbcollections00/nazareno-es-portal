"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DownloadFoldersPage() {
  const [name, setName] = useState("");
  const [folders, setFolders] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

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

  async function addFolder(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("download_folders")
      .insert([
        {
          name,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    loadFolders();
  }

  async function saveFolder(id) {
    const { error } = await supabase
      .from("download_folders")
      .update({
        name: editName,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    setEditName("");

    loadFolders();
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
      alert(
        "This folder contains files. Move or delete the files first."
      );
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
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">
        Folder Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <form
          onSubmit={addFolder}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Folder Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Add Folder
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {folders.length === 0 ? (
          <p>No folders found.</p>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              className="border rounded-lg p-4 mb-3 flex items-center justify-between"
            >
              {editingId === folder.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value
                      )
                    }
                    className="border p-2 rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        saveFolder(folder.id)
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditName("");
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    📁 {folder.name}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(folder.id);
                        setEditName(folder.name);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteFolder(folder.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
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