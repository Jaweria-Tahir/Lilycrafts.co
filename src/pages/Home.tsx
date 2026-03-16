import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, ShoppingBag, MessageCircle, Package, Info } from "lucide-react"; 
import { useProducts } from "@/lib/useProducts";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import MenuDrawer from "@/components/layout/MenuDrawer"; 
import { supabase } from "@/lib/supabase";

function useFeaturedProducts() {
  const { data: productsFromDb, isLoading } = useProducts();
  const featured = (productsFromDb || []).filter(
    p => p.is_best_seller === true || p.isBestSeller === true
  ).slice(0, 8);
  return { featured, isLoading };
}

function MovingTicker() {
  const tickerItems = [
    "Premium Crochet", 
    "Luxury Packaging", 
    "Fast Shipping", 
    "Handmade Love", 
    "Custom Orders"
  ];

  return (
    <div className="bg-slate-900 text-white/90 py-1.5 text-[10px] font-medium tracking-wider uppercase overflow-hidden whitespace-nowrap border-b border-white/10 relative z-50">
      <div className="animate-ticker inline-flex items-center">
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="mx-6 sm:mx-8 inline-flex items-center gap-2">
            <span className="text-rose text-lg"></span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReviewSlider() {
  const [reviewsFromDb, setReviewsFromDb] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching reviews for home:", error);
        return;
      }
      setReviewsFromDb(data || []);
    };
    fetchReviews();
  }, []);

  return (
    <div className="-mx-1 overflow-x-auto pb-2 md:overflow-visible">
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 snap-x snap-mandatory px-1 md:px-0">
        {reviewsFromDb.map((r) => (
          <article key={r.id} className="min-w-[82%] sm:min-w-[62%] md:min-w-0 snap-start bg-white/70 backdrop-blur-md p-5 sm:p-6 rounded-[1.75rem] border border-rose-100/60 min-h-[230px] flex flex-col justify-between shadow-[0_10px_25px_rgba(190,24,93,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(190,24,93,0.12)]">
            <div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (r.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="italic text-slate-700 font-serif leading-relaxed text-sm sm:text-base line-clamp-5">
                "{r.comment ?? r.review}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-rose-100/70 mt-5">
              <div className="h-8 w-8 rounded-full bg-rose/10 text-rose font-bold text-xs flex items-center justify-center">
                {(r.customer_name ?? r.name ?? "C").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900 tracking-[0.14em] uppercase text-[10px]">
                  {r.customer_name ?? r.name ?? "Valued Customer"}
                </p>
                <p className="text-[10px] text-slate-500">Verified Customer</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState("");
  const { featured, isLoading } = useFeaturedProducts();
  const mobileLoopProducts = featured.length > 0 ? [...featured, ...featured] : [];
  const desktopHero = featured[0];
  const desktopGrid = featured.slice(1, 5);

  const whatsappNumber = "923327735121"; 
  const message = encodeURIComponent("Hi LilyCrafts!!!!");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-pink-home-faded font-serif">
      
      {/* --- WHATSAPP FLOATING BUTTON --- */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[100] group flex flex-row-reverse items-center"
      >
        <span className="hidden sm:block ml-3 px-4 py-2 bg-white/80 backdrop-blur-md border border-rose-100 text-rose text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          Chat with us
        </span>
        
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-500 group-hover:scale-110 group-active:scale-95">
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 fill-current" />
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
        </div>
      </a>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* --- BACKGROUND BLOBS (Matches Shop.tsx) --- */}
      <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[100px] z-[2]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[80px] z-[2]" />
      </div>

      <div className="relative z-10">
        <MovingTicker />
        <Navbar />
        <CartDrawer />
        
        <main>
          {/* HERO SECTION */}
          <section className="relative pt-10 sm:pt-14 pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              
              {/* LEFT SIDE: Text Content */}
              <div className="text-left order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold mb-4 sm:mb-6 tracking-[0.1em] sm:tracking-[0.2em] uppercase bg-rose/10 text-rose border border-rose/20">
                  <span className="h-2 w-2 rounded-full bg-rose animate-pulse" />
                  Lilycrafts Exclusive
                </div>
                <h1 className="font-serif text-[clamp(2rem,7vw,4.4rem)] sm:text-6xl md:text-7xl font-light leading-[1.05] sm:leading-[0.9] mb-4 text-slate-950">
                  Crafted<br /><em className="shimmer-heading not-italic font-medium">with love</em>
                </h1>
                <p className="font-serif text-sm sm:text-base text-slate-700/80 mb-6 max-w-lg leading-relaxed italic">
                  Every piece tells a story of patience and artistry. Bring home handmade luxury for your everyday moments.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link to="/shop" className="inline-flex min-h-[44px] bg-rose text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold text-xs sm:text-base shadow-lg hover:bg-rose/90 items-center gap-2 transition-transform hover:scale-105">
                    Shop <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                  <Link to="/customized-order" className="inline-flex min-h-[44px] bg-white/80 border border-rose/30 text-slate-900 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold text-xs sm:text-base items-center gap-2 transition-all hover:border-rose hover:text-rose">
                    Custom Order
                  </Link>
                </div>
              </div>

              {/* RIGHT SIDE: Visual Grid */}
              <div className="relative order-1 md:order-2 grid grid-cols-2 gap-2 sm:gap-4">
                <div className="absolute -top-3 right-3 sm:right-6 px-3 py-1.5 rounded-full bg-white/85 border border-rose/20 text-[10px] font-bold uppercase tracking-wider text-rose shadow-md z-20">
                  Handmade Gift
                </div>
                <div className="rounded-[1.25rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/5] row-span-2 min-h-[240px]">
                  <img src="/g_img_5.jpg" className="w-full h-full object-cover" alt="Hero 1" />
                </div>
                <div className="rounded-[1.25rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-square min-h-[116px]">
                  <img src="/g_img_2.png" className="w-full h-full object-cover" alt="Hero 2" />
                </div>
                <div className="rounded-[1.25rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-square min-h-[116px]">
                  <img src="/g_img_3.png" className="w-full h-full object-cover" alt="Hero 3" />
                </div>
              </div>

            </div>
          </section>

         {/* BEST SELLERS */}
          <section className="relative py-12 overflow-hidden"> 
            <div className="w-full"> 
              <div className="bg-white/40 backdrop-blur-md py-10 border-y border-rose-100/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-10">
                    <div className="inline-block mb-3 px-4 py-1 rounded-full bg-white/60 backdrop-blur-md border border-rose-100/50 shadow-sm">
                      <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-rose/60">Most Loved Pieces</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
                      Best <em className="italic font-light text-rose">Sellers</em>
                    </h2>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-10 animate-pulse text-rose font-serif italic text-base">Curating...</div>
                  ) : (
                    <>
                      <div className="md:hidden overflow-hidden">
                        <div
                          className="best-seller-mobile-track flex w-max"
                          style={{ animationPlayState: isSliderPaused ? "paused" : "running" }}
                          onMouseEnter={() => setIsSliderPaused(true)}
                          onMouseLeave={() => setIsSliderPaused(false)}
                          onTouchStart={() => setIsSliderPaused(true)}
                          onTouchEnd={() => setIsSliderPaused(false)}
                        >
                          {mobileLoopProducts.map((p, idx) => (
                            <div key={`${p.id}-${idx}`} className="w-[calc((100vw-2rem)/2)] px-2 shrink-0">
                              <Link to={`/product/${p.id}`} className="group relative block">
                                <div className="relative h-[260px] w-full rounded-[1.4rem] overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl">
                                  <img
                                    src={Array.isArray(p.images) ? p.images[0] : p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/15 to-transparent opacity-90" />
                                  <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-[1rem] bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="flex justify-between items-center gap-2">
                                      <div className="max-w-[72%]">
                                        <h3 className="font-serif text-xs text-white truncate">{p.name}</h3>
                                        <p className="text-white/80 text-[9px] font-bold tracking-widest uppercase">Rs. {p.price}</p>
                                      </div>
                                      <div className="h-7 w-7 rounded-full bg-rose text-white flex items-center justify-center shadow-lg">
                                        <ShoppingBag className="h-3.5 w-3.5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="hidden md:grid md:grid-cols-12 gap-6 items-stretch">
                        {desktopHero && (
                          <Link to={`/product/${desktopHero.id}`} className="group md:col-span-7 rounded-[2.4rem] overflow-hidden relative min-h-[460px] shadow-[0_16px_36px_rgba(15,23,42,0.22)] border border-rose-100/70">
                            <img
                              src={Array.isArray(desktopHero.images) ? desktopHero.images[0] : desktopHero.image}
                              alt={desktopHero.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/25 to-transparent" />
                            <div className="absolute left-8 bottom-8 max-w-md">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-rose-100/90 font-bold">Signature Pick</p>
                              <h3 className="font-serif text-4xl leading-tight text-white mt-2">{desktopHero.name}</h3>
                              <p className="text-white/85 text-sm mt-3 line-clamp-2">{desktopHero.description || "Handmade detail and premium finishing for standout gifting."}</p>
                              <p className="text-[#f4ffbf] text-lg font-bold mt-4 tracking-wide">Rs. {desktopHero.price}</p>
                            </div>
                          </Link>
                        )}

                        <div className="md:col-span-5 grid grid-cols-2 gap-4">
                          {desktopGrid.map((p) => (
                            <Link key={p.id} to={`/product/${p.id}`} className="group rounded-[1.4rem] overflow-hidden relative min-h-[220px] border border-rose-100/70 shadow-[0_8px_22px_rgba(15,23,42,0.12)]">
                              <img
                                src={Array.isArray(p.images) ? p.images[0] : p.image}
                                alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                              <div className="absolute left-3 right-3 bottom-3 rounded-xl bg-black/25 backdrop-blur-sm px-3 py-2 border border-white/15">
                                <h4 className="font-serif text-sm text-white truncate">{p.name}</h4>
                                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-rose-100">Rs. {p.price}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* STORY SECTION */}
          <section className="relative w-full min-h-[420px] flex items-center justify-center overflow-hidden my-16 sm:my-20 bg-[#fff0f5]">
            <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-r from-rose-100 via-purple-100 to-rose-100" />
            <div className="relative z-10 w-full max-w-7xl h-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose mb-2">Our Story</p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">From Yarn to <em className="italic text-rose">Memories</em></h2>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 sm:gap-6 md:gap-8">
                <div className="w-full h-[260px] sm:h-[340px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl transition-transform hover:scale-[1.02] duration-700">
                  <img src="/home4.png" alt="Our story visual" className="w-full h-full object-cover" />
                </div>
                <div className="w-full h-[260px] sm:h-[340px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl transition-transform hover:scale-[1.02] duration-700">
                  <img src="/artisanal_story.png" alt="Artisan work" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* REVIEWS */}
          <section className="relative py-16 sm:py-20 overflow-hidden bg-mesh-pink border-y border-rose-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-2">Kind <em className="italic font-light text-rose">Words</em></h2>
                <div className="h-1 w-12 bg-rose/20 mx-auto rounded-full" />
              </div>
              <ReviewSlider />
            </div>
          </section>

          <section className="py-14 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-rose-200/60 bg-white/80 backdrop-blur-xl p-5 sm:p-8 shadow-[0_14px_35px_rgba(244,114,182,0.15)]">
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                  <div className="flex items-start gap-3 md:min-w-[280px]">
                    <div className="h-11 w-11 rounded-2xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-slate-900">Track Your Order</h3>
                      <p className="text-sm text-slate-600 mt-1">Enter your standard order ID to view live status.</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <input
                      value={trackOrderId}
                      onChange={(e) => setTrackOrderId(e.target.value)}
                      placeholder="e.g. LC-123456"
                      className="w-full min-h-[46px] rounded-full border border-rose-200 bg-white px-5 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-sm"
                    />
                    <Link
                      to={trackOrderId.trim() ? `/track-order?id=${encodeURIComponent(trackOrderId.trim())}` : "/track-order"}
                      className="min-h-[46px] px-7 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      Track
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-[12px] sm:text-sm text-amber-800">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    Tracking is available for Standard Orders only. Customized orders are not eligible for online tracking.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>

      <style>{`
        @keyframes bestSellerLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .best-seller-mobile-track {
          width: max-content;
          animation: bestSellerLoop 24s linear infinite;
          will-change: transform;
        }

        @media (max-width: 768px) {
          .best-seller-mobile-track {
            animation-duration: 18s;
          }
        }
      `}</style>
    </div>
  );
}