"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AlbumsAdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [albums, setAlbums] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

    const { error } = await supabase
      .from("albums")
      .insert([
        {
          title,
          description,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");

    loadAlbums();

    alert("Album created successfully!");
  }

  async function updateAlbum(id) {
    const { error } = await supabase
      .from("albums")
      .update({
        title: editTitle,
        description: editDescription,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);

    loadAlbums();

    alert("Album updated successfully!");
  }

  async function deleteAlbum(id) {
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
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Album Management
      </h1>

      <form
        onSubmit={addAlbum}
        className="bg-white rounded-xl shadow p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Create Album
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />

          <textarea
            placeholder="Album Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-3 rounded-lg"
          >
            Create Album
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Albums
        </h2>

        <div className="space-y-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="border rounded-lg p-4"
            >
              {editingId === album.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    className="border p-2 rounded w-full mb-2"
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                    className="border p-2 rounded w-full mb-3"
                  />

                  <button
                    onClick={() =>
                      updateAlbum(album.id)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-2xl">
                    {album.title}
                  </h3>

                  <p className="text-slate-600">
                    {album.description}
                  </p>
                </>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin/albums/${album.id}`}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg"
                >
                  Open Album
                </Link>

                <button
                  onClick={() => {
                    setEditingId(album.id);
                    setEditTitle(album.title);
                    setEditDescription(
                      album.description || ""
                    );
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteAlbum(album.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}