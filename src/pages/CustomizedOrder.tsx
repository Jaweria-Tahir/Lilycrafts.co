import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, ShoppingBag, MessageCircle, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Resin", "Crochet", "Plaster of Paris", "Quilling Crafts"] as const;
type CategoryKey = (typeof CATEGORIES)[number];

const SPECIFIC_ITEMS: Record<CategoryKey, string[]> = {
  "Resin": ["Pendant", "Phone Charm", "Tray", "Keyring"],
  "Crochet": ["Keychain", "Phone Charm", "Brooch", "Coaster", "Flower"],
  "Plaster of Paris": ["Paintings"],
  "Quilling Crafts": ["Jhumkis", "Keychains"],
};

export default function CustomizedOrder() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState({
    category: "" as CategoryKey | "",
    specificItem: "",
    colors: "", 
    glitter: "",
    size: "",
    specialInstructions: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // --- AUTOMATED WHATSAPP REDIRECT ---
  const handleWhatsAppRedirect = (id: string) => {
    const phoneNumber = "923001234567"; // Replace with your admin number
    const message = `*✨ NEW CUSTOM ORDER: ${id}*
------------------------------
*📦 ITEM DETAILS*
• *Category:* ${form.category}
• *Product:* ${form.specificItem}
• *Colors:* ${form.colors || "N/A"}
${form.glitter ? `• *Glitter:* ${form.glitter}` : ""}
${form.size ? `• *Size:* ${form.size}` : ""}
${form.specialInstructions ? `• *Special Instructions:* ${form.specialInstructions}` : ""}

*👤 CUSTOMER INFO*
• *Name:* ${form.name}
• *Email:* ${form.email}
• *Phone:* ${form.phone}
• *Address:* ${form.address}
------------------------------
_Sent from LilyCrafts.co_`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // --- VALIDATION LOGIC ---
  const validateStep = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pakPhoneRegex = /^03\d{2}-?\d{7}$/; // Accepts 03xx-xxxxxxx or 03xxxxxxxxx

    const normalized = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    switch (step) {
      case 1:
        if (!form.category) return (toast.error("Please select a category.") && false);
        return true;
      case 2:
        if (!form.specificItem) return (toast.error("Please select a specific piece.") && false);
        return true;
      case 3:
        if (!form.colors.trim()) return (toast.error("Please describe your color preferences.") && false);
        return true;
      case 7: 
        if (!normalized.name || !normalized.email || !normalized.phone || !normalized.address) {
          return (toast.error("Please fill all delivery details.") && false);
        }
        if (!emailRegex.test(normalized.email)) {
          return (toast.error("Please enter a valid email.") && false);
        }
        if (!pakPhoneRegex.test(normalized.phone)) {
          return (toast.error("Enter a valid Pakistani phone number (e.g., 03001234567 or 0300-1234567).") && false);
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      // Logic to skip step 5 (upload) and 6 (instructions handled in sequence)
      if (step === 3) setStep(6);
      else setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (submitting) return;

    try {
      setSubmitting(true);
      const payload = {
        category: form.category,
        specific_item: form.specificItem,
        colors: form.colors.trim(),
        glitter: form.glitter.trim(),
        size: form.size.trim(),
        special_instructions: form.specialInstructions.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      const { data, error } = await supabase.from("customised_orders").insert({
        ...payload,
      }).select("order_id").single();

      if (error) throw error;
      
      setOrderId(data.order_id);
      
      // Automated WhatsApp opening
      handleWhatsAppRedirect(data.order_id);
      
      setStep(8);
      toast.success("Order Logged Successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-pink-home-faded font-serif">
      <Navbar />
      <main className="flex-grow py-8 sm:py-16 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-rose-200/70 text-rose text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
               Bespoke Handmade
             </div>
             <h1
               className="text-[clamp(2.5rem,10vw,5rem)] md:text-8xl font-bold tracking-tighter mb-3 sm:mb-4 bg-gradient-to-r from-[hsl(344,60%,45%)] via-[hsl(340,70%,70%)] to-[hsl(340,60%,90%)] bg-clip-text text-transparent italic animate-gradient-x"
               style={{ backgroundSize: "200% auto", fontFamily: "'Cormorant Garamond', serif", paddingBottom: "10px" }}
             >
               {step === 8 ? "Order " : "Custom "} <em className="italic font-medium text-rose">{step === 8 ? "Confirmed" : "Order"}</em>
             </h1>
             <p className="text-sm sm:text-base md:text-xl text-slate-600 italic font-medium px-2">
               Tell us your idea and we will craft it with <span className="text-rose-500 underline decoration-rose-200">artisan detail</span>.
             </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-[1.75rem] sm:rounded-[2.5rem] border-2 border-white/80 shadow-2xl p-4 sm:p-8 md:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h3 className="font-serif text-2xl mb-8 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-rose" /> What are we crafting?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setForm(p => ({ ...p, category: cat, specificItem: "" }))} 
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${form.category === cat ? "border-rose bg-rose/5 ring-2 ring-rose/10" : "border-white bg-white/40 hover:border-rose/20"}`}>
                        <span className="block font-serif text-lg">{cat}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h3 className="font-serif text-2xl mb-8">Choose your piece</h3>
                  <div className="flex flex-wrap gap-3">
                    {form.category && SPECIFIC_ITEMS[form.category].map(item => (
                      <button key={item} onClick={() => setForm(p => ({ ...p, specificItem: item }))} 
                        className={`px-6 py-3 rounded-full border-2 transition-all ${form.specificItem === item ? "bg-slate-900 text-white shadow-lg" : "bg-white/50 hover:bg-white"}`}>{item}</button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h3 className="font-serif text-2xl mb-4">Design Choices</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Color Palette *</label>
                      <input className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" placeholder="e.g. Deep blue with white marble effect" value={form.colors} onChange={e => setForm(p => ({ ...p, colors: e.target.value }))} />
                    </div>
                    {form.category === "Resin" && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Glitter & Foil</label>
                        <input className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" placeholder="e.g. Gold foil flakes and fine pink glitter" value={form.glitter} onChange={e => setForm(p => ({ ...p, glitter: e.target.value }))} />
                      </div>
                    )}
                    {((form.category === "Crochet" && form.specificItem === "Flower") || (form.category === "Quilling Crafts")) && (
                       <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Size Preference</label>
                       <input className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" placeholder="e.g. Medium (4 inches)" value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} />
                     </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-serif text-2xl mb-8">Special Instructions</h3>
                  <textarea rows={5} className="w-full bg-white/40 border-2 border-white rounded-[2rem] p-6 outline-none focus:border-rose/30" placeholder="Any specific details or personalizations?" value={form.specialInstructions} onChange={e => setForm(p => ({ ...p, specialInstructions: e.target.value }))} />
                </motion.div>
              )}

              {step === 7 && (
                <motion.div key="7" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-serif text-2xl mb-8">Delivery Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Name" className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    <input required type="email" placeholder="Email" className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    <input required placeholder="Phone Number (e.g., 03001234567 or 0300-1234567)" className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 outline-none focus:border-rose/30" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    <textarea required placeholder="Shipping Address" className="w-full bg-white/40 border-2 border-white rounded-2xl p-4 md:col-span-2 outline-none focus:border-rose/30" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                  </div>
                </motion.div>
              )}

              {step === 8 && (
                <motion.div key="8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-serif text-3xl mb-2 text-slate-900">Success!</h3>
                  <p className="text-slate-500 mb-1">Your request has been logged and WhatsApp has been opened.</p>
                  <p className="text-rose font-bold text-lg mb-8 tracking-widest">{orderId}</p>
                  
                  <button onClick={() => handleWhatsAppRedirect(orderId)} className="w-full max-w-sm bg-[#25D366] text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 mb-4 hover:bg-[#1fb355] transition-all">
                    <MessageCircle className="h-5 w-5" /> Re-open WhatsApp
                  </button>

                  <button onClick={() => window.location.href = "/"} className="w-full max-w-sm bg-slate-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                    <Home className="h-4 w-4" /> Return to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 8 && (
              <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 items-center border-t border-rose-100 pt-6 sm:pt-8">
                {step > 1 ? (
                  <button onClick={() => setStep(s => s === 6 ? 3 : s - 1)} className="min-h-[44px] text-slate-400 hover:text-rose font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-rose-100 rounded-full bg-white/40">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : <div className="min-h-[44px]" />}
                
                <button onClick={() => step === 7 ? handleSubmit() : handleNext()} disabled={submitting}
                  className="min-h-[44px] bg-slate-900 text-white px-4 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-[10px] sm:text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 disabled:bg-slate-300 transition-all uppercase tracking-widest">
                  {step === 7 ? (submitting ? "Processing..." : "Place Custom Order") : "Next Step"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}