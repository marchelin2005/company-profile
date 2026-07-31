"use client";

import React, { useState } from "react";
import { Boxes, PackageCheck, AlertTriangle, Search, PlusCircle, RefreshCw } from "lucide-react";

export function InventoryTab({ stocks = [], restockItem }: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStocks = stocks.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = stocks.filter((s: any) => Number(s.amount) <= Number(s.min)).length;
  const safeCount = stocks.length - criticalCount;

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER & STATS BAR */}
      <div>
        <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
          <Boxes className="w-6 h-6 text-amber-500" /> Stok & Bahan Baku Realtime
        </h1>
        <p className="text-xs text-stone-400 mt-0.5">
          Pantau sisa persediaan bahan baku dan lakukan restock secara langsung.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400">Total Jenis Bahan</p>
            <p className="text-xl font-bold font-mono text-stone-100 mt-1">{stocks.length} Item</p>
          </div>
          <div className="p-3 bg-stone-800/80 border border-stone-700/60 rounded-xl text-stone-300">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400">Stok Aman</p>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{safeCount} Item</p>
          </div>
          <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-emerald-400">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 bg-stone-900/90 border rounded-2xl flex items-center justify-between ${
          criticalCount > 0 ? "border-red-900/80 bg-red-950/10" : "border-stone-800"
        }`}>
          <div>
            <p className="text-xs text-stone-400">Bahan Kritis / Menipis</p>
            <p className={`text-xl font-bold font-mono mt-1 ${criticalCount > 0 ? "text-red-400" : "text-stone-100"}`}>
              {criticalCount} Item
            </p>
          </div>
          <div className={`p-3 rounded-xl ${criticalCount > 0 ? "bg-red-950 text-red-400 animate-pulse border border-red-800" : "bg-stone-800 text-stone-400"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-between items-center bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama bahan baku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 outline-none focus:border-amber-500 transition-all"
          />
        </div>
        <span className="text-xs font-mono text-stone-400 px-3">
          Menampilkan {filteredStocks.length} dari {stocks.length} item
        </span>
      </div>

      {/* TABEL STOK */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase font-mono text-[10px] tracking-wider">
              <th className="p-4">Nama Bahan</th>
              <th className="p-4">Sisa Stok</th>
              <th className="p-4">Batas Min</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {filteredStocks.map((item: any) => {
              const isLow = Number(item.amount) <= Number(item.min);
              return (
                <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-semibold text-stone-200">{item.name}</td>
                  <td className="p-4 font-mono font-bold text-amber-400">
                    {item.amount} <span className="text-[10px] text-stone-400 font-sans">{item.unit}</span>
                  </td>
                  <td className="p-4 font-mono text-stone-400">
                    {item.min} <span className="text-[10px] font-sans">{item.unit}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        isLow
                          ? "bg-red-950/80 text-red-400 border-red-800"
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                      }`}
                    >
                      {isLow ? <AlertTriangle className="w-3 h-3" /> : <PackageCheck className="w-3 h-3" />}
                      {isLow ? "Menipis" : "Aman"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => restockItem(item.id, item.unit === "Kg" ? 1 : 5)}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-amber-400 font-semibold rounded-xl border border-stone-700/80 hover:border-amber-500 transition-all flex items-center gap-1.5 ml-auto text-[11px]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> + Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}