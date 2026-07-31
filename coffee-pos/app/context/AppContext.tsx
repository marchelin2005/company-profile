"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  arrayRemove,
} from "firebase/firestore";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  recipe: { stockId: number; amountNeeded: number }[];
}

export interface StockItem {
  id: number;
  name: string;
  amount: number;
  min: number;
  unit: string;
  costPerUnit: number;
}

export interface Transaction {
  id: string;
  fullDate: string;
  time: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod: "QRIS" | "Tunai";
  customerName?: string;
  usedVoucher?: string | null;
  discountAmount?: number;
}

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  points: number;
  tier: "Gold" | "Silver" | "Bronze" | string;
  vouchers?: string[];
}

export interface Expense {
  id: string;
  fullDate: string;
  time: string;
  itemName: string;
  amountAdded: number;
  unit: string;
  totalCost: number;
}

interface AppContextType {
  products: Product[];
  stocks: StockItem[];
  transactions: Transaction[];
  expenses: Expense[];
  customers: Customer[];
  addTransaction: (
    cart: { id: number; name: string; price: number; qty: number }[],
    paymentMethod: "QRIS" | "Tunai",
    customerId?: string | number | null,
    usedVoucher?: string | null,
    discountAmount?: number
  ) => Promise<void>;
  restockItem: (stockId: number, addAmount: number) => Promise<void>;
  addCustomer: (name: string, phone: string) => Promise<void>;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getNetProfit: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getFormattedDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // KATALOG PRODUK BEVERAGE / COFFEE LENGKAP DENGAN RESEP PEMOTONGAN STOK GUDANG
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Espresso Double",
      price: 18000,
      category: "Coffee",
      recipe: [{ stockId: 1, amountNeeded: 0.02 }],
    },
    {
      id: 2,
      name: "Iced Caramel Latte",
      price: 28000,
      category: "Coffee",
      recipe: [
        { stockId: 1, amountNeeded: 0.015 },
        { stockId: 2, amountNeeded: 0.2 },
        { stockId: 3, amountNeeded: 0.05 },
        { stockId: 4, amountNeeded: 1 },
      ],
    },
    {
      id: 3,
      name: "Americano Hot/Ice",
      price: 22000,
      category: "Coffee",
      recipe: [
        { stockId: 1, amountNeeded: 0.015 },
        { stockId: 4, amountNeeded: 1 },
      ],
    },
    {
      id: 4,
      name: "Vanilla Cold Brew",
      price: 30000,
      category: "Coffee",
      recipe: [
        { stockId: 1, amountNeeded: 0.025 },
        { stockId: 3, amountNeeded: 0.04 },
        { stockId: 4, amountNeeded: 1 },
      ],
    },
    {
      id: 5,
      name: "Matcha Milk Latte",
      price: 26000,
      category: "Non-Coffee",
      recipe: [
        { stockId: 2, amountNeeded: 0.25 },
        { stockId: 4, amountNeeded: 1 },
      ],
    },
    {
      id: 6,
      name: "Hazelnut Cappuccino",
      price: 29000,
      category: "Coffee",
      recipe: [
        { stockId: 1, amountNeeded: 0.02 },
        { stockId: 2, amountNeeded: 0.18 },
        { stockId: 4, amountNeeded: 1 },
      ],
    },
  ]);

  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // 1. LISTEN REALTIME DATA DARI FIRESTORE
  useEffect(() => {
    const unsubStocks = onSnapshot(collection(db, "stocks"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as StockItem);
      setStocks(data.sort((a, b) => a.id - b.id));
    });

    const unsubTrx = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as Transaction);
      setTransactions(data);
    });

    const unsubExp = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as Expense);
      setExpenses(data);
    });

    const unsubCust = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs
        .map(
          (docItem) =>
            ({
              id: docItem.id,
              ...(docItem.data() as object),
            } as Customer & { role?: string })
        )
        .filter((c) => c.role === "pelanggan" || !c.role);

      const uniqueCustomers = Array.from(
        new Map(data.map((item) => [String(item.id), item])).values()
      );
      setCustomers(uniqueCustomers);
    });

    return () => {
      unsubStocks();
      unsubTrx();
      unsubExp();
      unsubCust();
    };
  }, []);

  // 2. SIMPAN TRANSAKSI, DIPOTONG DISKON VOUCHER, & POTONG VOUCHER DARI FIRESTORE
  const addTransaction = async (
    cart: { id: number; name: string; price: number; qty: number }[],
    paymentMethod: "QRIS" | "Tunai",
    customerId?: string | number | null,
    usedVoucher?: string | null,
    discountAmount: number = 0
  ) => {
    const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const now = new Date();
    const timeString =
      now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    const customerObj = customerId
      ? customers.find((c) => String(c.id) === String(customerId))
      : null;

    const newTrx: Transaction = {
      id: `#TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      fullDate: getFormattedDate(),
      time: timeString,
      items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })),
      total: finalTotal,
      paymentMethod,
      customerName: customerObj ? customerObj.name : "Non-Member",
      usedVoucher: usedVoucher || null,
      discountAmount,
    };

    await addDoc(collection(db, "transactions"), newTrx);

    // Potong Stok Gudang Sesuai Resep Produk
    for (const cartItem of cart) {
      const prod = products.find((p) => p.id === cartItem.id);
      if (prod && prod.recipe && prod.recipe.length > 0) {
        for (const ingredient of prod.recipe) {
          const currentStock = stocks.find((s) => s.id === ingredient.stockId);
          if (currentStock) {
            const totalUsed = ingredient.amountNeeded * cartItem.qty;
            const newAmount = Math.max(
              0,
              Number((currentStock.amount - totalUsed).toFixed(3))
            );
            await updateDoc(doc(db, "stocks", currentStock.id.toString()), {
              amount: newAmount,
            });
          }
        }
      }
    }

    // Update Poin & Hapus Voucher Terpakai di Firebase
    if (customerId && customerObj) {
      const custStrId = String(customerId);
      const addedPoints = Math.floor(finalTotal / 10000) * 10;
      const updatedPoints = (customerObj.points || 0) + addedPoints;

      let tier: "Gold" | "Silver" | "Bronze" = "Bronze";
      if (updatedPoints >= 100) tier = "Gold";
      else if (updatedPoints >= 50) tier = "Silver";

      const updateData: any = { points: updatedPoints, tier };

      if (usedVoucher) {
        updateData.vouchers = arrayRemove(usedVoucher);
      }

      try {
        const userRef = doc(db, "users", custStrId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          await updateDoc(userRef, updateData);
        }
      } catch (err) {
        console.error("Gagal update user:", err);
      }

      try {
        const custRef = doc(db, "customers", custStrId);
        const custSnap = await getDoc(custRef);
        if (custSnap.exists()) {
          await updateDoc(custRef, { points: updatedPoints, tier });
        }
      } catch (err) {
        console.error("Gagal update customer:", err);
      }
    }
  };

  // 3. RESTOCK ITEM
  const restockItem = async (stockId: number, addAmount: number) => {
    const item = stocks.find((s) => s.id === stockId);
    if (!item) return;

    const totalCost = item.costPerUnit * addAmount;
    const newAmount = Number((item.amount + addAmount).toFixed(2));

    await updateDoc(doc(db, "stocks", stockId.toString()), {
      amount: newAmount,
    });

    const newExpense: Expense = {
      id: `#EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullDate: getFormattedDate(),
      time:
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
        " WIB",
      itemName: item.name,
      amountAdded: addAmount,
      unit: item.unit,
      totalCost,
    };

    await addDoc(collection(db, "expenses"), newExpense);
  };

  // 4. TAMBAH CUSTOMER BARU
  const addCustomer = async (name: string, phone: string) => {
    const newStrId = `cust_${Date.now()}`;
    const autoEmail = `${name.toLowerCase().replace(/\s+/g, "")}@coffee.com`;

    await setDoc(doc(db, "users", newStrId), {
      email: autoEmail,
      password: "123",
      name,
      phone,
      role: "pelanggan",
      points: 0,
      vouchers: [],
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(db, "customers", newStrId), {
      id: newStrId,
      name,
      phone,
      points: 0,
      tier: "Bronze",
    });
  };

  const getTotalIncome = () => transactions.reduce((acc, curr) => acc + curr.total, 0);
  const getTotalExpense = () => expenses.reduce((acc, curr) => acc + curr.totalCost, 0);
  const getNetProfit = () => getTotalIncome() - getTotalExpense();

  return (
    <AppContext.Provider
      value={{
        products,
        stocks,
        transactions,
        expenses,
        customers,
        addTransaction,
        restockItem,
        addCustomer,
        getTotalIncome,
        getTotalExpense,
        getNetProfit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};