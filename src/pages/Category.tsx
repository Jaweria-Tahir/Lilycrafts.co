import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer.tsx";
import CartDrawer from "@/components/layout/CartDrawer";
import { CATEGORY_DATA } from "@/constants/categories";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col font-serif overflow-hidden">


      {/* 1. THE FADED BACKGROUND IMAGE (Consistent with Wishlist) */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: "url('/artisanal_story.png')", 
            filter: "blur(12px) brightness(1.15)" 
          }}
        />
        <div className="absolute inset-0 bg-rose-50/50 backdrop-blur-[3px]" />
      </div>

      <Navbar />
      <CartDrawer />

      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-12 relative z-10">
        
        {/* ATTRACTIVE HEADING SECTION */}
        <div className="text-center mb-10 sm:mb-16 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-rose-300 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-black">Handmade Collections</span>
            <Sparkles className="h-4 w-4 text-rose-300 animate-pulse" />
          </div>
          <h1 className="text-[clamp(2.1rem,9vw,4.5rem)] md:text-7xl font-medium text-slate-800 tracking-tight">
            Browse <span className="text-[#9b4d4d] italic font-light">Categories</span>
          </h1>
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-auto mt-6" />
        </div>

        {/* CATEGORIES GRID - Glassmorphism style boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-14 sm:mb-24">
          {CATEGORY_DATA.map((cat, index) => (
            <button 
              key={index}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group relative h-44 sm:h-60 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-md bg-white/40 border border-white/60 rounded-[1.2rem] sm:rounded-[2.5rem] transition-all duration-500 hover:bg-white/60 hover:shadow-[0_20px_50px_rgba(200,150,160,0.15)] hover:-translate-y-2 active:scale-95 overflow-hidden"
            >
              {/* Subtle inner hover glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl group-hover:bg-rose-300/40 transition-all duration-700" />
              
              <h3 className="relative text-base sm:text-2xl font-medium text-slate-800 text-center leading-tight group-hover:text-[#9b4d4d] transition-colors duration-300">
                {cat.name}
              </h3>
              
              <div className="relative h-0 group-hover:h-12 overflow-hidden transition-all duration-500 ease-in-out">
                <p className="text-[12px] text-slate-500 mt-4 text-center italic leading-relaxed">
                  {cat.sub}
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                Explore <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>


      </main>

      <Footer />
      
      {/* Decorative floating elements to match Wishlist */}
      <div className="fixed bottom-10 left-10 text-rose-300/30 text-4xl pointer-events-none select-none">✦</div>
      <div className="fixed top-40 right-10 text-rose-300/30 text-5xl pointer-events-none select-none animate-pulse">✧</div>
      <div className="fixed bottom-1/2 left-4 text-rose-200/20 text-6xl pointer-events-none select-none -rotate-12">🌸</div>
    </div>
  );
}