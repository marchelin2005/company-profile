"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Lock, Mail, AlertCircle } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // MEMASTIKAN INPUT BENAR-BENAR KOSONG SAAT HALAMAN DIBUKA
  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrorMsg("");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Query ke Collection "users" di Firestore
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMsg("Email atau Password tidak ditemukan!");
        setLoading(false);
        return;
      }

      let userData: any = null;
      querySnapshot.forEach((doc) => {
        userData = { id: doc.id, ...doc.data() };
      });

      // Validasi Password
      if (userData.password !== password) {
        setErrorMsg("Password salah!");
        setLoading(false);
        return;
      }

      // Simpan session user yang berhasil login
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email: userData.email,
          role: userData.role,
          name: userData.name,
        })
      );

      // Pengalihan Rute Berdasarkan Role
      if (userData.role === "pelanggan") {
        router.push("/customer/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan koneksi ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">
            NEXA<span className="text-amber-500">COFFEE</span> POS
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Masuk dengan akun Firestore terdaftar
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="text-xs text-stone-400 block mb-1 font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="email@coffee.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-400 block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:bg-stone-800 disabled:text-stone-600"
          >
            {loading ? "Memeriksa Akun..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="text-[11px] text-center text-stone-400 mt-6">
          Belum punya akun member?{" "}
          <Link href="/register" className="text-amber-500 hover:underline font-semibold">
            Daftar Member Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}