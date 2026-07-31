"use client";

import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  BarChart3, 
  ArrowUpRight,
  Package,
  Calendar
} from "lucide-react";

export function OverviewTab({ 
  getTotalIncome, 
  getNetProfit, 
  transactions = [], 
  stocks = [] 
}: any) {
  // Safe getters & fallback nilai agar aman dari error
  const totalIncome = typeof getTotalIncome === "function" ? getTotalIncome() : 0;
  const netProfit = typeof getNetProfit === "function" ? getNetProfit() : 0;
  
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeStocks = Array.isArray(stocks) ? stocks : [];

  const criticalStocks = safeStocks.filter(
    (s: any) => Number(s?.amount || 0) <= Number(s?.min || 0)
  );

  // 1. GENERATE DATA 7 HARI TERAKHIR (PEMETAAN PENJUALAN MINGGU INI)
  const daysName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const last7Days: { dateStr: string; label: string; dayName: string; total: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    
    // Format DD-MM-YYYY untuk pencocokan data transaksi
    const dateFormatted = `${day}-${month}-${year}`; 
    const dayName = daysName[d.getDay()];

    last7Days.push({
      dateStr: dateFormatted,
      label: `${day}/${month}`,
      dayName: dayName,
      total: 0,
    });
  }

  // 2. HITUNG TOTAL OMSET PER HARI MINGGU INI
  safeTransactions.forEach((trx: any) => {
    if (!trx?.fullDate && !trx?.date) return;
    const trxDate = trx.fullDate || trx.date;
    const trxTotal = Number(trx.total || trx.totalPrice || trx.amount || 0);

    const targetDay = last7Days.find((d) => d.dateStr === trxDate);
    if (targetDay) {
      targetDay.total += trxTotal;
    }
  });

  // 3. SKALA HITUNG GRAFIK
  const totals = last7Days.map((d) => d.total);
  const maxTotal = Math.max(...totals, 50000); // Batas minimal skala Rp 50.000
  const minTotal = Math.min(...totals, 0);
  const range = maxTotal - minTotal || 1;

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" /> Ringkasan Bisnis Realtime
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Data otomatis terhubung & sinkron antar modul kasir, riwayat & stok.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Online</span>
        </div>
      </div>

      {/* 4 CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TOTAL OMSET */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium">Total Omset</span>
            <div className="p-2 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-2">
            Rp {(totalIncome || 0).toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-emerald-500/80 gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Transaksi Kasir Realtime
          </div>
        </div>

        {/* LABA BERSIH */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium">Estimasi Laba Bersih</span>
            <div className="p-2 bg-amber-950/50 border border-amber-800/50 rounded-xl text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-2">
            Rp {(netProfit || 0).toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-amber-500/80 gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Margin Setelah HPP Bahan
          </div>
        </div>

        {/* TRANSAKSI SUKSES */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium">Total Pesanan</span>
            <div className="p-2 bg-blue-950/50 border border-blue-800/50 rounded-xl text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-100 font-mono mt-2">
            {safeTransactions.length} <span className="text-xs text-stone-400 font-sans">Pesanan</span>
          </p>
          <div className="mt-3 text-[11px] text-stone-400 font-medium">
            Terdaftar di sistem
          </div>
        </div>

        {/* BAHAN KRITIS */}
        <div className={`p-5 bg-stone-900/90 border rounded-2xl relative overflow-hidden transition-all ${
          criticalStocks.length > 0 ? "border-red-900/80 bg-red-950/10" : "border-stone-800"
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-stone-400 font-medium">Bahan Kritis / Menipis</span>
            <div className={`p-2 rounded-xl ${criticalStocks.length > 0 ? "bg-red-950 border border-red-800 text-red-400 animate-pulse" : "bg-stone-800 text-stone-400"}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono mt-2 ${criticalStocks.length > 0 ? "text-red-400" : "text-stone-100"}`}>
            {criticalStocks.length} <span className="text-xs font-sans text-stone-400">Item</span>
          </p>
          <div className="mt-3 text-[11px] text-stone-400 font-medium">
            {criticalStocks.length > 0 ? "⚠️ Segera restock bahan baku" : "Aman, stok tercukupi"}
          </div>
        </div>
      </div>

      {/* SECTION GRAFIK PENJUALAN MINGGU INI & STATUS STOK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFIK BAR PENJUALAN 7 HARI TERAKHIR (MINGGU INI) */}
        <div className="lg:col-span-2 p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" /> Grafik Penjualan Minggu Ini (7 Hari Terakhir)
              </h2>
              <p className="text-[11px] text-stone-400">Total omset harian yang didapatkan dari kasir.</p>
            </div>
            <span className="text-[10px] bg-stone-800 text-amber-400 px-2.5 py-1 rounded-lg font-mono border border-stone-700">
              Laporan Mingguan
            </span>
          </div>

          {/* AREA BAR CHART */}
          <div className="h-56 flex items-end justify-between gap-3 pt-10 pb-2 px-4 bg-stone-950/60 border border-stone-800/80 rounded-2xl">
            {last7Days.map((d, i) => {
              // RUMUS PERSENTASE TINGGI BALOK GRAFIK
              const heightPercent = d.total === 0 
                ? 10 
                : totals.every((val) => val === totals[0])
                ? 60
                : Math.max(18, Math.min(100, Math.round(((d.total - minTotal) / range) * 80 + 20)));

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                  {/* Tooltip Nominal saat Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow mb-1 whitespace-nowrap z-10">
                    Rp {d.total.toLocaleString("id-ID")}
                  </div>
                  
                  {/* Batang Grafik Bar */}
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 shadow-lg cursor-pointer ${
                      d.total > 0
                        ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 group-hover:from-emerald-600 group-hover:to-emerald-400 shadow-amber-500/10"
                        : "bg-stone-800/60 group-hover:bg-stone-700/80"
                    }`}
                  ></div>

                  {/* Label Hari & Tanggal */}
                  <div className="text-center mt-1">
                    <p className="text-[10px] font-bold text-stone-300 font-sans">{d.dayName}</p>
                    <p className="text-[8px] text-stone-500 font-mono">{d.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[11px] text-stone-500 pt-2 border-t border-stone-800/60">
            <span>Menampilkan akumulasi omset kasir per hari dalam 7 hari terakhir.</span>
            <span className="font-mono text-amber-500 font-semibold">Hover bar untuk omset harian</span>
          </div>
        </div>

        {/* MONITORING STOK */}
        <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" /> Ketersediaan Stok
              </h2>
              <span className="text-[10px] text-stone-400 font-mono">{safeStocks.length} Item</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {safeStocks.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">Belum ada data stok</p>
              ) : (
                safeStocks.slice(0, 5).map((item: any, i: number) => {
                  const current = Number(item?.amount || 0);
                  const min = Number(item?.min || 1);
                  const percent = Math.min(100, Math.round((current / (min * 3)) * 100));
                  const isLow = current <= min;

                  return (
                    <div key={i} className="p-2.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-stone-200">{item?.name || "Bahan"}</span>
                        <span className={`font-mono text-[11px] ${isLow ? "text-red-400 font-bold" : "text-stone-400"}`}>
                          {current} {item?.unit || "unit"}
                        </span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${percent}%` }}
                          className={`h-full transition-all duration-500 rounded-full ${
                            isLow ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800/60">
            <p className="text-[11px] text-stone-500 text-center">
              Warna <span className="text-red-400 font-semibold">Merah</span> menandakan stok kritis di bawah minimum.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}