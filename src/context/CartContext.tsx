import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product, CartItem } from "@/data/products";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("lilycrafts-cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lilycrafts-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    // Math.max(1, quantity) ensures we never accidentally add 0 or negative items
    const validQuantity = Math.max(1, quantity);

    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      
      if (existing) {
        // Fix: Instead of adding to existing (i.quantity + validQuantity), 
        // we set it directly to the new quantity to prevent accidental doubles.
        return prev.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: validQuantity } 
            : i
        );
      }
      
      return [...prev, { product, quantity: validQuantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(() => {
    return items.reduce((acc, item) => ({
      count: acc.count + item.quantity,
      price: acc.price + (Number(item.product.price) * item.quantity)
    }), { count: 0, price: 0 });
  }, [items]);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems: totals.count, 
      totalPrice: totals.price, 
      isOpen, 
      openCart, 
      closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}