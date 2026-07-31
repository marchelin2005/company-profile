"use client";

import React, { useState } from "react";
import { Coffee, ShoppingCart, CheckCircle2, X, Trash2, Ticket, Printer, Receipt } from "lucide-react";

export function PosTab({
  products,
  addToCart,
  safeCustomers,
  selectedCustomerId,
  setSelectedCustomerId,
  paymentMethod,
  setPaymentMethod,
  paymentSuccess,
  cart,
  setCart,
  totalCart,
  handleCheckout,
}: any) {
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");

  // State untuk menyimpan data Struk yang baru selesai dibayar
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // CLEANING DATA
  const rawCustomers = safeCustomers || [];
  const cleanCustomers = rawCustomers.reduce((acc: any[], current: any) => {
    if (!current || !current.name) return acc;
    
    const cleanName = current.name.toLowerCase().trim();
    if (cleanName === "albert") return acc;
    if (cleanName === "yoga" && !String(current.id).startsWith("cust_")) return acc;

    const isExist = acc.some(
      (c) =>
        c.name.toLowerCase().trim() === cleanName ||
        String(c.id) === String(current.id)
    );

    if (!isExist) acc.push(current);
    return acc;
  }, []);

  // Ambil data customer yang terpilih
  const currentCustomer = cleanCustomers.find(
    (c: any) => String(c.id) === String(selectedCustomerId)
  );
  const availableVouchers: string[] = currentCustomer?.vouchers || [];

  // Hitung Nilai Potongan Voucher
  let discountAmount = 0;
  if (selectedVoucher === "POTONGAN_5K") discountAmount = 5000;
  else if (selectedVoucher === "POTONGAN_10K") discountAmount = 10000;
  else if (selectedVoucher === "FREE_1_COFFEE") {
    discountAmount = Math.min(22000, totalCart);
  }

  const finalTotal = Math.max(0, totalCart - discountAmount);

  const handleRemoveItem = (id: number) => {
    if (setCart) setCart((prev: any[]) => prev.filter((item) => item.id !== id));
  };

  const handleCancelAll = () => {
    if (setCart) {
      setCart([]);
      setSelectedVoucher("");
    }
  };

  // PROSES BAYAR & TAMPILKAN POP-UP STRUK
  const onProcessCheckout = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    // 1. Snapshot data transaksi untuk Struk
    const snapshotReceipt = {
      trxId: `#TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: dateStr,
      time: timeStr,
      customerName: currentCustomer ? currentCustomer.name : "Pelanggan Umum",
      items: [...cart],
      subtotal: totalCart,
      discount: discountAmount,
      voucherName: selectedVoucher,
      finalTotal,
      paymentMethod,
    };

    // 2. Simpan ke database via props handleCheckout
    handleCheckout(selectedVoucher, discountAmount);

    // 3. Tampilkan Pop-up Struk
    setReceiptData(snapshotReceipt);
    setShowReceiptModal(true);

    // 4. Reset pilihan voucher
    setSelectedVoucher("");
  };

  // FUNGSI CETAK STRUK PRINTER
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <>
      {/* CSS PRINTER ISOLASI TOTAL (100% PUTIH & PAS DI TENGAH) */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            background: #ffffff;
          }
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 50% !important;
            top: 20mm !important;
            transform: translateX(-50%) !important;
            width: 300px !important;
            margin: 0 !important;
            padding: 15px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* DASHBOARD KASIR */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
        {/* KATALOG MENU (KIRI) */}
        <div className="col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-500" /> Katalog Menu Kasir
                </h1>
                <p className="text-xs text-stone-400">Klik item untuk menambahkan ke keranjang belanja.</p>
              </div>
              <span className="px-3 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-semibold">
                {products.length} Menu Tersedia
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {products.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="group relative p-4 bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl text-left transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 active:scale-95"
                >
                  <div className="w-10 h-10 bg-amber-950/50 border border-amber-800/50 group-hover:border-amber-500/60 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <Coffee className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-sm text-stone-200 group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono font-bold mt-1">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-stone-900/50 border border-stone-800/60 rounded-xl text-[11px] text-stone-500 flex justify-between items-center">
            <span>💡 Poin member bertambah otomatis setiap transaksi selesai.</span>
            <span className="font-mono text-stone-400">POS v2.4</span>
          </div>
        </div>

        {/* STRUK TRANSAKSI (KANAN) */}
        <div className="bg-stone-900/90 border border-stone-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-800">
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-500" /> Rincian Pesanan
              </h2>

              {cart.length > 0 && (
                <button
                  onClick={handleCancelAll}
                  className="text-[10px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/50 px-2.5 py-1 border border-red-900/60 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Batal Semua
                </button>
              )}
            </div>

            {/* PILIH MEMBER */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                Pelanggan / Member:
              </label>
              <select
                value={selectedCustomerId || ""}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value || null);
                  setSelectedVoucher("");
                }}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">-- Non-Member --</option>
                {cleanCustomers.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.points || 0} Pts)
                  </option>
                ))}
              </select>
            </div>

            {/* PILIH VOUCHER */}
            {selectedCustomerId && availableVouchers.length > 0 && (
              <div className="mb-3 p-2.5 bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-500/40 rounded-xl">
                <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <Ticket className="w-3.5 h-3.5" /> Voucher Member Tersedia:
                </label>
                <select
                  value={selectedVoucher}
                  onChange={(e) => setSelectedVoucher(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 outline-none font-medium"
                >
                  <option value="">-- Tanpa Voucher --</option>
                  {availableVouchers.map((v, i) => (
                    <option key={i} value={v}>
                      {v === "POTONGAN_5K"
                        ? "🎟️ Diskon Rp 5.000"
                        : v === "POTONGAN_10K"
                        ? "🎟️ Diskon Rp 10.000"
                        : v === "FREE_1_COFFEE"
                        ? "☕ Gratis 1 Kopi (Max 22k)"
                        : v}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* METODE BAYAR */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                Metode Pembayaran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    paymentMethod === "QRIS"
                      ? "bg-amber-600 text-stone-950 border-amber-500 shadow-lg shadow-amber-600/20"
                      : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
                  }`}
                >
                  QRIS
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Tunai")}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    paymentMethod === "Tunai"
                      ? "bg-amber-600 text-stone-950 border-amber-500 shadow-lg shadow-amber-600/20"
                      : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
                  }`}
                >
                  Tunai
                </button>
              </div>
            </div>

            {paymentSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pembayaran Berhasil!
              </div>
            )}

            {/* LIST KERANJANG */}
            {cart.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-stone-800 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                <p className="text-xs text-stone-500">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {cart.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center text-xs p-2.5 bg-stone-950 rounded-xl border border-stone-800/80 hover:border-stone-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-stone-200">{c.name}</p>
                      <p className="text-stone-400 font-mono text-[11px]">
                        {c.qty}x @ Rp {c.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <p className="font-mono text-amber-400 font-bold">
                        Rp {(c.price * c.qty).toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(c.id)}
                        className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-950/60 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOTAL BAYAR & ACTION BUTTON */}
          <div className="pt-3 border-t border-stone-800 space-y-2.5">
            {discountAmount > 0 && (
              <div className="space-y-1 text-xs font-mono bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span>Rp {totalCart.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Diskon Voucher:</span>
                  <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-stone-400 font-medium">Total Akhir:</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                Rp {finalTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={onProcessCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/10 active:scale-[0.99]"
            >
              <Receipt className="w-4 h-4" /> Proses Bayar & Cetak Struk
            </button>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL STRUK */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-[340px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* HEADER MODAL */}
            <div className="px-4 py-3 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Transaksi Berhasil
              </span>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AREA STRUK HASIL CETAK */}
            <div className="p-5 overflow-y-auto bg-white text-black font-mono text-[11px] leading-tight" id="printable-receipt">
              <div className="text-center space-y-0.5 mb-3 pb-2 border-b border-dashed border-gray-400">
                <h2 className="text-sm font-bold tracking-widest uppercase">NEXA COFFEE</h2>
                <p className="text-[9px] text-gray-600">Jl. Kopi Utama No. 88, Surakarta</p>
                <p className="text-[9px] text-gray-600">Telp: 0812-3456-7890</p>
              </div>

              <div className="space-y-0.5 mb-2.5 pb-2 border-b border-dashed border-gray-400 text-[10px]">
                <div className="flex justify-between">
                  <span>ID Trx:</span>
                  <span className="font-bold">{receiptData.trxId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{receiptData.date} {receiptData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-semibold">{receiptData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode:</span>
                  <span>{receiptData.paymentMethod}</span>
                </div>
              </div>

              {/* LIST ITEM STRUK */}
              <div className="space-y-1.5 mb-2.5 pb-2 border-b border-dashed border-gray-400">
                {receiptData.items.map((item: any, i: number) => (
                  <div key={i}>
                    <p className="font-bold uppercase text-[10px]">{item.name}</p>
                    <div className="flex justify-between text-[10px] text-gray-700">
                      <span>{item.qty} x Rp {item.price.toLocaleString("id-ID")}</span>
                      <span>Rp {(item.qty * item.price).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* RINCIAN TOTAL */}
              <div className="space-y-0.5 mb-3 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {receiptData.subtotal.toLocaleString("id-ID")}</span>
                </div>
                {receiptData.discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Diskon Voucher:</span>
                    <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300 mt-1">
                  <span>TOTAL BAYAR:</span>
                  <span>Rp {receiptData.finalTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-gray-400 space-y-0.5">
                <p className="font-bold text-[10px]">*** TERIMA KASIH ***</p>
                <p className="text-[8px] text-gray-500">Semoga Harimu Menyenangkan!</p>
              </div>
            </div>

            {/* FOOTER ACTION BUTTONS */}
            <div className="p-3 bg-stone-950 border-t border-stone-800 flex gap-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/10 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Struk
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-xl transition-all active:scale-95"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}