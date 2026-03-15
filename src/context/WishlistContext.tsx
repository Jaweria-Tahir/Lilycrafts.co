import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  count: number;
  isOpen: boolean; 
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("lilycrafts-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lilycrafts-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId: number) => 
    wishlist.some(p => p.id === productId), 
  [wishlist]);

  // UPDATED TOGGLE LOGIC: This ensures the item is REMOVED if clicked while active
  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const isCurrentlyIn = prev.some(p => p.id === product.id);
      if (isCurrentlyIn) {
        // If it's in the bag, filter it out (Remove)
        return prev.filter(p => p.id !== product.id);
      }
      // Otherwise, add it
      return [...prev, product];
    });
  }, []);

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      toggleWishlist, 
      count: wishlist.length,
      isOpen,
      openWishlist,
      closeWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}