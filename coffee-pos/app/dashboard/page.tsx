"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import * as XLSX from "xlsx";
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  BarChart3,
  Users,
  LogOut,
  UserCheck,
} from "lucide-react";

import { OverviewTab } from "./components/OverviewTab";
import { PosTab } from "./components/PosTab";
import { InventoryTab } from "./components/InventoryTab";
import { ReportsTab } from "./components/ReportsTab";
import { UsersTab } from "./components/UsersTab";
import { CustomersTab } from "./components/CustomersTab";

interface UserSession {
  email: string;
  role: "admin" | "kasir" | "gudang";
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isMounted, setIsMounted] = useState(false);

  const {
    products = [],
    stocks = [],
    transactions = [],
    expenses = [],
    customers = [],
    addTransaction,
    restockItem,
    addCustomer,
    getTotalIncome,
    getTotalExpense,
    getNetProfit,
  } = useApp();

  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Tunai">("QRIS");

  const [userList, setUserList] = useState([
    { id: 1, name: "Super Admin", email: "admin@coffee.com", role: "admin", status: "Aktif" },
    { id: 2, name: "Kasir - Budi", email: "kasir@coffee.com", role: "kasir", status: "Aktif" },
    { id: 3, name: "Staff Gudang - Agus", email: "gudang@coffee.com", role: "gudang", status: "Aktif" },
  ]);

  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }

    const parsedUser: UserSession = JSON.parse(session);
    setUser(parsedUser);

    if (parsedUser.role === "admin") setActiveTab("overview");
    else if (parsedUser.role === "kasir") setActiveTab("pos");
    else if (parsedUser.role === "gudang") setActiveTab("inventory");
  }, [router]);

  if (!isMounted || !user) return null;

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === product.id);
      if (exist) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const totalCart = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  // HANDLE CHECKOUT TERBARU: DENGAN DUKUNGAN MEMAKAI VOUCHER & DISKON
  const handleCheckout = (usedVoucher?: string, discountAmount: number = 0) => {
    if (cart.length === 0) return;
    addTransaction(cart, paymentMethod, selectedCustomerId, usedVoucher, discountAmount);
    setPaymentSuccess(true);
    setCart([]);
    setSelectedCustomerId(null);
    setTimeout(() => setPaymentSuccess(false), 3500);
  };

  const handleAddUser = (newUser: any) => {
    setUserList((prev) => [
      ...prev,
      { id: prev.length + 1, name: newUser.name, email: newUser.email, role: newUser.role, status: "Aktif" },
    ]);
  };

  const handleDownloadExcel = () => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");

    const trxData = transactions.map((t) => ({
      "ID Transaksi": t.id,
      "Tanggal": t.fullDate || todayStr,
      "Waktu": t.time,
      "Nama Pelanggan": t.customerName || "Non-Member",
      "Detail Items": t.items.map((i) => `${i.qty}x ${i.name}`).join(", "),
      "Metode Bayar": t.paymentMethod,
      "Voucher Digunakan": t.usedVoucher || "-",
      "Potongan Diskon (Rp)": t.discountAmount || 0,
      "Total Bayar (Rp)": t.total,
    }));

    const expData = expenses.map((e) => ({
      "ID Pengeluaran": e.id,
      "Tanggal": e.fullDate || todayStr,
      "Waktu": e.time,
      "Nama Bahan Baku": e.itemName,
      "Jumlah Restock": `+${e.amountAdded} ${e.unit}`,
      "Total Biaya (Rp)": e.totalCost,
    }));

    const summaryData = [
      { "Keterangan": "Total Pemasukan (Omset)", "Nilai (Rp)": getTotalIncome() },
      { "Keterangan": "Total Pengeluaran (Restock)", "Nilai (Rp)": getTotalExpense() },
      { "Keterangan": "Keuntungan Bersih", "Nilai (Rp)": getNetProfit() },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "Ringkasan");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(trxData), "Penjualan Kasir");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expData), "Restock Gudang");

    XLSX.writeFile(wb, `Laporan_NEXACOFFEE_${todayStr}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-stone-900/90 border-r border-stone-800/80 flex flex-col justify-between shrink-0 p-4">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-stone-800">
            <div className="w-10 h-10 bg-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-stone-100 leading-tight">
                NEXA<span className="text-amber-500">COFFEE</span>
              </h2>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                POS System
              </p>
            </div>
          </div>

          <div className="px-3 py-2.5 mb-6 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-200">{user.name}</p>
              <p className="text-[10px] text-amber-400 font-mono capitalize">Role: {user.role}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <nav className="space-y-1">
            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Ringkasan Bisnis
              </button>
            )}

            {(user.role === "admin" || user.role === "kasir") && (
              <button
                onClick={() => setActiveTab("pos")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "pos"
                    ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <ShoppingCart className="w-4 h-4" /> Kasir & Transaksi
              </button>
            )}

            {(user.role === "admin" || user.role === "gudang") && (
              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "inventory"
                    ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <Boxes className="w-4 h-4" /> Stok & Bahan Baku
              </button>
            )}

            {user.role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "reports"
                      ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                      : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Laporan Keuangan
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "users"
                      ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                      : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                  }`}
                >
                  <Users className="w-4 h-4" /> Kelola Pengguna
                </button>
              </>
            )}

            {(user.role === "admin" || user.role === "kasir") && (
              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "customers"
                    ? "bg-amber-600 text-stone-950 font-semibold shadow-lg shadow-amber-600/20"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <UserCheck className="w-4 h-4" /> Kelola Pelanggan
              </button>
            )}
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user_session");
            router.push("/login");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar Sistem
        </button>
      </aside>

      {/* MAIN CONTENT COMPONENT */}
      <main className="flex-1 bg-stone-950 p-8 overflow-y-auto">
        {activeTab === "overview" && user.role === "admin" && (
          <OverviewTab
            getTotalIncome={getTotalIncome}
            getNetProfit={getNetProfit}
            transactions={transactions}
            stocks={stocks}
          />
        )}

        {activeTab === "pos" && (user.role === "admin" || user.role === "kasir") && (
          <PosTab
            products={products}
            addToCart={addToCart}
            safeCustomers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentSuccess={paymentSuccess}
            cart={cart}
            setCart={setCart}
            totalCart={totalCart}
            handleCheckout={handleCheckout}
          />
        )}

        {activeTab === "inventory" && (user.role === "admin" || user.role === "gudang") && (
          <InventoryTab stocks={stocks} restockItem={restockItem} />
        )}

        {activeTab === "reports" && user.role === "admin" && (
          <ReportsTab
            handleDownloadExcel={handleDownloadExcel}
            getTotalIncome={getTotalIncome}
            getTotalExpense={getTotalExpense}
            getNetProfit={getNetProfit}
            transactions={transactions}
            expenses={expenses}
          />
        )}

        {activeTab === "users" && user.role === "admin" && (
          <UsersTab userList={userList} handleAddUser={handleAddUser} />
        )}

        {activeTab === "customers" && (user.role === "admin" || user.role === "kasir") && (
          <CustomersTab customers={customers} addCustomer={addCustomer} />
        )}
      </main>
    </div>
  );
}