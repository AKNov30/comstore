import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product";

type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: Record<string, CartItem>; // key = product.id
};

type CartContextType = {
  items: CartItem[];
  count: number; // รวม qty ทั้งหมด
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = "cart_state_v1";

function loadInitial(): CartState {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch {}
  return { items: {} };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CartState>(loadInitial);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  }, [state]);

  const addItem: CartContextType["addItem"] = (product, qty = 1) => {
    setState(prev => {
      const cur = { ...prev.items };
      const exist = cur[product.id];
      if (exist) {
        cur[product.id] = { ...exist, qty: exist.qty + qty };
      } else {
        cur[product.id] = { product, qty };
      }
      return { items: cur };
    });
  };

  const removeItem: CartContextType["removeItem"] = (productId) => {
    setState(prev => {
      const cur = { ...prev.items };
      delete cur[productId];
      return { items: cur };
    });
  };

  const clear = () => setState({ items: {} });

  const items = useMemo(() => Object.values(state.items), [state.items]);
  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value = useMemo<CartContextType>(() => ({ items, count, addItem, removeItem, clear }), [items, count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
