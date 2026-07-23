"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Proyek Selesai", value: "50+" },
    { label: "Klien Puas", value: "30+" },
    { label: "Tim Engineering", value: "15+" },
    { label: "SLA Uptime", value: "99.9%" },
  ];

  const coreValues = [
    {
      icon: "⚡",
      title: "Inovasi & Kinerja",
      desc: "Mengadopsi stack teknologi modern terdepan untuk menghadirkan aplikasi yang efisien, cepat, dan siap menghadapi kebutuhan masa depan.",
    },
    {
      icon: "🛡️",
      title: "Keamanan Data",
      desc: "Menjadikan keamanan, privasi, dan integritas data sistem klien sebagai standar prioritas tertinggi dalam setiap arsitektur kode.",
    },
    {
      icon: "🤝",
      title: "Transparansi Penuh",
      desc: "Membangun hubungan jangka panjang melalui komunikasi yang terbuka, laporan progres berkala, dan eksekusi yang sesuai dengan komitmen.",
    },
  ];

  const leadershipTeam = [
    {
      name: "Marchelin R.",
      role: "Chief Executive Officer",
      init: "MR",
      desc: "Mengarahkan visi strategis perusahaan dan memimpin transformasi teknologi untuk para mitra bisnis global.",
    },
    {
      name: "Sucipto Hiu",
      role: "Lead Developer",
      init: "SH",
      desc: "Arsitek teknis utama yang mengawasi pengembangan infrastruktur cloud, performa sistem, dan keamanan database.",
    },
    {
      name: "Rionaldo N.",
      role: "Head of Product & UI/UX",
      init: "RN",
      desc: "Merancang strategi produk dan pengalaman antarmuka pengguna (UI/UX) berkelas enterprise.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* SUBTLE BACKGROUND GRID PATTERN */}
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
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Beranda
          </Link>
          <Link href="/about" className="text-cyan-400 font-semibold">
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
      <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center relative z-10">
        <span className="px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-slate-900 border border-slate-800 rounded-full inline-block mb-6 shadow-sm">
          Profil Perusahaan
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
          Menghubungkan Ide Cerdas Dengan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Teknologi Masa Depan
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          NEXACORP hadir untuk membantu bisnis dari berbagai skala dalam menghadapi era transformasi digital melalui ekosistem perangkat lunak yang aman, andal, dan siap berkembang.
        </p>
      </section>

      {/* STATISTIK PERUSAHAAN */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="px-6 py-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mb-6">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Visi Kami</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Menjadi mitra rekayasa perangkat lunak utama yang terpercaya dalam mendorong efisiensi, inovasi, dan daya saing digital tanpa batas bagi setiap klien kami.
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mb-6">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Misi Kami</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Menghadirkan produk digital berkualitas tinggi berbasis arsitektur modern, memberikan pengalaman pengguna yang intuitif, serta mendampingi pertumbuhan bisnis klien secara konsisten.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES / NILAI UTAMA */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Prinsip Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Nilai Utama NEXACORP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((value, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all duration-300 group"
            >
              <div className="text-3xl mb-6">{value.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {value.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TIM KEPEMIMPINAN */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center border-t border-slate-900">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Talenta & Kepemimpinan
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
          Tim di Balik Layar
        </h2>
        <p className="text-slate-400 mb-14 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Dipimpin oleh para profesional berpengalaman di bidang rekayasa perangkat lunak, arsitektur sistem cloud, dan manajemen produk.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {leadershipTeam.map((member, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col items-center hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center text-xl font-black mb-5 text-cyan-400 group-hover:border-cyan-500 transition-colors">
                {member.init}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {member.name}
              </h3>
              <p className="text-xs text-cyan-400 font-medium mb-3">{member.role}</p>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 bg-slate-900/60 border border-slate-800/80 rounded-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Siap Memulai Proyek Masa Depan Bersama Kami?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Tim ahli kami siap mendengarkan ide bisnis Anda dan merancang solusi teknologi yang presisi dan efektif.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all text-sm"
          >
            Hubungi Kami Sekarang →
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