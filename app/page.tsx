"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Proyek Selesai", value: "50+" },
    { label: "Kepuasan Klien", value: "99%" },
    { label: "Uptime Sistem", value: "99.9%" },
    { label: "Dukungan Teknis", value: "24/7" },
  ];

  const services = [
    {
      icon: "💻",
      title: "Web Application",
      desc: "Pengembangan aplikasi web berbasis Next.js & Cloud Infrastructure yang cepat, aman, SEO-friendly, dan scalable.",
      tag: "Enterprise Grade",
    },
    {
      icon: "📱",
      title: "Mobile Development",
      desc: "Solusi aplikasi iOS dan Android performa tinggi dengan arsitektur modern dan integrasi API yang seamless.",
      tag: "Cross-Platform",
    },
    {
      icon: "🎨",
      title: "UI/UX & System Design",
      desc: "Perancangan antarmuka & alur kerja sistem yang intuitif, teruji secara riset pengguna, serta siap diimplementasikan.",
      tag: "User-Centered",
    },
  ];

  const techStack = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "Docker",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* SUBTLE BACKGROUND GRID PATTERN (Menghilangkan kesan neon AI murah) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

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
          <Link href="/" className="text-cyan-400 font-semibold">
            Beranda
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            Tentang Kami
          </Link>
          <Link href="/services" className="hover:text-cyan-400 transition-colors">
            Layanan
          </Link>
          <Link href="/projects" className="hover:text-cyan-400 transition-colors">
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

      {/* HERO SECTION */}
      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-cyan-400 bg-slate-900 border border-slate-800 rounded-full mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Software & Cloud Engineering House
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15] max-w-4xl mx-auto">
          Membangun Sistem Digital Enterprise yang{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Handal & Scalable
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          NEXACORP merancang dan mengintegrasikan ekosistem perangkat lunak
          skala industri—mulai dari aplikasi web, mobile app, hingga solusi cloud
          terintegrasi untuk mengakselerasi bisnis Anda.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <span>Mulai Diskusi Proyek</span>
            <span>→</span>
          </Link>
          <Link
            href="/projects"
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center"
          >
            Lihat Studi Kasus
          </Link>
        </div>
      </section>

      {/* TECH STACK BAR */}
      <section className="px-6 py-8 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-wider text-slate-500 uppercase mb-6">
            Teknologi & Framework Utama yang Kami Gunakan
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-70">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1 tracking-tight">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN UTAMA */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Layanan Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Solusi Software Komprehensif
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0 leading-relaxed">
            Setiap lini solusi dikembangkan dengan standar keamanan tinggi dan
            performa teroptimasi untuk mendukung kebutuhan jangka panjang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <Link
                href="/services"
                className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 transition-all pt-4 border-t border-slate-800/80"
              >
                <span>Pelajari Detail Paket</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL / TRUST SECTION */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 bg-slate-900/60 border border-slate-800/80 rounded-3xl relative text-center">
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 font-normal">
            “NEXACORP membantu mentransformasi arsitektur perangkat lunak kami
            menjadi sistem modern berbasis cloud yang sangat stabil dan responsif.
            Eksekusi proyek sangat rapi dan tepat waktu.”
          </p>
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-white">Chief Technology Officer</h4>
            <p className="text-xs text-cyan-400 mt-0.5">Mitra Industri Logistik & Rantai Pasok</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Siap Mewujudkan Produk Digital Anda?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Konsultasikan ide atau kebutuhan pengembangan sistem perusahaan Anda
            bersama tim enginer profesional kami.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            Hubungi Tim NEXACORP
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} NEXACORP. All Rights Reserved.</p>
      </footer>
    </div>
  );
}