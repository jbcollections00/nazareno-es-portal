"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function FacultyAdminPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState(null);

  const [faculty, setFaculty] = useState([]);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editPhoto, setEditPhoto] = useState(null); // Added state for new photo during edit

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  async function loadFaculty() {
    const { data } = await supabase
      .from("faculty")
      .select("*")
      .order("id", { ascending: false });

    setFaculty(data || []);
  }

  // --- ADD FACULTY ---
  async function addFaculty(e) {
    e.preventDefault();
    setSaving(true);

    let photoUrl = "";

    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("faculty")
        .upload(fileName, photo);

      if (uploadError) {
        setSaving(false);
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("faculty").getPublicUrl(fileName);

      photoUrl = publicUrl;
    }

    const { error } = await supabase.from("faculty").insert([
      {
        name,
        position,
        photo: photoUrl,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPosition("");
    setPhoto(null);

    loadFaculty();
    alert("Faculty saved successfully!");
  }

  // --- UPDATE FACULTY ---
  async function updateFaculty(person) {
    setSaving(true);

    let updatedPhotoUrl = person.photo; // Keep existing photo by default

    // If a new photo is selected during edit, upload it
    if (editPhoto) {
      const fileExt = editPhoto.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
        
      const { error: uploadError } = await supabase.storage
        .from("faculty")
        .upload(fileName, editPhoto);

      if (uploadError) {
        alert("Photo upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("faculty").getPublicUrl(fileName);

      updatedPhotoUrl = publicUrl;
    }

    // Update database record
    const { error } = await supabase
      .from("faculty")
      .update({
        name: editName,
        position: editPosition,
        photo: updatedPhotoUrl,
      })
      .eq("id", person.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    setEditPhoto(null);
    loadFaculty();
    alert("Faculty updated successfully!");
  }

  // --- DELETE FACULTY ---
  async function deleteFaculty(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("faculty").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFaculty();
  }

  const filteredFaculty = faculty.filter(
    (person) =>
      person.name?.toLowerCase().includes(search.toLowerCase()) ||
      person.position?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 text-slate-900 tracking-tight">
        Faculty Management
      </h1>

      {/* ADD FACULTY FORM */}
      <form
        onSubmit={addFaculty}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Add Faculty</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Faculty Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl border border-slate-300 transition text-sm w-fit">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border shadow-sm"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Faculty"}
        </button>
      </form>

      {/* FACULTY RECORDS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Faculty Records</h2>

          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
          />
        </div>

        <div className="space-y-4">
          {filteredFaculty.map((person) => (
            <div
              key={person.id}
              className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 bg-white transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-5 w-full">
                  {/* Show preview of newly selected image if editing, else show database photo */}
                  {person.photo || (editingId === person.id && editPhoto) ? (
                    <img
                      src={
                        editingId === person.id && editPhoto
                          ? URL.createObjectURL(editPhoto)
                          : person.photo
                      }
                      alt={person.name}
                      className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    {editingId === person.id ? (
                      <>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-slate-300 px-3 py-2 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            placeholder="Name"
                          />

                          <input
                            type="text"
                            value={editPosition}
                            onChange={(e) => setEditPosition(e.target.value)}
                            className="border border-slate-300 px-3 py-2 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            placeholder="Position"
                          />
                        </div>

                        {/* Edit Photo Input */}
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition text-xs">
                            Choose New Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditPhoto(e.target.files?.[0] || null)
                              }
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-xs">
                            {editPhoto
                              ? editPhoto.name
                              : "No new photo chosen"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-slate-900 truncate">
                          {person.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {person.position}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {editingId === person.id ? (
                    <>
                      {/* Save Changes Button */}
                      <button
                        onClick={() => updateFaculty(person)}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition flex items-center justify-center text-base disabled:opacity-50"
                        title="Save Changes"
                      >
                        <FaCheck />
                      </button>

                      {/* Cancel Edit Button */}
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditPhoto(null);
                        }}
                        disabled={saving}
                        className="bg-slate-400 hover:bg-slate-500 text-white p-3 rounded-xl transition flex items-center justify-center text-base disabled:opacity-50"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingId(person.id);
                          setEditName(person.name);
                          setEditPosition(person.position);
                          setEditPhoto(null);
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition flex items-center justify-center text-base"
                        title="Edit Faculty"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteFaculty(person.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition flex items-center justify-center text-base"
                        title="Delete Faculty"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredFaculty.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No faculty records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}