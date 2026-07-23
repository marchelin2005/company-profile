"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Email atau kata sandi tidak valid.");
      } else if (data.session) {
        router.refresh();
        router.replace("/admin/dashboard");
      }
    } catch (err) {
      setErrorMessage("Terjadi kendala sistem saat menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* GLOW EFFECT BACKGROUND */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-sky-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* SUBTLE GRID PATTERN OVERLAY */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
      />

      {/* CARD CONTAINER */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl shadow-slate-950/80 relative z-10 transition-all">
        
        {/* LOGO & HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-cyan-400 text-slate-950 font-black text-2xl mb-4 shadow-lg shadow-cyan-500/25 border border-cyan-300/30">
            N
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            NEXA<span className="text-cyan-400">ADMIN</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Sistem Autentikasi Internal Control Center
          </p>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 shadow-inner">
            <span className="text-base shrink-0">⚠️</span>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@nexacorp.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/90 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/90 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <span className="text-base">→</span>
              </>
            )}
          </button>
        </form>

        {/* FOOTER INSIDE CARD */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Terhubung langsung dengan database Supabase secara aman.
          </p>
        </div>
      </div>
    </div>
  );
}