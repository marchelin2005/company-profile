"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      const cleanEmail = email.trim().toLowerCase();

      // Query spesifik per email ke Firestore (mencegah kebocoran data)
      const q = query(collection(db, "users"), where("email", "==", cleanEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMsg("Email atau Password salah!");
        setLoading(false);
        return;
      }

      let userData: any = null;
      querySnapshot.forEach((doc) => {
        userData = { id: doc.id, ...doc.data() };
      });

      // Validasi Password
      if (userData.password !== password) {
        setErrorMsg("Email atau Password salah!");
        setLoading(false);
        return;
      }

      // Simpan session pengguna
      localStorage.setItem("user_session", JSON.stringify(userData));

      // Pengalihan Rute Berdasarkan Role
      const userRole = (userData.role || "").toLowerCase();
      if (userRole === "pelanggan" || userRole === "customer" || userRole === "member") {
        router.push("/customer/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("Terjadi kesalahan koneksi ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-500 shadow-lg shadow-amber-500/10">
            <Coffee className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100 font-mono tracking-tight">
            NEXA<span className="text-amber-500">COFFEE</span> POS
          </h1>
          <p className="text-xs text-stone-400">
            Masuk dengan akun Firestore terdaftar
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800/80 text-red-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs" autoComplete="off">
          <div>
            <label className="text-stone-400 block mb-1.5 font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="email@coffee.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-stone-400 block mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-600/10 flex items-center justify-center gap-2 active:scale-95 disabled:bg-stone-800 disabled:text-stone-600"
          >
            {loading ? "Memeriksa Akun..." : "Masuk ke Dashboard"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* LINK DAFTAR MEMBER */}
        <div className="text-center pt-2 border-t border-stone-800/80">
          <p className="text-[11px] text-stone-500">
            Belum punya akun member?{" "}
            <Link href="/register" className="text-amber-500 hover:underline font-semibold">
              Daftar Member Sekarang
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}