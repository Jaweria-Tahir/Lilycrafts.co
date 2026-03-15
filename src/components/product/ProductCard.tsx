import React, { useMemo } from 'react';
import { ShoppingCart, Heart, ArrowUpRight, X } from 'lucide-react'; // Added X
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext'; // Import your wishlist hook
import { useCart } from '@/context/CartContext'; // Import your cart hook

interface Product {
  id: string | number;
  name: string;
  price: number;
  images?: string[];
  image?: string;
  image_url?: string;
  category?: string;
  categories?: string[]; 
  description?: string;
  in_stock?: boolean;
  inStock?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  // Hooks
  const { toggleWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isAvailable = product.in_stock !== undefined ? product.in_stock : product.inStock;
  const isFavorite = isInWishlist(Number(product.id));
  const displayCategory = product.categories?.[0] || product.category || "Handmade";

  const imageUrl = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || product.image_url || "https://via.placeholder.com/400?text=No+Image+Found";
  }, [product]);

  return (
    <div className="group relative bg-white/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/40 flex flex-row sm:flex-col h-full">
      
      {/* 1. PROMINENT REMOVE BUTTON (Top Left) - Only shows if in wishlist */}
      {isFavorite && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            removeFromWishlist(Number(product.id));
          }}
          className="absolute top-2 left-2 sm:top-5 sm:left-5 z-20 p-1.5 sm:p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all scale-110 active:scale-90"
          title="Remove from wishlist"
        >
          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>
      )}

      <Link to={`/product/${product.id}`} className="contents">
        <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-rose-50 rounded-l-[1.25rem] sm:rounded-[2.2rem] sm:w-auto sm:m-2 max-sm:m-0 max-sm:border-r border-rose-100/50">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Image+Not+Available";
            }}
          />
          
          {!isAvailable && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest z-10">
              Sold Out
            </div>
          )}

          {/* Floating Heart Button (Top Right) - hidden on mobile to avoid clutter */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:flex">
            <button 
              onClick={(e) => {
                 e.preventDefault();
                 // @ts-ignore - handling potential type mismatch between static/DB product
                 toggleWishlist(product); 
              }}
              className={`p-2 sm:p-3 rounded-full shadow-lg transition-colors backdrop-blur-sm ${
                isFavorite 
                ? "bg-rose-500 text-white" 
                : "bg-white/90 text-slate-400 hover:bg-rose-500 hover:text-white"
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 sm:pt-2 flex flex-col flex-grow min-w-0 justify-center">
          <div className="mb-2 sm:mb-4">
            <div className="flex justify-between items-start mb-0.5 sm:mb-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">
                {displayCategory}
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 group-hover:text-rose-400 transition-colors shrink-0" />
            </div>
            
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 leading-tight group-hover:text-rose-500 transition-colors mb-1 sm:mb-2 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-slate-500 text-[10px] sm:text-xs italic line-clamp-2 leading-relaxed min-h-0 sm:min-h-[32px]">
              {product.description || "Handcrafted with love and care for your special moments."}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-rose-50 pt-2 sm:pt-4 gap-2">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Price</span>
              <p className="text-base sm:text-lg md:text-xl font-black text-slate-900">Rs. {product.price}</p>
            </div>
            
            {/* ADD TO BAG BUTTON */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                // @ts-ignore
                addToCart(product);
              }}
              className="p-2 sm:p-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl hover:bg-rose-500 transition-all active:scale-95 shadow-md shrink-0"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}