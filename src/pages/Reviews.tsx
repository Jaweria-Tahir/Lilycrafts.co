import { useEffect, useState } from "react";
import { Star, Heart, Quote, Sparkles } from "lucide-react";
import { REVIEWS } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer.tsx";
import { supabase } from "@/lib/supabase";

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState(""); 
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviewsFromDb, setReviewsFromDb] = useState<any[]>([]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at, is_approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    const normalized = (data || []).map((r: any) => ({
      id: r.id,
      name: r.customer_name ?? "Customer",
      rating: r.rating ?? 5,
      comment: r.comment ?? "",
    }));

    setReviewsFromDb(normalized);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          customer_name: name,
          comment,
          rating,
          product_id: null,
          is_approved: true,
        });

      if (error) {
        console.error("Error submitting review:", error);
        return;
      }

      await fetchReviews();

      setSubmitted(true);
      setRating(0);
      setName("");
      setComment("");

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Unexpected error submitting review:", err);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fffcfd] font-serif">
      
      {/* --- PREMIUM ARTISTIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.1] mix-blend-multiply"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2048&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/30 blur-[100px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-16 md:py-24">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-12 sm:mb-20 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/5 border border-rose/10 text-rose text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
            <Heart size={12} className="fill-rose" /> Our Community
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,10vw,5rem)] md:text-8xl font-light text-[#4A0415] mb-4 sm:mb-6 leading-tight">
            Loved by <em className="font-medium text-rose italic underline decoration-rose/20 underline-offset-8">You</em>
          </h1>
          <p className="font-serif italic text-sm sm:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            "Every handmade craft is a piece of heart shared with the world."
          </p>
        </div>

        {/* --- REVIEWS GRID --- */}
       <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 mb-14 sm:mb-24">
  {reviewsFromDb.map((r) => (
    <div 
      key={r.id} 
      className="group relative bg-white/60 backdrop-blur-md p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] transition-all duration-500 hover:-translate-y-2 border border-white shadow-[0_20px_60px_rgba(225,29,72,0.03)]"
    >
      <Quote className="absolute top-4 sm:top-8 right-4 sm:right-10 h-6 w-6 sm:h-10 sm:w-10 text-rose/5 group-hover:text-rose/10 transition-colors" />
      
      {/* FIXED: Dynamic Golden Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < (r.rating ?? 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="text-[#4A0415]/90 leading-relaxed mb-5 sm:mb-8 font-serif italic text-xs sm:text-lg h-[90px] sm:h-[120px] overflow-hidden">
        "{r.comment}"
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-rose/10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose/20 to-rose/5 flex items-center justify-center text-rose font-bold border border-rose/10 shadow-sm">
          {(r.name || "C").charAt(0)}
        </div>
        <div>
          {/* FIXED: Name Display */}
          <p className="text-[9px] sm:text-[11px] font-bold text-[#4A0415] uppercase tracking-widest line-clamp-1">
            {r.name ?? "Valued Customer"}
          </p>
          <p className="text-[9px] text-rose/60 font-bold uppercase tracking-tighter">Verified Purchase</p>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* --- SHARE EXPERIENCE SECTION --- */}
        <section className="max-w-5xl mx-auto mt-12 sm:mt-24 mb-14 sm:mb-20 px-0 sm:px-4 relative">
          <div className="relative bg-white/70 backdrop-blur-xl border border-rose-100 rounded-[3rem] overflow-hidden shadow-[0_30px_70px_rgba(225,29,72,0.05)]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-5/12 relative min-h-[250px] overflow-hidden">
                <img 
                  src="./review_img.png" 
                  alt="Crochet and Resin Art" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Handmade with Love</p>
                  <h3 className="font-serif text-2xl italic">LilyCrafts Artistry</h3>
                </div>
              </div>

              <div className="md:w-7/12 p-8 md:p-12 bg-gradient-to-br from-white to-[#FFF5F7]">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-[10px] font-black uppercase tracking-widest mb-3">
                    <Heart size={10} className="fill-rose" /> Feedback
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#4A0415] font-light">
                    Share Your <span className="italic font-medium text-rose">Story</span>
                  </h2>
                </div>

                {submitted ? (
                  <div className="py-10 text-center animate-pulse">
                    <p className="font-serif italic text-xl text-[#4A0415]">Thank you for your kind words!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 text-center">
                      <p className="text-[10px] uppercase font-bold text-[#A67C86] mb-3 tracking-tighter">Rate your experience</p>
                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button 
                            key={s} 
                            type="button" 
                            onClick={() => setRating(s)}
                            className="transition-transform hover:scale-125 active:scale-90"
                          >
                            <Star 
                              size={32} 
                              className={`transition-all duration-300 ${
                                s <= rating 
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
                                  : "text-slate-200 stroke-[1.5px]"
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Full Name" 
                        className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 focus:border-rose/40 outline-none text-[#4A0415]"
                      />
                      <textarea 
                        required 
                        rows={3} 
                        value={comment} 
                        onChange={e => setComment(e.target.value)} 
                        placeholder="Tell us about your LilyCrafts piece..." 
                        className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 focus:border-rose/40 outline-none resize-none text-[#4A0415]"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={rating === 0} 
                      className="w-full bg-[#FF4D6D] hover:bg-[#FF758F] text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-40"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}