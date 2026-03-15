import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AdvancePayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("id") || "LC-000000";
  const total = parseInt(searchParams.get("total") || "0");
  
  const advanceAmount = Math.round(total / 4);
  const accountNo = "03327735121";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const message = `*Order Confirmation*%0A` +
                    `Order ID: #${orderId}%0A` +
                    `Total Bill: Rs. ${total.toLocaleString()}%0A` +
                    `*Advance Sent: Rs. ${advanceAmount.toLocaleString()}*%0A%0A` +
                    `I have sent the advance payment via Easypaisa. Here is my screenshot! ✨`;
    
    // Laptop compatible API link
    window.open(`https://api.whatsapp.com/send?phone=923327735121&text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-pink-home-faded font-serif flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white/70 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-10 text-center text-white relative">
             <div className="absolute top-4 right-6 text-white/20 text-4xl">✿</div>
             <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <CheckCircle2 className="h-10 w-10 text-white" />
             </div>
             <h1 className="text-3xl font-bold italic">Almost There!</h1>
             <p className="text-pink-100 mt-2">Order ID: <span className="font-mono font-bold tracking-widest">{orderId}</span></p>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/50 p-4 rounded-3xl border border-pink-100 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Bill</p>
                  <p className="text-xl font-bold text-slate-700">Rs. {total.toLocaleString()}</p>
               </div>
               <div className="bg-pink-50 p-4 rounded-3xl border border-pink-200 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-pink-500">Advance (1/4)</p>
                  <p className="text-xl font-black text-rose-600">Rs. {advanceAmount.toLocaleString()}</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-bold text-slate-800 italic">Pay via Easypaisa</p>
                  <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">VERIFIED MERCHANT</span>
               </div>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-[2rem] blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
                  <div className="relative flex items-center justify-between bg-white p-6 rounded-[2rem] border-2 border-pink-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Account Number</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">{accountNo}</p>
                      </div>
                      <button 
                        onClick={handleCopy}
                        className={`p-4 rounded-2xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white'}`}
                      >
                        {copied ? <span className="text-xs font-bold">COPIED!</span> : <Copy className="h-6 w-6" />}
                      </button>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
               <p className="text-sm text-slate-600 text-center leading-relaxed italic">
                 "Please transfer the advance amount to the account above. Once sent, click the button to send us the screenshot. We'll confirm your order immediately! 🌸"
               </p>
            </div>

            <div className="space-y-4 pt-2">
               {/* Fixed: Navigates to success while passing params */}
               <button 
                  onClick={() => navigate(`/success?id=${orderId}&total=${total}`)}
                  className="w-full bg-slate-800 hover:bg-black text-white py-5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all opacity-80 hover:opacity-100"
               >
                  Confirm Order Via Whatsapp <ArrowRight className="h-4 w-4" />
               </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}