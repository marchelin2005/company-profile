"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, User, Mail, Lock, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { collection, setDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // MEMASTIKAN FORM KOSONG TOTAL SAAT PERTAMA KALI DIBUKA
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setErrorMsg("");
    setSuccessMsg("");
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Cek apakah email sudah terdaftar di Firestore
      const q = query(collection(db, "users"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrorMsg("Email sudah terdaftar! Gunakan email lain.");
        setLoading(false);
        return;
      }

      // Generate ID unik berupa string
      const newUserId = `cust_${Date.now()}`;

      // 1. Simpan ke collection "users" (Agar bisa login)
      await setDoc(doc(db, "users", newUserId), {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: "pelanggan",
        points: 0,
        createdAt: new Date().toISOString(),
      });

      // 2. Simpan ke collection "customers" (Agar terbaca di sistem kasir)
      await setDoc(doc(db, "customers", newUserId), {
        id: newUserId,
        name: formData.name,
        phone: formData.phone,
        points: 0,
        tier: "Bronze",
      });

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mendaftar. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Coffee className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-stone-100">
            Daftar Member <span className="text-amber-500">NEXACOFFEE</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">Dapatkan poin & voucher diskon setiap bertransaksi</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5" autoComplete="off">
          <div>
            <label className="text-[11px] text-stone-400 block mb-1 font-medium">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Nama kamu"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1 font-medium">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="email@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1 font-medium">Nomor WhatsApp/HP</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="081234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:bg-stone-800 disabled:text-stone-600 mt-2"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun Member"}
          </button>
        </form>

        <p className="text-[11px] text-center text-stone-400 mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-amber-500 hover:underline font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}