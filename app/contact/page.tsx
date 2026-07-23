"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage("Pesan berhasil terkirim! Tim konsultan kami akan segera menghubungi Anda.");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setErrorMessage(result.message || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan koneksi/jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* SUBTLE BACKGROUND GRID & GLOW PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

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
          <Link href="/projects" className="hover:text-cyan-400 transition-colors">
            Portofolio
          </Link>
          <Link href="/contact" className="text-cyan-400 font-semibold">
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
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center relative z-10">
        <span className="px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-slate-900 border border-slate-800 rounded-full inline-block mb-6 shadow-sm">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
          Mari Diskusikan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Proyek Digital Anda
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Tim ahli kami siap membantu Anda mentransformasi ide menjadi perangkat lunak berarsitektur tinggi dan scalable.
        </p>
      </section>

      {/* KONTEN UTAMA: FORM + INFO SIDEBAR */}
      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* KOLOM KIRI: INFO KONTAK & KANTOR (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-6">Informasi Kontak</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 text-lg shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Kantor Pusat
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      NEXA Tower, Lt. 12, Jl. Jend. Sudirman Kaveling 45, Jakarta Selatan 12930, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 text-lg shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Email Resmi
                    </h3>
                    <p className="text-slate-200 text-sm">contact@nexacorp.id</p>
                    <p className="text-slate-400 text-xs">support@nexacorp.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 text-lg shrink-0">
                    📞
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Telepon / Hotline
                    </h3>
                    <p className="text-slate-200 text-sm">+62 (021) 555-0199</p>
                    <p className="text-slate-400 text-xs">Senin – Jumat (08:00 – 17:00 WIB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA / GUARANTEE CARD */}
            <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/50 to-slate-900/50 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-cyan-400 font-bold text-lg">⚡</span>
                <h3 className="text-sm font-bold text-white">Respon Cepat SLA &lt; 24 Jam</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Setiap pertanyaan atau permintaan penawaran harga akan ditinjau langsung oleh Lead Technical Consultant kami dalam kurun waktu maksimal 1 hari kerja.
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: FORMULIR KONTAK (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Kirimkan Pesan</h2>
              <p className="text-slate-400 text-sm mb-8">
                Isi formulir di bawah ini untuk memulai konsultasi proyek atau kolaborasi strategis.
              </p>

              {/* NOTIFIKASI SUKSES / ERROR */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in">
                  <span className="text-lg">✅</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3 animate-in fade-in">
                  <span className="text-lg">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-2">
                      Nama Lengkap <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Alex Wijaya"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-2">
                      Alamat Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@perusahaan.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-2">
                    Nama Perusahaan / Organisasi <span className="text-slate-500">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Technology Indonesia"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-2">
                    Pesan / Detail Proyek <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Jelaskan secara singkat mengenai kebutuhan sistem, estimasi jadwal, atau pertanyaan Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/10 active:scale-95 text-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Mengirim Pesan..." : "Kirim Pesan Konsultasi →"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="mt-24 pt-12 border-t border-slate-900 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Pertanyaan Umum (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">Berapa lama estimasi pembuatan aplikasi?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Waktu pengerjaan bervariasi mulai dari 2 minggu untuk landing page/starter website hingga 2–3 bulan untuk sistem enterprise kompleks.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">Apakah ada garansi & pemeliharaan?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ya, setiap proyek menyertakan garansi pemeliharaan teknis (bug fixing) dan garansi performa sistem pasca-launch.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} NEXACORP. All Rights Reserved.</p>
      </footer>
    </div>
  );
}