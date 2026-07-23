"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  created_at?: string;
  name?: string;
  email?: string;
  message?: string;
}

interface Order {
  id: number;
  created_at: string;
  customer_name?: string;
  customer_contact?: string;
  package_name?: string;
  status?: string;
}

interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  is_popular: boolean;
}

interface Project {
  id: number;
  created_at?: string;
  title: string;
  category: string;
  description: string;
  status: string;
  tags: string; // Disimpan sebagai string terpisah koma di form DB
  icon?: string;
  gradient?: string;
  link?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"contacts" | "orders" | "services" | "projects">("contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State Form Modal Service
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIsPopular, setFormIsPopular] = useState(false);

  // State Form Modal Project
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("Live Production");
  const [projectTags, setProjectTags] = useState("");
  const [projectIcon, setProjectIcon] = useState("💻");
  const [projectGradient, setProjectGradient] = useState("from-cyan-500/20 via-blue-500/10 to-transparent");
  const [projectLink, setProjectLink] = useState("#");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      fetchData();
    };

    checkAuth();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Contacts
    const { data: contactData } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (contactData) setContacts(contactData);

    // Fetch Orders
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (orderData) setOrders(orderData);

    // Fetch Services
    const { data: serviceData } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });
    if (serviceData) setServices(serviceData);

    // Fetch Projects
    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (projectData) setProjects(projectData);
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // --- LOGIC SERVICE ---
  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormTitle(service.title);
      setFormPrice(service.price);
      setFormDescription(service.description || "");
      setFormFeatures(service.features ? service.features.join(", ") : "");
      setFormIsPopular(service.is_popular || false);
    } else {
      setEditingService(null);
      setFormTitle("");
      setFormPrice("");
      setFormDescription("");
      setFormFeatures("");
      setFormIsPopular(false);
    }
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = formFeatures.split(",").map((f) => f.trim()).filter(Boolean);

    const payload = {
      title: formTitle,
      price: formPrice,
      description: formDescription,
      features: featuresArray,
      is_popular: formIsPopular,
    };

    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", editingService.id);
      if (error) alert("Gagal memperbarui layanan: " + error.message);
    } else {
      const { error } = await supabase.from("services").insert([payload]);
      if (error) alert("Gagal menambah layanan: " + error.message);
    }

    setIsModalOpen(false);
    fetchData();
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) alert("Gagal menghapus layanan: " + error.message);
    else fetchData();
  };

  // --- LOGIC PROJECT ---
  const handleOpenProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectTitle(project.title);
      setProjectCategory(project.category || "");
      setProjectDescription(project.description || "");
      setProjectStatus(project.status || "Live Production");
      setProjectTags(project.tags || "");
      setProjectIcon(project.icon || "💻");
      setProjectGradient(project.gradient || "from-cyan-500/20 via-blue-500/10 to-transparent");
      setProjectLink(project.link || "#");
    } else {
      setEditingProject(null);
      setProjectTitle("");
      setProjectCategory("");
      setProjectDescription("");
      setProjectStatus("Live Production");
      setProjectTags("");
      setProjectIcon("💻");
      setProjectGradient("from-cyan-500/20 via-blue-500/10 to-transparent");
      setProjectLink("#");
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: projectTitle,
      category: projectCategory,
      description: projectDescription,
      status: projectStatus,
      tags: projectTags,
      icon: projectIcon,
      gradient: projectGradient,
      link: projectLink
    };

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id);
      if (error) alert("Gagal memperbarui proyek: " + error.message);
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) alert("Gagal menambah proyek: " + error.message);
    }

    setIsProjectModalOpen(false);
    fetchData();
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) alert("Gagal menghapus proyek: " + error.message);
    else fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col justify-between bg-slate-900/60">
        <div>
          <div className="text-xl font-bold tracking-wider text-cyan-400 mb-8">
            NEXA<span className="text-white">ADMIN</span>
          </div>
          <nav className="space-y-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              📩 Laporan Kontak ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              🛒 Pesanan ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === "services"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              ⚡ Kelola Layanan ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === "projects"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              📁 Kelola Proyek ({projects.length})
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded-xl text-xs font-bold transition text-left cursor-pointer"
        >
          ← Keluar (Logout)
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeTab === "contacts"
                ? "Laporan Pesan Masuk"
                : activeTab === "orders"
                ? "Daftar Pesanan Client"
                : activeTab === "services"
                ? "Kelola Paket Layanan"
                : "Kelola Portofolio Proyek"}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Data terhubung langsung secara real-time dari Supabase Database.
            </p>
          </div>

          <div className="flex gap-3">
            {activeTab === "services" && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                + Tambah Layanan
              </button>
            )}

            {activeTab === "projects" && (
              <button
                onClick={() => handleOpenProjectModal()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                + Tambah Proyek
              </button>
            )}

            <button 
              onClick={fetchData}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-400 transition cursor-pointer"
            >
              🔄 Refresh Data
            </button>
          </div>
        </header>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data dari database...</div>
        ) : activeTab === "contacts" ? (
          /* TAB CONTACTS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Pesan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">Belum ada pesan masuk.</td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="p-4 font-semibold text-white whitespace-nowrap">{c.name || "-"}</td>
                      <td className="p-4 text-cyan-400 whitespace-nowrap">{c.email || "-"}</td>
                      <td className="p-4 text-slate-300">{c.message || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "orders" ? (
          /* TAB ORDERS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nama Client</th>
                  <th className="p-4">Kontak</th>
                  <th className="p-4">Layanan</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">Belum ada pesanan masuk.</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/30">
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 font-semibold text-white whitespace-nowrap">{o.customer_name || "-"}</td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">{o.customer_contact || "-"}</td>
                      <td className="p-4 text-cyan-400 font-medium">{o.package_name || "-"}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                          {o.status || "new"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "services" ? (
          /* TAB SERVICES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between relative"
              >
                {s.is_popular && (
                  <span className="absolute top-4 right-4 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                    Populer
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <div className="text-2xl font-black text-cyan-400 my-2">{s.price}</div>
                  <p className="text-slate-400 text-xs mb-4">{s.description}</p>

                  <ul className="space-y-1.5 text-xs text-slate-300 mb-6">
                    {s.features?.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-cyan-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenModal(s)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-xs font-semibold text-red-300 rounded-lg transition cursor-pointer"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TAB PROJECTS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Icon & Judul</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">Belum ada proyek ditambahkan.</td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-semibold text-white flex items-center gap-2">
                        <span className="text-lg">{p.icon || "💻"}</span>
                        <div>
                          {p.title}
                          <p className="text-xs font-normal text-slate-400 line-clamp-1">{p.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-cyan-400 whitespace-nowrap">{p.category}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
                          {p.status || "Live Production"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">{p.tags}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenProjectModal(p)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold mr-2 transition cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL TAMBAH / EDIT SERVICE */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                {editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h2>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Layanan / Paket</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Web Company Profile"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Harga</label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Contoh: Rp 1.500.000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Penjelasan ringkas paket ini..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Fitur Paket (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Responsive, Domain Gratis, SEO Friendly"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="is_popular" className="text-slate-300">
                    Tandai sebagai Paket Populer / Rekomendasi
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH / EDIT PROJECT */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
              </h2>

              <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Judul Proyek</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Contoh: E-Commerce Mobile App"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Kategori</label>
                    <input
                      type="text"
                      required
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      placeholder="WEB DEVELOPMENT"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Icon Emoji</label>
                    <input
                      type="text"
                      value={projectIcon}
                      onChange={(e) => setProjectIcon(e.target.value)}
                      placeholder="🛒"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Deskripsi Proyek</label>
                  <textarea
                    rows={2}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Penjelasan ringkas tentang sistem atau fitur..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Status Proyek</label>
                    <input
                      type="text"
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      placeholder="Live Production"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Link Eksternal</label>
                    <input
                      type="text"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Tech Stack / Tags (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={projectTags}
                    onChange={(e) => setProjectTags(e.target.value)}
                    placeholder="Next.js, Tailwind CSS, Supabase"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold cursor-pointer"
                  >
                    Simpan Proyek
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}