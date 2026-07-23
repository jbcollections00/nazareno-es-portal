"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";

export default function NewsAdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [albumId, setAlbumId] = useState("");
  const [news, setNews] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editAlbumId, setEditAlbumId] = useState(""); 
  
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  // References for our textareas to auto-resize them
  const addContentRef = useRef(null);
  const editContentRef = useRef(null);

  useEffect(() => {
    loadNews();
    loadAlbums();
  }, []);

  // Auto-resize effect for Add News Content
  useEffect(() => {
    if (addContentRef.current) {
      addContentRef.current.style.height = "auto";
      addContentRef.current.style.height = addContentRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Auto-resize effect for Edit News Content
  useEffect(() => {
    if (editContentRef.current) {
      editContentRef.current.style.height = "auto";
      editContentRef.current.style.height = editContentRef.current.scrollHeight + "px";
    }
  }, [editContent, editingId]); // Runs when editContent changes, or when entering edit mode

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("id", { ascending: false });

    setNews(data || []);
  }

  async function loadAlbums() {
    const { data, error } = await supabase
      .from("albums")
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
          album_id: albumId || null,
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
    setAlbumId("");

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
      album_id: editAlbumId || null,
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

  const currentEditItem = news.find((item) => item.id === editingId);

  return (
    <div className="max-w-7xl mx-auto">
      {editingId && currentEditItem ? (
        // ==========================================
        // FULL PAGE EDIT VIEW
        // ==========================================
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-slate-200 min-h-[80vh] flex flex-col">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <button
              onClick={() => {
                setEditingId(null);
                setEditImage(null);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-full transition"
              title="Back to List"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Edit News Article
            </h1>
          </div>

          <div className="flex-1 space-y-6 max-w-4xl">
            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-2">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-2">Content</label>
              {/* Added ref, overflow-hidden, and removed fixed height to allow auto-resizing */}
              <textarea
                ref={editContentRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-slate-300 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base leading-relaxed text-slate-800 overflow-hidden resize-none"
                style={{ minHeight: "18rem" }}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-2">Link to Album/Gallery (Optional)</label>
              <select
                value={editAlbumId}
                onChange={(e) => setEditAlbumId(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
              >
                <option value="">-- None --</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Upload New Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="text-sm text-slate-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition cursor-pointer border border-slate-200 rounded-xl w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {currentEditItem.image && !editImage && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-2">CURRENT IMAGE:</span>
                    <img src={currentEditItem.image} alt="Current" className="w-56 h-36 object-cover rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                )}
                {editImage && (
                  <div>
                    <span className="text-xs font-bold text-amber-500 block mb-2">NEW PREVIEW:</span>
                    <img src={URL.createObjectURL(editImage)} alt="Preview" className="w-56 h-36 object-cover rounded-xl border border-amber-300 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8 border-t border-slate-200 mt-10">
            <button
              onClick={() => updateNews(currentEditItem.id)}
              disabled={updating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg disabled:opacity-50 min-w-[200px]"
            >
              <FaCheck /> {updating ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setEditImage(null);
              }}
              disabled={updating}
              className="bg-slate-400 hover:bg-slate-500 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        // ==========================================
        // NORMAL VIEW (ADD FORM + LIST OF RECORDS)
        // ==========================================
        <>
          <h1 className="text-5xl font-bold mb-8 text-slate-900 tracking-tight">
            News Management
          </h1>

          {/* Add Form Area */}
          <form onSubmit={addNews} className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Add News
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="News Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                required
              />

              {/* Added ref, overflow-hidden, and removed fixed height to allow auto-resizing */}
              <textarea
                ref={addContentRef}
                placeholder="News Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 overflow-hidden resize-none"
                style={{ minHeight: "12rem" }}
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Link to Album/Gallery (optional):</label>
                <select
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="w-full border border-slate-300 px-4 py-3.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  <option value="">-- Select an Album --</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="text-sm font-semibold text-slate-700">Cover Image (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer w-fit transition"
                />
              </div>

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-64 h-40 object-cover rounded-xl border border-slate-200 mt-2 shadow-sm"
                />
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save News"}
              </button>
            </div>
          </form>

          {/* Records Display Container */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                News Records
              </h2>

              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-300 rounded-xl px-5 py-3.5 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="space-y-4">
              {filteredNews.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:border-slate-300">
                  
                  {/* NORMAL CARD LAYOUT */}
                  <div className="flex flex-col sm:flex-row sm:items-stretch">
                    {/* Picture */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full sm:w-48 h-48 sm:h-auto min-h-[8rem] object-cover shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200"
                      />
                    ) : (
                      <div className="w-full sm:w-48 h-48 sm:h-auto min-h-[8rem] bg-slate-100 flex items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200">
                        <span className="text-xs text-slate-400 font-medium">No Image</span>
                      </div>
                    )}

                    {/* Content & Actions Container */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 min-w-0 gap-4">
                      
                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 break-words leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {/* Icon Actions */}
                      <div className="flex gap-2 shrink-0 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditTitle(item.title);
                            setEditContent(item.content);
                            setEditAlbumId(item.album_id || "");
                            setEditImage(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                          title="Edit News"
                        >
                          <FaEdit className="text-base" />
                        </button>

                        <button
                          onClick={() => deleteNews(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition flex items-center justify-center shadow-sm"
                          title="Delete News"
                        >
                          <FaTrash className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}

              {filteredNews.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  No news records found matching your search.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}