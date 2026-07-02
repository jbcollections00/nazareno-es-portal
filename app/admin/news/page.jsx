
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsAdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("id", { ascending: false });

    setNews(data || []);
  }

  async function addNews(e) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("news")
          .upload(fileName, image);

      if (uploadError) {
        setSaving(false);
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
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

    loadNews();

    alert("News saved successfully!");
  }

  async function updateNews(id) {
    let imageUrl;

    if (editImage) {
      const fileName = `${Date.now()}-${editImage.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("news")
          .upload(fileName, editImage);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("news")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const updateData = {
      title: editTitle,
      content: editContent,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const { error } = await supabase
      .from("news")
      .update(updateData)
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    setEditImage(null);

    loadNews();

    alert("News updated successfully!");
  }

  async function deleteNews(id) {
    const confirmDelete =
      window.confirm(
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
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.content
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">
        News Management
      </h1>

      <form
        onSubmit={addNews}
        className="bg-white rounded-3xl shadow-lg p-8 mb-8"
      >
        <h2 className="text-3xl font-semibold mb-6">
          Add News
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="News Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <textarea
            placeholder="News Content"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            className="w-full border p-4 rounded-xl h-48"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files?.[0] || null
              )
            }
          />

          {image && (
            <img
              src={URL.createObjectURL(
                image
              )}
              alt="Preview"
              className="w-64 rounded-xl border"
            />
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-900 text-white px-8 py-3 rounded-xl disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save News"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-semibold">
            News Records
          </h2>

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-xl px-4 py-3 w-full md:w-80"
          />
        </div>

        <div className="space-y-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full md:w-56 h-40 object-cover rounded-xl"
                  />
                )}

                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-lg w-full"
                      />

                      <textarea
                        value={editContent}
                        onChange={(e) =>
                          setEditContent(
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-lg w-full h-32"
                      />

                      {item.image && (
                        <img
                          src={item.image}
                          alt="Current"
                          className="w-56 h-40 object-cover rounded-lg border"
                        />
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditImage(
                            e.target.files?.[0] ||
                              null
                          )
                        }
                      />

                      {editImage && (
                        <img
                          src={URL.createObjectURL(
                            editImage
                          )}
                          alt="Preview"
                          className="w-56 h-40 object-cover rounded-lg border"
                        />
                      )}

                      <button
                        onClick={() =>
                          updateNews(item.id)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold">
                        {item.title}
                      </h3>

                      {item.created_at && (
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString()}
                        </p>
                      )}

                      <p className="text-slate-600 mt-3 whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditTitle(item.title);
                    setEditContent(
                      item.content
                    );
                    setEditImage(null);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteNews(item.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No news records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
