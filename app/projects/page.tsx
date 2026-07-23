"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Project {
  id?: number | string;
  title: string;
  category: string;
  description: string;
  tags: string[] | string;
  status: string;
  gradient?: string;
  icon?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    category: "Web Development",
    description:
      "Aplikasi belanja online skala besar dengan sistem pembayaran otomatis, manajemen stok real-time, dan analitik penjualan.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
    status: "Live Production",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    icon: "🛒",
  },
  {
    id: "2",
    title: "Mobile Banking Redesign",
    category: "UI/UX Design & Mobile",
    description:
      "Perancangan ulang antarmuka aplikasi perbankan digital untuk meningkatkan kecepatan transaksi dan kepuasan pengguna.",
    tags: ["React Native", "Figma", "Tailwind"],
    status: "Completed",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    icon: "💳",
  },
  {
    id: "3",
    title: "SaaS Dashboard Analytics",
    category: "Cloud Solution",
    description:
      "Dashboard pemantauan data & grafik performa bisnis real-time berbasis cloud untuk efisiensi rantai pasok perusahaan logistik.",
    tags: ["Next.js", "Chart.js", "Tailwind CSS"],
    status: "Live Production",
    gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
    icon: "📊",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setProjects(DEFAULT_PROJECTS);
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data proyek:", err);
        setProjects(DEFAULT_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* SUBTLE BACKGROUND GRID & GLOW PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            NEXA<span className="text-cyan-400">CORP</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Beranda
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            Tentang Kami
          </Link>
          <Link href="/services" className="hover:text-cyan-400 transition-colors">
            Layanan
          </Link>
          <Link href="/projects" className="text-cyan-400 font-semibold">
            Portofolio
          </Link>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">
            Kontak
          </Link>
        </div>

        <div>
          <Link
            href="/contact"
            className="px-4 py-2 text-xs font-semibold text-cyan-400 border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 rounded-lg transition-all duration-200 inline-block"
          >
            Konsultasi Gratis
          </Link>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center relative z-10">
        <span className="px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-slate-900 border border-slate-800 rounded-full inline-block mb-6 shadow-sm">
          Portfolio & Case Studies
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
          Karya & Proyek{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Unggulan
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Eksplorasi bagaimana kami membantu mitra bisnis bertransformasi digital melalui perangkat lunak yang andal, efisien, dan modern.
        </p>
      </section>

      {/* PROJECTS GRID */}
      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-sm">Memuat daftar portofolio...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((item, index) => {
              const formattedTags = Array.isArray(item.tags)
                ? item.tags
                : typeof item.tags === "string"
                ? item.tags.split(",").map((t) => t.trim())
                : [];

              return (
                <div
                  key={item.id || index}
                  className="group relative bg-slate-900/50 border border-slate-800/80 rounded-2xl p-7 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-cyan-500/10"
                >
                  {/* Card Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${
                      item.gradient || "from-cyan-500/20 via-blue-500/10 to-transparent"
                    } opacity-30 group-hover:opacity-70 transition duration-500 pointer-events-none`}
                  />

                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <span className="text-2xl p-3 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
                        {item.icon || "💻"}
                      </span>
                      <span className="px-3 py-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 rounded-full">
                        {item.status || "Live"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 mb-3 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer / Tech Stack Tags */}
                  <div className="relative z-10 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-2">
                      {formattedTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-slate-950/90 border border-slate-800/80 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} NEXACORP. All Rights Reserved.</p>
      </footer>
    </div>
  );
}