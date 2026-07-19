"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsAdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [albumId, setAlbumId] = useState(""); // NEW: Tracks the selected album for new posts
  const [news, setNews] = useState([]);
  const [albums, setAlbums] = useState([]); // NEW: Stores list of available albums
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editAlbumId, setEditAlbumId] = useState(""); // NEW: Tracks selected album while editing
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadNews();
    loadAlbums(); // NEW: Fetch albums when page loads
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("id", { ascending: false });

    setNews(data || []);
  }

  // NEW: Fetches albums from your gallery/albums table
  async function loadAlbums() {
    const { data, error } = await supabase
      .from("albums") // Matches your sidebar "Albums" section table name
      .select("id, title")
      .order("title", { ascending: true });

    if (!error && data) {
      setAlbums(data);
    }
  }

  async function addNews(e) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("news")
        .upload(fileName, image);

      if (uploadError) {
        setSaving(false);
        alert(uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("news")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from("news")
      .insert([
        {
          title,
          content,
          image: imageUrl,
          album_id: albumId || null, // NEW: Saves the connected album ID to the database
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setContent("");
    setImage(null);
    setAlbumId(""); // Reset selector

    loadNews();
    alert("News saved successfully!");
  }

  async function updateNews(id) {
    setUpdating(true);
    let imageUrl;

    if (editImage) {
      const fileName = `${Date.now()}-${editImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("news")
        .upload(fileName, editImage);

      if (uploadError) {
        setUpdating(false);
        alert(uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("news")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const updateData = {
      title: editTitle,
      content: editContent,
      album_id: editAlbumId || null, // NEW: Updates the linked album
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const { error } = await supabase
      .from("news")
      .update(updateData)
      .eq("id", id);

    setUpdating(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    setEditImage(null);
    setEditAlbumId("");

    loadNews();
    alert("News updated successfully!");
  }

  async function deleteNews(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this news article?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadNews();
  }

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-bold mb-8 text-slate-900">
        News Management
      </h1>

      {/* Add Form Area */}
      <form onSubmit={addNews} className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-slate-100">
        <h2 className="text-3xl font-semibold mb-6 text-slate-800">
          Add News
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="News Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 p-4 rounded-xl focus:outline-blue-500"
            required
          />

          <textarea
            placeholder="News Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-slate-200 p-4 rounded-xl h-48 focus:outline-blue-500"
            required
          />

          {/* NEW: Attach Album Selector Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Link to Album/Gallery (optional):</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-xl bg-white focus:outline-blue-500"
            >
              <option value="">-- Select an Album --</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Cover Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-64 h-40 object-cover rounded-xl border mt-2"
            />
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 hover:bg-blue-950 transition-colors shadow-sm"
          >
            {saving ? "Saving..." : "Save News"}
          </button>
        </div>
      </form>

      {/* Records Display Container */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-semibold text-slate-800">
            News Records
          </h2>

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-3 w-full md:w-80 focus:outline-blue-500"
          />
        </div>

        <div className="space-y-6">
          {filteredNews.map((item) => (
            <div key={item.id} className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between">
              <div className="flex flex-col md:flex-row gap-6">
                {item.image && !editingId && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full md:w-56 h-40 object-cover rounded-xl border border-slate-100"
                  />
                )}

                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border border-slate-200 p-3 rounded-xl w-full mt-1 bg-white focus:outline-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit Content</label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="border border-slate-200 p-3 rounded-xl w-full h-32 mt-1 bg-white focus:outline-blue-500"
                        />
                      </div>

                      {/* NEW: Attach Album Selector Dropdown inside Edit Mode */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link to Album/Gallery</label>
                        <select
                          value={editAlbumId}
                          onChange={(e) => setEditAlbumId(e.target.value)}
                          className="border border-slate-200 p-3 rounded-xl w-full mt-1 bg-white focus:outline-blue-500 text-sm"
                        >
                          <option value="">-- None --</option>
                          {albums.map((album) => (
                            <option key={album.id} value={album.id}>
                              {album.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Change cover image (optional):</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                          className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        {item.image && !editImage && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">CURRENT IMAGE:</span>
                            <img src={item.image} alt="Current" className="w-40 h-28 object-cover rounded-xl border" />
                          </div>
                        )}
                        {editImage && (
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 block mb-1">NEW PREVIEW:</span>
                            <img src={URL.createObjectURL(editImage)} alt="Preview" className="w-40 h-28 object-cover rounded-xl border border-amber-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateNews(item.id)}
                          disabled={updating}
                          className="bg-green-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {updating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-400 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      {item.created_at && (
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      )}

                      {/* Visual indicator showing which album is linked */}
                      {item.album_id && (
                        <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
                          📸 Linked to Album ID: {item.album_id}
                        </span>
                      )}

                      <p className="text-slate-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!editingId && (
                <div className="flex gap-2 mt-6 justify-end border-t border-slate-50 pt-4">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditTitle(item.title);
                      setEditContent(item.content);
                      setEditAlbumId(item.album_id || ""); // Pass current album relation into edit block
                      setEditImage(null);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 font-semibold text-white px-5 py-2 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNews(item.id)}
                    className="bg-red-600 hover:bg-red-700 font-semibold text-white px-5 py-2 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed">
              No news records found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}