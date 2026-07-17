"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaPlus, FaTrash, FaRocket, FaSpinner } from "react-icons/fa";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form input states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("infrastructure");
  const [status, setStatus] = useState("Seeking Support");
  const [target, setTarget] = useState("");
  const [progress, setProgress] = useState(0);
  const [supportInput, setSupportInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Split text area lines into array elements for needed_support
    const needed_support = supportInput
      .split("\n")
      .map(item => item.trim())
      .filter(item => item !== "");

    const { error } = await supabase.from("projects").insert([
      {
        title,
        description,
        category,
        status,
        target,
        progress: parseInt(progress) || 0,
        needed_support
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } else {
      alert("Error adding project: " + error.message);
    }
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) {
        fetchProjects();
      } else {
        alert("Error deleting: " + error.message);
      }
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("infrastructure");
    setStatus("Seeking Support");
    setTarget("");
    setProgress(0);
    setSupportInput("");
  }

  return (
    <div>
      {/* Header and Add Button */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold text-slate-900 flex items-center gap-4">
          <FaRocket className="text-blue-600" />
          Projects
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      {/* Main Table / Loader Container */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-md border border-slate-100">
          No projects listed yet. Click the top button to launch your first community initiative!
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <th className="p-5">Project Title</th>
                <th className="p-5">Category</th>
                <th className="p-5">Status</th>
                <th className="p-5">Progress</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="p-5 font-semibold text-slate-900">{project.title}</td>
                  <td className="p-5 capitalize">{project.category}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.status === "Completed" ? "bg-green-100 text-green-700" :
                      project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-5 font-medium">{project.progress}%</td>
                  <td className="p-5 text-center">
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700 p-2.5 rounded-xl hover:bg-red-50 transition"
                      title="Delete Project"
                    >
                      <FaTrash className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Creation Dialog Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Add New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Project Title</label>
                <input required type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-500 transition" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Modernizing the ICT Computer Lab" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-500 transition" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="technology">Technology</option>
                    <option value="materials">Materials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-500 transition" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Seeking Support">Seeking Support</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Target Goal</label>
                  <input required type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-500 transition" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 15 Desktop Computers" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Progress (%)</label>
                  <input type="number" min="0" max="100" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-500 transition" value={progress} onChange={e => setProgress(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Project Details/Description</label>
                <textarea required rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 resize-none focus:bg-white focus:outline-blue-500 transition" value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide short details about the vision of this project..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Support Items Needed (One per line)</label>
                <textarea rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono text-xs focus:bg-white focus:outline-blue-500 transition" value={supportInput} onChange={e => setSupportInput(e.target.value)} placeholder="e.g. Donation of refurbished computers&#10;Volunteer IT help" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}