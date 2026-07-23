"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ServiceItem {
  id: string;
  title: string;
  price: string;
  description: string;
  features?: string[] | string;
  is_popular?: boolean;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "1",
    title: "Starter Web",
    price: "Rp 2.500.000",
    description: "Solusi landing page modern & responsif untuk mengenalkan bisnis Anda ke dunia digital.",
    features: ["Landing Page 1 Halaman", "Desain Modern & Mobile-Friendly", "Integrasi Form Kontak", "SLA Uptime 99.9%"],
    is_popular: false,
  },
  {
    id: "2",
    title: "Business App",
    price: "Rp 7.500.000",
    description: "Aplikasi web kustom lengkap dengan manajemen data (CRUD) dan sistem autentikasi.",
    features: ["Aplikasi Web Multi-halaman", "Sistem Database Supabase", "Panel Admin / Dashboard", "Dukungan Prioritas 24/7"],
    is_popular: true,
  },
  {
    id: "3",
    title: "Enterprise System",
    price: "Kustom",
    description: "Arsitektur skala besar yang dapat disesuaikan penuh dengan kebutuhan ekosistem bisnis Anda.",
    features: ["Custom Microservices Architecture", "Keamanan & Enkripsi Khusus", "Integrasi API Third-Party", "Dedicated Tech Consultant"],
    is_popular: false,
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [fetching, setFetching] = useState(true);

  // State Modal & Form
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServicesData = async () => {
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setServices(data);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices(DEFAULT_SERVICES);
      } finally {
        setFetching(false);
      }
    };

    fetchServicesData();
  }, []);

  const handleOpenModal = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsOpen(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_contact: customerContact,
          package_name: selectedPackage,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("🎉 Pesanan berhasil disimpan ke Database!");
        setCustomerName("");
        setCustomerContact("");
        setIsOpen(false);
      } else {
        alert(`Gagal: ${result.message || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan/koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const parseFeatures = (features?: string[] | string): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    try {
      return JSON.parse(features);
    } catch {
      return [features];
    }
  };

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
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            Tentang Kami
          </Link>
          <Link href="/services" className="text-cyan-400 font-semibold">
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
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center relative z-10">
        <span className="px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-slate-900 border border-slate-800 rounded-full inline-block mb-6 shadow-sm">
          Penawaran & Paket
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
          Pilih Paket Solusi{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Digital Terbaik
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Transparan, efisien, dan dikembangkan menggunakan arsitektur modern untuk mendukung skala pertumbuhan bisnis Anda.
        </p>
      </section>

      {/* GRID LAYANAN */}
      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        {fetching ? (
          <div className="text-center py-20 text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-sm">Memuat daftar layanan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const featuresList = parseFeatures(service.features);
              return (
                <div
                  key={service.id}
                  className={`bg-slate-900/50 border ${
                    service.is_popular
                      ? "border-cyan-500/80 shadow-lg shadow-cyan-500/10"
                      : "border-slate-800/80"
                  } rounded-2xl p-8 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 relative group`}
                >
                  {service.is_popular && (
                    <span className="absolute -top-3.5 right-6 bg-cyan-500 text-slate-950 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                      Paling Populer
                    </span>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-3xl font-black text-cyan-400 mb-4 tracking-tight">
                      {service.price}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {featuresList.length > 0 && (
                      <div className="border-t border-slate-800/80 pt-6 mb-8">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                          Fitur Termasuk:
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                          {featuresList.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-cyan-400 font-bold shrink-0">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenModal(service.title)}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/10 cursor-pointer active:scale-95 text-sm"
                  >
                    Pesan Paket Ini →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL FORM PEMESANAN */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-1">Form Pemesanan</h2>
            <p className="text-sm text-slate-400 mb-6">
              Paket Dipilih: <span className="text-cyan-400 font-semibold">{selectedPackage}</span>
            </p>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  No. WhatsApp / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="08123456789 / email@domain.com"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Kirim Pesanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} NEXACORP. All Rights Reserved.</p>
      </footer>
    </div>
  );
}