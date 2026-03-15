import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  Heart, ShoppingBag, Package, Copy, Sparkles, MessageCircle 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [orderName, setOrderName] = useState("");

  // Logic: Use URL params first, fallback to storage if empty
  const orderId = searchParams.get("id") || localStorage.getItem("lastOrderId") || "LC-XXXXXX"; 
  const totalAmount = searchParams.get("total") || localStorage.getItem("lastOrderTotal") || "0";

  useEffect(() => {
    if (orderId && orderId !== "LC-XXXXXX") {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await supabase
        .from("orders")
        .select("customer_name")
        .eq("order_number", orderId)
        .single();

      if (data) {
        setOrderName(data.customer_name);
      } else {
        // Fallback name if DB fetch fails
        setOrderName(localStorage.getItem("lastOrderName") || "");
      }
    } catch (err) {
      setOrderName(localStorage.getItem("lastOrderName") || "");
      console.error("Supabase Error:", err);
    }
  };

const handleWhatsAppConfirm = () => {
    const businessNumber = "923327735121"; 
    
    const name = orderName || "Customer";
    const msgId = orderId;
    const amount = totalAmount;

    // Use %23 instead of # to ensure the Order ID isn't cut off
    const message = `Hello Lilycrafts! ♡%0A%0A` +
                    `My name is *${name}*.%0A` +
                    `I just placed an order: *%23${msgId}*%0A` +
                    `Total Amount: *Rs. ${amount}*%0A%0A` +
                    `Please confirm my order! ✨`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${businessNumber}&text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyToClipboard = () => {
    if (orderId && orderId !== "LC-XXXXXX") {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-pink-home-faded flex flex-col font-serif text-black overflow-hidden relative">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6 py-20 relative z-10">
        <div className="max-w-2xl w-full backdrop-blur-xl bg-white/60 border border-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_30px_100px_rgba(255,182,193,0.2)] relative">
          
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-rose/10 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                <Heart size={48} className="text-rose fill-rose animate-bounce" />
              </div>
            </div>

            <h1 className="text-5xl font-serif text-slate-900 mb-4 tracking-tighter">
              Order <em className="italic font-medium text-rose">Received!</em>
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 italic">
              Thank you, {orderName.split(' ')[0] || "lovely"}! 
            </p>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 mb-10">
              <button 
                onClick={handleWhatsAppConfirm}
                className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200"
              >
                Confirm on WhatsApp <MessageCircle size={20} className="fill-white" />
              </button>
            </div>

            <div className="bg-white/80 rounded-[2rem] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-rose-50 shadow-sm">
              <div className="text-left md:ml-4">
                <p className="text-[9px] font-black uppercase text-rose/60 mb-1 tracking-widest">Order ID</p>
                <p className="text-2xl font-bold text-slate-800">#{orderId}</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
              >
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/shop" className="flex items-center justify-center gap-3 py-5 bg-white border border-rose-100 text-rose rounded-full font-bold uppercase tracking-widest">
                Browse More <ShoppingBag size={18} />
              </Link>
              <Link to={`/track-order?id=${orderId}`} className="flex items-center justify-center gap-3 py-5 bg-rose text-white rounded-full font-bold uppercase tracking-widest shadow-lg">
                Track Journey <Package size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}