import React from "react";
import { Download, Calendar } from "lucide-react";

export function ReportsTab({
  handleDownloadExcel,
  getTotalIncome,
  getTotalExpense,
  getNetProfit,
  transactions,
  expenses,
}: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Laporan Keuangan & Transaksi</h1>
          <p className="text-xs text-stone-400">Rekapitulasi omset dari kasir dan beban restock gudang.</p>
        </div>

        <button
          onClick={handleDownloadExcel}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" /> Download Laporan Excel (.xlsx)
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-stone-900/80 border border-stone-800 rounded-2xl">
          <span className="text-xs text-stone-400">Total Pemasukan (Omset)</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            Rp {getTotalIncome ? getTotalIncome().toLocaleString("id-ID") : 0}
          </p>
        </div>
        <div className="p-5 bg-stone-900/80 border border-stone-800 rounded-2xl">
          <span className="text-xs text-stone-400">Total Pengeluaran (Restock)</span>
          <p className="text-2xl font-bold text-red-400 font-mono mt-1">
            Rp {getTotalExpense ? getTotalExpense().toLocaleString("id-ID") : 0}
          </p>
        </div>
        <div className="p-5 bg-stone-900/80 border border-stone-800 rounded-2xl">
          <span className="text-xs text-stone-400">Keuntungan Bersih</span>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
            Rp {getNetProfit ? getNetProfit().toLocaleString("id-ID") : 0}
          </p>
        </div>
      </div>

      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-stone-800 font-bold text-xs text-stone-200 flex justify-between items-center">
          <span>Riwayat Transaksi Penjualan Kasir</span>
          <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Format Tanggal: DD-MM-YYYY
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
            <tr>
              <th className="p-4">ID TRX</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Waktu</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Detail Items</th>
              <th className="p-4">Metode</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-stone-500">Belum ada transaksi kasir.</td>
              </tr>
            ) : (
              transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-stone-800/30">
                  <td className="p-4 font-mono text-amber-400">{t.id}</td>
                  <td className="p-4 font-mono text-stone-300">{t.fullDate}</td>
                  <td className="p-4 text-stone-400">{t.time}</td>
                  <td className="p-4 font-medium text-stone-200">{t.customerName}</td>
                  <td className="p-4 text-stone-300">
                    {t.items.map((i: any) => `${i.qty}x ${i.name}`).join(", ")}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded text-[10px]">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-stone-100">
                    Rp {t.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-stone-800 font-bold text-xs text-red-400">
          Riwayat Pengeluaran / Restock Bahan Baku Gudang
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
            <tr>
              <th className="p-4">ID EXP</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Waktu</th>
              <th className="p-4">Nama Bahan</th>
              <th className="p-4">Jumlah Tambahan</th>
              <th className="p-4 text-right">Total Biaya</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-stone-500">Belum ada riwayat restock gudang.</td>
              </tr>
            ) : (
              expenses.map((e: any) => (
                <tr key={e.id} className="hover:bg-stone-800/30">
                  <td className="p-4 font-mono text-red-400">{e.id}</td>
                  <td className="p-4 font-mono text-stone-300">{e.fullDate}</td>
                  <td className="p-4 text-stone-400">{e.time}</td>
                  <td className="p-4 font-medium text-stone-200">{e.itemName}</td>
                  <td className="p-4 text-stone-300 font-mono">
                    +{e.amountAdded} {e.unit}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-red-400">
                    - Rp {e.totalCost.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}