"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number; // IQD
  size: string | null;
  color: string | null;
  qty: number;
};

export const cartKey = (it: Pick<CartItem, "id" | "size" | "color">) => `${it.id}::${it.size ?? ""}::${it.color ?? ""}`;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const LS_KEY = "bably-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    return {
      items,
      subtotal,
      count: items.reduce((s, it) => s + it.qty, 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item, qty = 1) => {
        setItems((prev) => {
          const k = cartKey(item);
          const found = prev.find((it) => cartKey(it) === k);
          if (found) {
            return prev.map((it) => (cartKey(it) === k ? { ...it, qty: Math.min(it.qty + qty, 10) } : it));
          }
          return [...prev, { ...item, qty }];
        });
        setIsOpen(true);
      },
      updateQty: (key, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((it) => cartKey(it) !== key) : prev.map((it) => (cartKey(it) === key ? { ...it, qty: Math.min(qty, 10) } : it))
        ),
      removeItem: (key) => setItems((prev) => prev.filter((it) => cartKey(it) !== key)),
      clear: () => setItems([]),
      hydrated,
    };
  }, [items, isOpen, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
