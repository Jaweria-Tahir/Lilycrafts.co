import { Heart, ShoppingBag, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen relative flex flex-col font-serif overflow-hidden">
      
      {/* 1. THE FADED BACKGROUND IMAGE (Consistent Theme) */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: "url('/artisanal_story.png')", // Same as contact/product
            filter: "blur(10px) brightness(1.1)" 
          }}
        />
        <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[2px]" />
      </div>

      <Navbar />
      <CartDrawer />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
        
        {/* ATTRACTIVE HEADING SECTION */}
        <div className="text-center mb-16 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-rose-300 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-black">Your Collection</span>
            <Sparkles className="h-4 w-4 text-rose-300 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-medium text-slate-800 tracking-tight">
            My <span className="text-rose-400/80 italic font-light">Wishlist</span>
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-auto mt-6" />
        </div>

        {wishlist.length === 0 ? (
          /* EMPTY STATE - Glassmorphism Card */
          <div className="max-w-md mx-auto backdrop-blur-xl bg-white/40 border border-white/60 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(200,150,160,0.15)]">
            <div className="relative inline-block mb-6">
              <Heart className="h-20 w-20 text-rose-100 fill-rose-50 animate-bounce duration-1000" />
              <Heart className="h-8 w-8 text-rose-300 fill-rose-200 absolute -top-2 -right-2 animate-pulse" />
            </div>
            
            <h2 className="text-2xl text-slate-700 mb-3">Your heart is empty!</h2>
            <p className="text-slate-500 italic mb-8 leading-relaxed">
              Looks like you haven't saved any treasures yet. Start exploring our handmade collection.
            </p>
            
            <Link 
              to="/shop" 
              className="group w-full py-4 bg-[#b37a7a] hover:bg-[#965e5e] text-white rounded-full transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Start Shopping
            </Link>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <span className="text-sm italic text-slate-500">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </span>
              <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Continue Browsing
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 p-2">
              {wishlist.map(p => (
                <div key={p.id} className="transform transition-all hover:scale-[1.02]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      
      {/* Decorative floating element */}
      <div className="fixed bottom-10 left-10 text-rose-200/40 text-4xl pointer-events-none">✦</div>
      <div className="fixed top-40 right-10 text-rose-200/40 text-4xl pointer-events-none animate-spin-slow">✧</div>
    </div>
  );
}