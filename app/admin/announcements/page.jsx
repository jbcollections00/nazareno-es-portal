"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaBullhorn,
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaSpinner,
  FaImage,
  FaUpload,
  FaTimes,
} from "react-icons/fa";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Editing state (null = Create mode, ID = Edit mode)
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("General");

  // Image Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("event_date", { ascending: true });

    if (!error && data) setAnnouncements(data);
    setLoading(false);
  }

  // Handle Local Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open Modal for Creating
  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open Modal for Editing
  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setContent(item.content || "");
    setEventDate(item.event_date || "");
    setCategory(item.category || "General");
    setExistingImageUrl(item.image_url || "");
    setImagePreview(item.image_url || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setEventDate("");
    setCategory("General");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    let finalImageUrl = existingImageUrl;

    try {
      // 1. Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `posters/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("announcements")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("announcements")
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      const announcementPayload = {
        title,
        content,
        event_date: eventDate,
        category,
        image_url: finalImageUrl,
      };

      if (editingId) {
        // UPDATE existing announcement
        const { error: updateError } = await supabase
          .from("announcements")
          .update(announcementPayload)
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        // INSERT new announcement
        const { error: insertError } = await supabase
          .from("announcements")
          .insert([announcementPayload]);

        if (insertError) throw insertError;
      }

      setIsModalOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      alert("Error saving announcement: " + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (!error) {
        fetchAnnouncements();
      } else {
        alert("Error deleting announcement: " + error.message);
      }
    }
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 md:p-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
          <FaBullhorn className="text-amber-500" /> Announcements Management
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all duration-200"
        >
          <FaPlus /> New Announcement
        </button>
      </div>

      {/* Announcements Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-amber-500" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 text-slate-500">
          No announcements created yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-600 text-xs uppercase font-bold tracking-wider">
                <th className="p-5">Poster</th>
                <th className="p-5">Title</th>
                <th className="p-5">Tag</th>
                <th className="p-5">Event Date</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {announcements.map((item) => {
                const isExpired = item.event_date < todayStr;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border flex items-center justify-center shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaImage className="text-slate-400 text-xl" />
                        )}
                      </div>
                    </td>

                    <td className="p-5 font-bold text-slate-800">{item.title}</td>

                    <td className="p-5">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-5 font-mono text-slate-600">{item.event_date}</td>

                    <td className="p-5">
                      {isExpired ? (
                        <span className="text-slate-400 font-semibold">Expired</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Active</span>
                      )}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="text-amber-600 hover:bg-amber-50 p-2.5 rounded-xl transition-colors"
                          title="Edit Announcement"
                        >
                          <FaPencilAlt />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors"
                          title="Delete Announcement"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Popup (With Proper Screen Padding & Scroll) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-auto overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Announcement" : "Create New Announcement"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Announcement Poster / Image
                </label>
                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors relative">
                  {imagePreview ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setExistingImageUrl("");
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 text-xs shadow-md"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full py-4">
                      <FaUpload className="text-3xl text-amber-500 mb-2" />
                      <span className="text-sm font-semibold text-slate-700">
                        Click to upload poster image
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        PNG, JPG, or WEBP up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., BUWANANG KUMUNALIS 2026"
                />
              </div>

              {/* Category & Event Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Tag / Category
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Last Display Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Announcement Content */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Announcement Content
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Details regarding time, venue, or guidelines..."
                />
              </div>

              {/* Submit Buttons Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-100 rounded-xl font-medium text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  {editingId ? "Update Announcement" : "Publish Announcement"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}