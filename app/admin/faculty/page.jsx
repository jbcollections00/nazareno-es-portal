"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FacultyAdminPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState(null);

  const [faculty, setFaculty] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");

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

  async function addFaculty(e) {
    e.preventDefault();

    setSaving(true);

    let photoUrl = "";

    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("faculty")
          .upload(fileName, photo);

      if (uploadError) {
        setSaving(false);
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("faculty")
        .getPublicUrl(fileName);

      photoUrl = publicUrl;
    }

    const { error } = await supabase
      .from("faculty")
      .insert([
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

  async function updateFaculty(id) {
    const { error } = await supabase
      .from("faculty")
      .update({
        name: editName,
        position: editPosition,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);

    loadFaculty();

    alert("Faculty updated successfully!");
  }

  async function deleteFaculty(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("faculty")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFaculty();
  }

  const filteredFaculty = faculty.filter(
    (person) =>
      person.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      person.position
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">
        Faculty Management
      </h1>

      <form
        onSubmit={addFaculty}
        className="bg-white rounded-3xl shadow-lg p-8 mb-8"
      >
        <h2 className="text-3xl font-semibold mb-6">
          Add Faculty
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Faculty Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) =>
              setPosition(e.target.value)
            }
            className="border p-4 rounded-xl"
            required
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhoto(
              e.target.files?.[0] || null
            )
          }
          className="mt-4"
        />

        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border mt-4"
          />
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Faculty"}
        </button>
      </form>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-semibold">
            Faculty Records
          </h2>

          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-xl px-4 py-3 w-full md:w-80"
          />
        </div>

        <div className="space-y-5">
          {filteredFaculty.map((person) => (
            <div
              key={person.id}
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200" />
                  )}

                  <div>
                    {editingId === person.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) =>
                            setEditName(
                              e.target.value
                            )
                          }
                          className="border p-2 rounded block"
                        />

                        <input
                          type="text"
                          value={editPosition}
                          onChange={(e) =>
                            setEditPosition(
                              e.target.value
                            )
                          }
                          className="border p-2 rounded block"
                        />

                        <button
                          onClick={() =>
                            updateFaculty(
                              person.id
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold">
                          {person.name}
                        </h3>

                        <p className="text-slate-600">
                          {person.position}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(person.id);
                      setEditName(
                        person.name
                      );
                      setEditPosition(
                        person.position
                      );
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteFaculty(
                        person.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredFaculty.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No faculty records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}