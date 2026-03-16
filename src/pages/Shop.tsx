import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/constants/categories";
import { useProducts } from "@/lib/useProducts";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function Shop() {
  const { data: productsFromDb, isLoading } = useProducts();
  const PRODUCTS = (productsFromDb && productsFromDb.length > 0) ? productsFromDb : STATIC_PRODUCTS;
  
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // FIXED: Enhanced Sync logic to ensure footer links work while already on the shop page
  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    
    if (cat) {
      setSelectedCategories([cat]);
      // Scroll to top so user sees the filtered results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedCategories([]);
    }
    
    if (search !== null) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const sortLabels: Record<SortOption, string> = {
    featured: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "name-asc": "Name: A to Z",
    "name-desc": "Name: Z to A",
  };

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter(p => {
        // Handle both database format (category) and static format (categories array)
        const itemCategories = p.categories || (p.category ? [p.category] : []); 
        return itemCategories.some(c => selectedCategories.includes(c));
      });
    }
    
    if (inStockOnly) {
      list = list.filter(p => (p.in_stock === true || p.inStock === true));
    }

    list.sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return list;
  }, [PRODUCTS, searchQuery, selectedCategories, inStockOnly, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const FilterSidebar = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-6 border-b border-rose-100">
        <h3 className="font-serif text-xl font-bold text-slate-800">Shop Filters</h3>
        <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
          <X className="h-6 w-6 text-rose-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div 
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            inStockOnly 
            ? "bg-rose-500 border-rose-600 shadow-lg" 
            : "bg-slate-50 border-slate-100 hover:border-rose-200"
          }`}
        >
          <div className="flex flex-col">
            <span className={`text-sm font-black transition-colors ${inStockOnly ? "text-white" : "text-slate-700"}`}>
              In Stock Only
            </span>
            <span className={`text-[10px] font-medium transition-colors ${inStockOnly ? "text-rose-100" : "text-slate-400"}`}>
              {inStockOnly ? "Showing available items" : "Showing all items"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif font-bold text-slate-800 border-b border-rose-100 pb-2">
            Categories
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 text-sm font-bold border-2 ${
                  selectedCategories.includes(cat) 
                  ? "bg-rose-100 border-rose-300 text-rose-600 shadow-sm scale-[1.02]" 
                  : "bg-white border-transparent text-slate-600 hover:bg-rose-50 hover:border-rose-100"
                }`}
              >
                <span className="tracking-wide">{cat}</span>
                {selectedCategories.includes(cat) && (
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-rose-50 bg-rose-50/30">
          <button 
            onClick={() => {
              setSelectedCategories([]);
              setInStockOnly(false);
            }}
            className="w-full py-4 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Clear All Filters
          </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-pink-home-faded font-serif">
  

      <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[100px] z-[2]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[80px] z-[2]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <CartDrawer />

        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8 md:px-8 md:py-12 relative">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-[clamp(2.5rem,10vw,5rem)] md:text-8xl font-bold tracking-tighter mb-3 sm:mb-4 bg-gradient-to-r from-[hsl(344,60%,45%)] via-[hsl(340,70%,70%)] to-[hsl(340,60%,90%)] bg-clip-text text-transparent italic animate-gradient-x"
                style={{ backgroundSize: '200% auto', fontFamily: "'Cormorant Garamond', serif", paddingBottom: '10px' }}>
              Our Shop
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-600 italic font-medium px-2">
              Discover handmade crafts made with love, <span className="text-rose-500 underline decoration-rose-200">just for you 🌸</span>
            </p>
          </div>

          <div className="relative z-30 mb-7 sm:mb-10 rounded-[1.6rem] sm:rounded-[2.5rem] border border-rose-200/50 bg-gradient-to-br from-white/85 via-rose-50/70 to-white/85 backdrop-blur-xl shadow-[0_14px_32px_rgba(251,113,133,0.13)] p-3 sm:p-4">
            <div className="flex flex-wrap gap-3 sm:gap-4 items-stretch md:items-center">
            <div className="relative w-full order-1 md:order-2 md:flex-1 md:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
              <input 
                type="text" placeholder="Search treasures..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-white/95 border border-rose-200 rounded-full outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 transition-all text-slate-800 text-sm sm:text-base shadow-sm"
              />
            </div>
            
            <div className="order-2 md:order-1 w-[calc(50%-0.375rem)] md:w-auto min-w-[140px]">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="w-full md:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-rose-400 text-slate-900 px-4 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-bold border border-rose-300 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-95"
              >
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-black" /> Filter
              </button>
            </div>

              <div className="relative order-3 w-[calc(50%-0.375rem)] md:w-auto md:min-w-[220px] md:ml-auto z-50 min-w-[140px]">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="w-full h-full min-h-[44px] flex items-center justify-between pl-10 sm:pl-12 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-white/95 border border-rose-200 rounded-full outline-none text-black text-sm font-bold hover:border-rose-300 transition-all shadow-sm group"
                  >
                    <ArrowUpDown className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                    <span className="truncate">{sortLabels[sortBy]}</span>
                    <ChevronDown className={`ml-2 h-4 w-4 text-black transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                      <div className="absolute top-[110%] left-0 w-full bg-white/95 backdrop-blur-2xl border border-rose-100 rounded-[2rem] shadow-2xl z-[45] py-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-all hover:bg-rose-50 ${
                              sortBy === option ? 'text-rose-600 bg-rose-50' : 'text-slate-700'
                            }`}
                          >
                            {sortLabels[option]}
                            {sortBy === option && <Check className="h-4 w-4 text-rose-500" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 relative z-0">
            {isLoading ? (
              <div className="col-span-full text-center py-24 text-slate-500">Loading products...</div>
            ) : (
              filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-24 bg-white/30 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-rose-200">
              <h3 className="text-2xl font-bold text-slate-800">No treasures found in the magic box. ✨</h3>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${sidebarOpen ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`absolute left-0 top-0 h-full w-[320px] bg-white transition-transform duration-500 ease-out shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <FilterSidebar />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FB7185; border-radius: 10px; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradient-x 5s ease infinite; }
      `}</style>
    </div>
  );
}