"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaPlus, FaTrash, FaPencilAlt, FaRocket, FaSpinner, FaCloudUploadAlt, FaLink } from "react-icons/fa";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [galleryAlbums, setGalleryAlbums] = useState([]); // Dynamic list of gallery folders
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form input states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Seeking Support");
  const [target, setTarget] = useState("");
  const [progress, setProgress] = useState(0);
  const [supportInput, setSupportInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [documentationLink, setDocumentationLink] = useState(""); // Tracks selected album path
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Custom Section & Order States
  const [sectionType, setSectionType] = useState("future");
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
    fetchProjects();
    fetchGalleryAlbums(); // Pull school gallery albums automatically on mount
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("section_type", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error && data) setProjects(data);
    setLoading(false);
  }

  // AUTOMATIC GALLERY FETCH LOGIC
  async function fetchGalleryAlbums() {
    try {
      // Looks for a table named 'galleries' or 'albums'
      const { data, error } = await supabase
        .from("galleries")
        .select("id, title")
        .order("title", { ascending: true });

      if (!error && data) {
        setGalleryAlbums(data);
      } else {
        // Fallback option in case table is singular or named 'albums'
        const { data: fallbackData } = await supabase
          .from("albums")
          .select("id, title")
          .order("title", { ascending: true });
        if (fallbackData) setGalleryAlbums(fallbackData);
      }
    } catch (err) {
      console.warn("Could not load gallery albums dynamically:", err);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      alert("Error uploading image: " + error.message + "\n\nTip: Make sure you created a public storage bucket named 'project-images' in your Supabase Dashboard.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const needed_support = supportInput.split("\n").map(i => i.trim()).filter(i => i !== "");

    const payload = {
      title,
      description,
      status,
      target,
      progress: parseInt(progress) || 0,
      needed_support,
      section_type: sectionType,
      sort_order: parseInt(sortOrder) || 1,
      image_url: imageUrl,
      documentation_link: documentationLink // Saves selected Album path to DB
    };

    let error;
    if (editingId) {
      const response = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);
      error = response.error;
    } else {
      const response = await supabase
        .from("projects")
        .insert([payload]);
      error = response.error;
    }

    if (!error) {
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } else {
      alert("Error saving project: " + error.message);
    }
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setStatus(project.status || "Seeking Support");
    setTarget(project.target || "");
    setProgress(project.progress || 0);
    setSupportInput(project.needed_support ? project.needed_support.join("\n") : "");
    setSectionType(project.section_type || "future");
    setSortOrder(project.sort_order || 1);
    setImageUrl(project.image_url || "");
    setDocumentationLink(project.documentation_link || ""); // Load from saved column
    setIsModalOpen(true);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) fetchProjects();
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Seeking Support");
    setTarget("");
    setProgress(0);
    setSupportInput("");
    setSectionType("future");
    setSortOrder(1);
    setImageUrl("");
    setDocumentationLink("");
  }

  const getSectionLabel = (type) => {
    if (type === "real") return "Project REAL 3.0";
    if (type === "hope") return "Journey of HOPE";
    return "Into the Future";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold text-slate-900 flex items-center gap-4">
          <FaRocket className="text-blue-600" /> Control Board
        </h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:bg-blue-700 transition"
        >
          <FaPlus /> Add New Entry
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-600 text-sm font-semibold">
                <th className="p-5">Placement Section</th>
                <th className="p-5">Order</th>
                <th className="p-5">Title</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-5 font-bold text-blue-900">{getSectionLabel(p.section_type)}</td>
                  <td className="p-5 font-mono">Position #{p.sort_order}</td>
                  <td className="p-5 font-semibold text-slate-700">{p.title}</td>
                  <td className="p-5">{p.status}</td>
                  <td className="p-5 text-center flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(p)} 
                      className="text-blue-600 hover:bg-blue-50 p-2.5 rounded-xl transition"
                      title="Edit Entry"
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition"
                      title="Delete Entry"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Project Placement" : "Configure Project Placement"}
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Section Location</label>
                  <select className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={sectionType} onChange={e => setSectionType(e.target.value)}>
                    <option value="future">Into the Future</option>
                    <option value="real">Project REAL 3.0</option>
                    <option value="hope">Journey of HOPE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Display Sequence Order</label>
                  <input type="number" min="1" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Project Title</label>
                <input required type="text" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {/* REPLACED WITH DYNAMIC SELECT DROPDOWN */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                  <FaLink className="text-slate-500" /> Documentation / Album Gallery Link
                </label>
                <select
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 font-medium"
                  value={documentationLink}
                  onChange={(e) => setDocumentationLink(e.target.value)}
                >
                  <option value="">-- Choose School Gallery Album --</option>
                  {galleryAlbums.map((album) => (
                    // Constructs a structural routing endpoint based on the selected album ID
                    <option key={album.id} value={`/gallery/${album.id}`}>
                      📸 {album.title}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Select which active gallery folder represents the documentation of this project.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Status</label>
                <select className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Seeking Support">Seeking Support</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Goal Description</label>
                  <input required type="text" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={target} onChange={e => setTarget(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Progress (%)</label>
                  <input type="number" min="0" max="100" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={progress} onChange={e => setProgress(e.target.value)} />
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Project Image Cover</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 cursor-pointer text-sm font-semibold transition shrink-0">
                    <FaCloudUploadAlt className="text-lg text-slate-500" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      disabled={uploadingImage}
                    />
                  </label>
                  {imageUrl && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">— OR PASTE IMAGE URL DIRECTLY —</span>
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 text-sm"
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Details/Description</label>
                <textarea required rows="2" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Support Items Needed (One per line)</label>
                <textarea rows="2" className="w-full px-4 py-2.5 border rounded-xl bg-slate-50" value={supportInput} onChange={e => setSupportInput(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-5 py-2.5 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={uploadingImage} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl disabled:bg-blue-400">
                  {editingId ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}