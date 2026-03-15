import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Star, Heart, Menu, ShoppingBag, MessageCircle } from "lucide-react"; 
import { REVIEWS } from "@/data/products";
import { useProducts } from "@/lib/useProducts";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import MenuDrawer from "@/components/layout/MenuDrawer"; 
import { supabase } from "@/lib/supabase";

// --- SLIDER IMPORTS ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function useFeaturedProducts() {
  const { data: productsFromDb, isLoading } = useProducts();
  const featured = (productsFromDb || []).filter(
    p => p.is_best_seller === true || p.isBestSeller === true
  ).slice(0, 8);
  return { featured, isLoading };
}

// --- SLIDER SETTINGS ---
const bestSellerSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 5000,
  cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3 } },
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } }
  ],
};

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
      <div className="animate-ticker inline-block">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2">
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

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, dots: true, arrows: false } }
    ]
  };

  return (
    <Slider {...settings} className="review-slider outline-none">
      {reviewsFromDb.map((r) => (
        <div key={r.id} className="px-3 py-4 focus:outline-none">
          <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-rose-100/50 h-[280px] sm:h-[260px] flex flex-col justify-between shadow-sm transition-all hover:bg-white/60">
            <div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < (r.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                  />
                ))}
              </div>
              <p className="italic text-slate-700 font-serif leading-relaxed text-sm line-clamp-5">
                "{r.comment ?? r.review}"
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-rose/10 flex items-center justify-center">
                <Heart className="h-2.5 w-2.5 text-rose fill-rose" />
              </div>
              <p className="font-bold text-slate-900 tracking-widest uppercase text-[8px]">
                {r.customer_name ?? r.name ?? "Valued Customer"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

function NextArrow({ onClick }: any) {
  return (
    <button className="absolute top-1/2 -right-4 -translate-y-1/2 z-30 p-4 rounded-full bg-white shadow-2xl text-rose hover:bg-rose hover:text-white transition-all focus:outline-none hidden xl:block" onClick={onClick}>
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}

function PrevArrow({ onClick }: any) {
  return (
    <button className="absolute top-1/2 -left-4 -translate-y-1/2 z-30 p-4 rounded-full bg-white shadow-2xl text-rose hover:bg-rose hover:text-white transition-all focus:outline-none hidden xl:block" onClick={onClick}>
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const { featured, isLoading } = useFeaturedProducts();

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
          <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-12 items-center">
              
              {/* LEFT SIDE: Text Content */}
              <div className="text-left">
                <div className="inline-block px-2 py-0.5 rounded-full text-[7px] sm:text-[10px] font-semibold mb-3 sm:mb-6 tracking-[0.1em] sm:tracking-[0.2em] uppercase bg-rose/10 text-rose border border-rose/20">
                  Lilycrafts Exclusive
                </div>
                <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl font-light leading-[1.1] sm:leading-[0.9] mb-4 text-slate-950">
                  Crafted<br /><em className="shimmer-heading not-italic font-medium">with love</em>
                </h1>
                <p className="font-serif text-[10px] sm:text-base text-slate-700/80 mb-6 max-w-lg leading-relaxed italic">
                  Every piece tells a story of patience and artistry. Bring home handmade luxury for your everyday moments.
                </p>
                <Link to="/shop" className="inline-flex bg-rose text-white px-4 py-2 sm:px-8 sm:py-3.5 rounded-full font-bold text-[10px] sm:text-base shadow-lg hover:bg-rose/90 items-center gap-2 transition-transform hover:scale-105">
                  Shop <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </div>

              {/* RIGHT SIDE: Visual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/5] sm:aspect-auto sm:row-span-2">
                  <img src="/g_img_5.jpg" className="w-full h-full object-cover" alt="Hero 1" />
                </div>
                <div className="hidden sm:block rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-square">
                  <img src="/g_img_2.png" className="w-full h-full object-cover" alt="Hero 2" />
                </div>
                <div className="hidden sm:block rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl aspect-square">
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
                  <div className="relative px-2 sm:px-0">
                    {isLoading ? (
                      <div className="flex justify-center py-10 animate-pulse text-rose font-serif italic text-base">Curating...</div>
                    ) : (
                      <Slider {...bestSellerSettings} className="product-slider outline-none select-none">
                        {featured.map((p) => (
                          <div key={p.id} className="px-2 sm:px-3 outline-none"> 
                            <Link to={`/product/${p.id}`} className="group relative block">
                              <div className="relative h-[350px] sm:h-[400px] md:h-[320px] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl">
                                <img 
                                  src={Array.isArray(p.images) ? p.images[0] : p.image} 
                                  alt={p.name} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />
                                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-[1.5rem] bg-white/10 backdrop-blur-md border border-white/20">
                                  <div className="flex justify-between items-center">
                                    <div className="max-w-[75%]">
                                      <h3 className="font-serif text-xs sm:text-sm text-white truncate">{p.name}</h3>
                                      <p className="text-white/80 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">Rs. {p.price}</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-rose text-white flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                      <ShoppingBag className="h-4 w-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </Slider>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STORY SECTION */}
          <section className="relative w-full min-h-[500px] sm:min-h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden my-12 sm:my-16 bg-[#fff0f5]">
            <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-r from-rose-100 via-purple-100 to-rose-100" />
            <div className="relative z-10 w-full max-w-7xl h-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 py-8 md:py-10">
                <div className="flex-1 w-full h-[250px] sm:h-[350px] md:h-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl bg-[url('/home4.png')] bg-cover bg-center transition-transform hover:scale-[1.02] duration-700" />
                <div className="flex-1 w-full h-[250px] sm:h-[350px] md:h-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl bg-[url('/artisanal_story.png')] bg-cover bg-center transition-transform hover:scale-[1.02] duration-700" />
            </div>
          </section>

          {/* REVIEWS */}
          <section className="relative py-16 sm:py-20 overflow-hidden bg-mesh-pink border-y border-rose-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-2">Kind <em className="italic font-light text-rose">Words</em></h2>
                <div className="h-1 w-12 bg-rose/20 mx-auto rounded-full" />
              </div>
              <ReviewSlider />
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}