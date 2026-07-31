"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Award, Ticket, History, LogOut, CheckCircle2, Gift } from "lucide-react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

interface CustomerSession {
  email: string;
  name: string;
  role: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CustomerSession | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [myVouchers, setMyVouchers] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(session);
    if (parsedUser.role !== "pelanggan") {
      router.push("/dashboard");
      return;
    }
    setUser(parsedUser);

    // Fetch data user & poin realtime dari Firestore (Koleksi "users")
    const unsubUser = onSnapshot(collection(db, "users"), (snapshot) => {
      const currentUser = snapshot.docs.find((d) => d.data().email === parsedUser.email);
      if (currentUser) {
        const uData = currentUser.data();
        setPoints(uData.points || 0);
        setMyVouchers(uData.vouchers || []);
      }
    });

    // Fetch riwayat transaksi milik user ini berdasarkan nama
    const qTrx = query(
      collection(db, "transactions"),
      where("customerName", "==", parsedUser.name)
    );
    const unsubTrx = onSnapshot(qTrx, (snapshot) => {
      const data = snapshot.docs.map((docItem) => docItem.data());
      setTransactions(data);
    });

    return () => {
      unsubUser();
      unsubTrx();
    };
  }, [router]);

  // FUNGSI TUKAR VOUCHER (MEN_UPDATE USERS & CUSTOMERS SECARA SINKRON)
  const handleRedeemVoucher = async (cost: number, voucherName: string) => {
    if (points < cost) {
      setMsg(`Poin kamu kurang! Butuh ${cost} poin.`);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    try {
      const newPoints = points - cost;
      const updatedVouchers = [...myVouchers, voucherName];

      // 1. Update di koleksi "users"
      const qUser = query(collection(db, "users"), where("email", "==", user?.email));
      const userSnap = await getDocs(qUser);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          points: newPoints,
          vouchers: updatedVouchers,
        });
      }

      // 2. Update di koleksi "customers" (Cari berdasarkan Nama / Email agar pasti ketemu)
      let custSnap = await getDocs(
        query(collection(db, "customers"), where("name", "==", user?.name))
      );

      if (custSnap.empty && user?.email) {
        custSnap = await getDocs(
          query(collection(db, "customers"), where("email", "==", user.email))
        );
      }

      // Update seluruh dokumen customer yang terhubung
      if (!custSnap.empty) {
        const updatePromises = custSnap.docs.map((cDoc) =>
          updateDoc(doc(db, "customers", cDoc.id), {
            points: newPoints,
          })
        );
        await Promise.all(updatePromises);
      }

      setMsg(`Berhasil menukar voucher ${voucherName}! Sisa poin: ${newPoints} PTS`);
      setTimeout(() => setMsg(""), 3500);
    } catch (e) {
      console.error("Gagal menukar voucher:", e);
      setMsg("Terjadi kesalahan saat menukar voucher.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER NAVBAR */}
        <header className="flex justify-between items-center bg-stone-900 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-bold text-stone-100">
                NEXA<span className="text-amber-500">MEMBER</span> PORTAL
              </h1>
              <p className="text-xs text-stone-400">
                Selamat Datang,{" "}
                <span className="text-amber-400 font-semibold">{user.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("user_session");
              router.push("/login");
            }}
            className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-400 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </header>

        {msg && (
          <div className="p-3 bg-amber-950/80 border border-amber-500/50 text-amber-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" /> {msg}
          </div>
        )}

        {/* CARD POIN & TIER */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 p-6 bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/30 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-amber-400/80 font-medium tracking-wider uppercase">
                Saldo Poin Kamu
              </span>
              <p className="text-4xl font-extrabold text-amber-400 font-mono mt-1">
                {points} PTS
              </p>
              <p className="text-[11px] text-stone-400 mt-2">
                Dapatkan +10 poin setiap belanja kelipatan Rp 10.000 di kasir.
              </p>
            </div>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center">
              <Award className="w-9 h-9 text-amber-500" />
            </div>
          </div>

          <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-stone-400">Status Member</span>
              <p className="text-xl font-bold text-stone-100 mt-1">
                {points >= 100 ? "GOLD MEMBER" : points >= 50 ? "SILVER MEMBER" : "BRONZE MEMBER"}
              </p>
            </div>
            <p className="text-[10px] text-stone-500">
              Tingkatkan transaksi untuk mencapai Gold Tier.
            </p>
          </div>
        </div>

        {/* TUKAR POIN DENGAN VOUCHER */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" /> Tukar Poin Dengan Voucher
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
              <div>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] rounded font-mono font-bold">
                  50 POIN
                </span>
                <h3 className="font-semibold text-xs text-stone-200 mt-2">
                  Voucher Potongan Rp 5.000
                </h3>
              </div>
              <button
                onClick={() => handleRedeemVoucher(50, "POTONGAN_5K")}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[11px] rounded-lg transition-all"
              >
                Tukar Voucher
              </button>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
              <div>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] rounded font-mono font-bold">
                  100 POIN
                </span>
                <h3 className="font-semibold text-xs text-stone-200 mt-2">
                  Voucher Potongan Rp 10.000
                </h3>
              </div>
              <button
                onClick={() => handleRedeemVoucher(100, "POTONGAN_10K")}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[11px] rounded-lg transition-all"
              >
                Tukar Voucher
              </button>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
              <div>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] rounded font-mono font-bold">
                  200 POIN
                </span>
                <h3 className="font-semibold text-xs text-stone-200 mt-2">
                  Gratis 1 Kopi Bebas Pilih
                </h3>
              </div>
              <button
                onClick={() => handleRedeemVoucher(200, "FREE_1_COFFEE")}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[11px] rounded-lg transition-all"
              >
                Tukar Voucher
              </button>
            </div>
          </div>
        </div>

        {/* VOUCHER SAYA */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-500" /> Voucher Saya
          </h2>
          {myVouchers.length === 0 ? (
            <p className="text-xs text-stone-500">Belum ada voucher yang ditukarkan.</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {myVouchers.map((v, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-amber-950/60 border border-amber-500/50 text-amber-300 font-mono text-xs rounded-xl flex items-center gap-2"
                >
                  <Ticket className="w-3.5 h-3.5" /> {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RIWAYAT PEMBELIAN */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-stone-800 font-bold text-xs text-stone-200 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" /> Riwayat Pembelian Kamu
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
              <tr>
                <th className="p-4">ID Transaksi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Detail Menu</th>
                <th className="p-4 text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-stone-500">
                    Belum ada riwayat transaksi dengan nama akun ini.
                  </td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-stone-800/30">
                    <td className="p-4 font-mono text-amber-400">{t.id}</td>
                    <td className="p-4 font-mono text-stone-300">
                      {t.fullDate} ({t.time})
                    </td>
                    <td className="p-4 text-stone-200">
                      {t.items?.map((i: any) => `${i.qty}x ${i.name}`).join(", ")}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      Rp {t.total?.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}