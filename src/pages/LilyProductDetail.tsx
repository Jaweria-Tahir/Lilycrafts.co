import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Minus, Plus, Truck, Shield, ChevronRight, Star } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { useProducts } from "@/lib/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: productsFromDb, isLoading } = useProducts();
  const PRODUCTS = (productsFromDb && productsFromDb.length > 0) ? productsFromDb : STATIC_PRODUCTS;
  
  // String comparison for safety with UUIDs/Numbers
  const product = PRODUCTS.find(p => String(p.id) === String(id));
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-rose-50 font-serif">
        {isLoading ? (
          <p className="text-2xl text-rose-400">Loading...</p>
        ) : (
          <>
            <p className="text-2xl text-rose-400">Product not found 🌸</p>
            <Link to="/shop" className="lily-btn">Back to Shop</Link>
          </>
        )}
      </div>
    );
  }

  const productCats = product.categories?.length ? product.categories : [product.category];
  const related = PRODUCTS.filter(p => {
    if (p.id === product.id) return false;
    const pCats = p.categories?.length ? p.categories : [p.category];
    return pCats.some(c => productCats.includes(c));
  }).slice(0, 4);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => { 
    addToCart(product, qty); 
    setAdded(true); 
    setTimeout(() => setAdded(false), 2000); 
  };

  return (
    <div className="min-h-screen relative flex flex-col font-serif overflow-x-hidden">
      
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: "url('/artisanal_story.png')",
            filter: "blur(12px) brightness(1.1)" 
          }}
        />
        <div className="absolute inset-0 bg-rose-50/50 backdrop-blur-[2px]" />
      </div>

      <Navbar />
      <CartDrawer />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
        
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-8 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-rose-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-rose-400 transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-rose-400/80 font-bold">{product.name}</span>
        </nav>

        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-[3rem] shadow-[0_30px_80px_rgba(200,150,160,0.15)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            <div className="p-6 md:p-10 bg-rose-100/30">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                <img 
                  src={product.images?.[0] || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-4 rounded-full backdrop-blur-md border border-white/50 transition-all active:scale-90 shadow-lg ${
                    inWishlist ? "bg-rose-500 text-white" : "bg-white/80 text-rose-400 hover:bg-white"
                  }`}
                >
                  <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${inWishlist ? "fill-white" : ""}`} />
                </button>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-black text-rose-400 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-rose-100">
                    {productCats[0]}
                  </span>
                  <div className="flex items-center gap-1 text-rose-300 ml-2">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-bold text-slate-400">{product.rating || 0}</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-800 tracking-tight leading-tight">
                  {product.name} <span className="text-rose-400/80 italic font-light">♡</span>
                </h1>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-slate-700">Rs. {Number(product.price).toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-slate-400 line-through italic decoration-rose-200">
                      Rs. {Number(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* CLEAN DESCRIPTION (NO LISTEN BUTTON) */}
              <div className="space-y-4">
                <div className="p-8 rounded-[2rem] bg-white/60 border border-white/80 shadow-sm relative overflow-hidden group">
                  <p className="text-slate-600 leading-relaxed italic text-sm md:text-base relative z-10">
                    "{product.long_description || product.longDescription || product.description}"
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-100/40 border border-white/60">
                  <div className="p-2.5 rounded-full bg-white text-rose-400 shadow-sm">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Estimated Arrival</span>
                    <span className="text-slate-700 font-medium text-sm">{product.estimatedDelivery || "3-5 Business Days"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-6">
                  <span className="text-sm italic text-slate-500">How many?</span>
                  <div className="flex items-center bg-white/80 border border-rose-100 rounded-full p-1 shadow-inner">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-rose-400"><Minus className="h-4 w-4" /></button>
                    <span className="px-6 font-bold text-slate-700 min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-rose-400"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart} 
                    className={`flex-1 py-5 rounded-full font-medium tracking-tight text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                      added ? "bg-emerald-400" : "bg-[#b37a7a] hover:bg-[#965e5e] shadow-[0_10px_25px_rgba(179,122,122,0.3)]"
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {added ? "Added to Bag! 💕" : "Add to My Bag"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure</span>
                <span className="text-rose-200">✦</span>
                <span className="flex items-center gap-1">Handmade with Love</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-800 tracking-tight">
                You Might Also <span className="text-rose-400/80 italic font-light font-serif">Love</span>
              </h2>
              <div className="h-px w-24 bg-rose-200 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}