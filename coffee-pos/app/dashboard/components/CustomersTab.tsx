"use client";

import React, { useState } from "react";
import { UserCheck, Phone, Search, Award, UserPlus, CheckCircle2 } from "lucide-react";

export function CustomersTab({ customers, addCustomer }: any) {
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [searchCustomer, setSearchCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState("");

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    setLoading(true);
    setSuccessInfo("");

    try {
      await addCustomer(newCustomer.name, newCustomer.phone);
      const autoEmail = `${newCustomer.name.toLowerCase().replace(/\s+/g, "")}@coffee.com`;

      setSuccessInfo(
        `Member Berhasil Dibuat!\nEmail Login: ${autoEmail}\nPassword Default: 123`
      );
      setNewCustomer({ name: "", phone: "" });
    } catch (err) {
      console.error("Gagal menambah member dari kasir:", err);
      alert("Terjadi kesalahan saat menyimpan member.");
    } finally {
      setLoading(false);
    }
  };

  const rawCustomers = customers || [];
  const uniqueCustomersMap = new Map();

  rawCustomers.forEach((item: any) => {
    if (!item || !item.name) return;
    const cleanName = item.name.toLowerCase().trim();

    if (cleanName === "albert") return;
    if (cleanName === "yoga" && !String(item.id).startsWith("cust_")) return;

    const key = cleanName;
    if (!uniqueCustomersMap.has(key)) {
      uniqueCustomersMap.set(key, item);
    } else {
      const existing = uniqueCustomersMap.get(key);
      if (String(item.id).startsWith("cust_") || !String(existing.id).startsWith("cust_")) {
        uniqueCustomersMap.set(key, item);
      }
    }
  });

  const cleanCustomers = Array.from(uniqueCustomersMap.values());

  const filteredCustomers = cleanCustomers.filter(
    (c: any) =>
      c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      c.phone?.includes(searchCustomer)
  );

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-amber-500" /> Kelola Pelanggan & Member
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Program loyalty member NexaCoffee. Poin bertambah otomatis saat transaksi kasir.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-400">Total Member</span>
          <p className="text-lg font-bold text-amber-400 font-mono">{cleanCustomers.length} Pelanggan</p>
        </div>
      </div>

      {/* FORM DAFTAR MEMBER BARU */}
      <div className="p-5 bg-stone-900/90 border border-stone-800/80 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-800">
          <UserPlus className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Daftarkan Member Baru (Akses Kasir)
          </h3>
        </div>

        {successInfo && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 rounded-xl text-xs whitespace-pre-line font-mono flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{successInfo}</div>
          </div>
        )}

        <form onSubmit={handleAddCustomerSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nama Pelanggan"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className="bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-500/80 transition-colors"
            required
          />
          <input
            type="tel"
            placeholder="Nomor HP / WhatsApp"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            className="bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-500/80 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-all disabled:bg-stone-800 disabled:text-stone-600 shadow-lg shadow-amber-600/10 active:scale-95 py-2.5"
          >
            {loading ? "Menyimpan..." : "Simpan Member"}
          </button>
        </form>
      </div>

      {/* TABEL DAFTAR MEMBER */}
      <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama / nomor HP..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500/80"
            />
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            Terfilter: {filteredCustomers.length} Member
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-stone-950/60 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
            <tr>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Nomor HP</th>
              <th className="p-4">Poin Loyalty</th>
              <th className="p-4 text-center">Tier Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500 font-mono">
                  Belum ada pelanggan terdaftar.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c: any, idx: number) => {
                const points = c.points || 0;
                const tier = points >= 100 ? "Gold" : points >= 50 ? "Silver" : "Bronze";

                return (
                  <tr key={c.id || idx} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4 font-semibold text-stone-200 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-800/50 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                        {c.name ? c.name.charAt(0) : "M"}
                      </div>
                      <span>{c.name}</span>
                    </td>

                    <td className="p-4 text-stone-400 font-mono">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-500" /> {c.phone}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-400 text-sm">
                      {points} <span className="text-[10px] text-stone-400 font-sans">Pts</span>
                    </td>

                    <td className="p-4 text-center">
                      {tier === "Gold" ? (
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" /> Gold Tier
                        </span>
                      ) : tier === "Silver" ? (
                        <span className="px-3 py-1 bg-stone-300/10 border border-stone-400/40 text-stone-300 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-stone-300" /> Silver Tier
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-stone-800 border border-stone-700 text-stone-400 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-stone-500" /> Bronze Tier
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}