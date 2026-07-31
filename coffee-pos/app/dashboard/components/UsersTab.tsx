"use client";

import React, { useState } from "react";
import { Users, UserPlus, ShieldCheck, Mail, ShieldAlert, CheckCircle2, Search } from "lucide-react";

export function UsersTab({ userList = [], handleAddUser }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("kasir");
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    handleAddUser({ name, email, role });
    setName("");
    setEmail("");
  };

  const filteredUsers = userList.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-500" /> Kelola Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manajemen akun staf internal, kasir, gudang, dan administrator NexaCoffee.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-400">Total Pengguna</span>
          <p className="text-lg font-bold text-amber-400 font-mono">{userList.length} Akun</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM TAMBAH PENGGUNA (KIRI - 4 COLS) */}
        <div className="lg:col-span-4 bg-stone-900/90 border border-stone-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
            <UserPlus className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-200">Tambah Akun Staf Baru</h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 block mb-1.5 font-medium">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-200 outline-none focus:border-amber-500/80 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-stone-400 block mb-1.5 font-medium">Email Akses</label>
              <input
                type="email"
                placeholder="budi@nexacoffee.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-200 outline-none focus:border-amber-500/80 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-stone-400 block mb-1.5 font-medium">Hak Akses / Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-200 outline-none focus:border-amber-500/80 transition-colors"
              >
                <option value="kasir">Kasir (Akses POS & Member)</option>
                <option value="gudang">Staf Gudang (Akses Stok)</option>
                <option value="admin">Administrator (Akses Penuh)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-600/10 active:scale-95"
            >
              + Simpan Akun Baru
            </button>
          </form>
        </div>

        {/* TABEL LIST PENGGUNA (KANAN - 8 COLS) */}
        <div className="lg:col-span-8 bg-stone-900/90 border border-stone-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari staf atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500/80"
                />
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                Menampilkan {filteredUsers.length} staf
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/60 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                <tr>
                  <th className="p-4">Staf</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role / Akses</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-stone-500 font-mono">
                      Tidak ada data staf ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any, idx: number) => {
                    const r = (u.role || "kasir").toLowerCase();
                    return (
                      <tr key={u.id || idx} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-4 font-semibold text-stone-200 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-800/50 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                            {u.name ? u.name.charAt(0) : "U"}
                          </div>
                          <span>{u.name}</span>
                        </td>

                        <td className="p-4 text-stone-400 font-mono">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-stone-500" /> {u.email}
                          </span>
                        </td>

                        <td className="p-4">
                          {r === "admin" ? (
                            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" /> Admin
                            </span>
                          ) : r === "gudang" ? (
                            <span className="px-2.5 py-1 bg-stone-800 border border-stone-700 text-stone-300 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-stone-400" /> Gudang
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Kasir
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}