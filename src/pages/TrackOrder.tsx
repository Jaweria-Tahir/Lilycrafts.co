import { useState, useEffect } from "react";
import { 
  Package, Check, Truck, Home, ClipboardList, 
  Heart, Loader2, Search, MapPin, Sparkles, 
  ShoppingBag
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer.tsx";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";

// 1. UPDATED STEPS: Only three stages as requested
const STEPS = [
  { label: "Ordered", icon: ClipboardList, desc: "We've received your request" },
  { label: "Confirmed", icon: Check, desc: "Artisan has started working" },
  { label: "Delivered", icon: Home, desc: "Enjoy your handmade treasure!" },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch order details
  const track = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderId.trim())
        .single();

      if (fetchError || !data) {
        setError("We couldn't find that Order ID. Please double-check your receipt.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Connection lost. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger track if ID is in URL
  useEffect(() => {
    if (orderId) track();
  }, []);

  // --- REAL-TIME DATABASE LINK ---
  // This listens for any UPDATE to the specific order being tracked
  useEffect(() => {
    if (!result?.id) return;

    const subscription = supabase
      .channel(`order-${result.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${result.id}`,
        },
        (payload) => {
          console.log("Status updated by Admin!", payload.new);
          setResult(payload.new); // Instantly update the UI
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [result?.id]);

  // Calculate progress based on the 3 steps
  const stepIndex = result 
    ? STEPS.findIndex(s => s.label.toLowerCase() === (result.status || "ordered").toLowerCase()) 
    : -1;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-pink-home-faded font-serif">
      <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[100px] z-[2]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[80px] z-[2]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-20 relative z-10">
          
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold mb-6 tracking-[0.2em] uppercase bg-rose/10 text-rose border border-rose/20">
              Live Journey
            </div>
            <h1 className="font-serif text-[clamp(2rem,9vw,4.5rem)] md:text-7xl font-light leading-[0.95] mb-4 sm:mb-6 text-slate-950">
              Where is your <br /><em className="italic font-medium text-rose">Treasure?</em>
            </h1>
            <p className="font-serif text-sm sm:text-base text-slate-700/80 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed italic">
              Every package is wrapped with love. Watch its progress below.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
            <form onSubmit={track} className="relative group flex flex-col sm:flex-row gap-3">
              <input 
                value={orderId} 
                onChange={e => setOrderId(e.target.value)} 
                placeholder="e.g. LC-123456" 
                className="flex-1 px-5 sm:px-8 py-3.5 sm:py-6 rounded-full border-2 border-rose-50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all font-serif text-base sm:text-xl italic text-black"
                required 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="min-h-[44px] px-6 sm:px-10 py-3.5 sm:py-6 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] sm:text-sm"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search size={20} />}
                Track Order
              </button>
            </form>
            {error && (
              <div className="mt-6 bg-rose-50/80 backdrop-blur-md border border-rose-100 text-rose-600 text-sm rounded-2xl p-4 text-center animate-shake font-bold">
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              
              <div className="bg-white/60 backdrop-blur-xl border-2 border-white/80 p-4 sm:p-8 md:p-14 rounded-[1.6rem] sm:rounded-[3.5rem] shadow-2xl">
                
                <div className="flex flex-col md:flex-row justify-between mb-16 border-b border-rose-100/50 pb-8 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose/60 mb-2">Order Identifier</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-serif text-slate-900">#{result.order_number}</span>
                      <Sparkles size={20} className="text-rose/40 animate-pulse" />
                    </div>
                  </div>
                  <div className="md:text-right">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose/60 mb-2">Current Status</h3>
                    <p className="text-3xl font-serif text-slate-900 italic capitalize">{result.status || "Ordered"}</p>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative flex flex-col md:flex-row justify-between gap-10 md:gap-0">
                  {/* Connector Line (Desktop) */}
                  <div className="absolute top-7 left-0 w-full h-1 bg-rose-100/50 hidden md:block" />
                  <div 
                    className="absolute top-7 left-0 h-1 bg-rose transition-all duration-1000 hidden md:block" 
                    style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
                  />

                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const active = i <= stepIndex;
                    const isCurrent = i === stepIndex;

                    return (
                      <div key={i} className="flex md:flex-col items-center gap-6 md:gap-4 relative z-10 group">
                        <div className="relative">
                          {isCurrent && (
                            <div className="absolute inset-0 rounded-2xl bg-rose/40 animate-ping -z-10" />
                          )}
                          <div className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-700 shadow-lg
                            ${active 
                              ? 'bg-rose border-white text-white scale-110 shadow-rose/30' 
                              : 'bg-white border-rose-100 text-rose/20 scale-100 shadow-none'
                            }
                          `}>
                            <Icon size={24} strokeWidth={active ? 3 : 2} />
                          </div>
                        </div>
                        
                        <div className="md:text-center">
                          <p className={`
                            text-[11px] font-black uppercase tracking-[0.15em] mb-1 transition-colors duration-500
                            ${active ? 'text-slate-900' : 'text-slate-300'}
                            ${isCurrent ? 'text-rose underline underline-offset-4 decoration-2' : ''}
                          `}>
                            {step.label}
                          </p>
                          <p className={`
                            text-[10px] font-serif italic hidden md:block max-w-[120px] leading-tight
                            ${active ? 'text-slate-500' : 'text-slate-300'}
                          `}>
                            {step.desc}
                          </p>
                        </div>

                        {/* Connector Line (Mobile) */}
                        {i < STEPS.length - 1 && (
                          <div className={`
                            absolute left-7 top-14 w-[3px] h-10 md:hidden transition-colors duration-500
                            ${i < stepIndex ? 'bg-rose' : 'bg-rose-100'}
                          `} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Sub-Card */}
              <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] p-4 sm:p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <ShoppingBag size={28} className="text-rose" />
                  </div>
                  <div>
                    <p className="text-rose text-[10px] font-bold uppercase tracking-widest mb-1">Package Contents</p>
                    <p className="text-xl font-serif italic">{result.items?.length || 0} Items Reserved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Investment</p>
                  <p className="text-2xl font-serif text-rose">Rs. {result.total_price?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}