import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Truck, ShieldCheck, Loader2, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export default function LilyCheckout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  // Validation logic
  const isPhoneInvalid = form.phone.length > 0 && !/^[0-9]{4}-[0-9]{7}$/.test(form.phone);

  const shipping = totalPrice > 2000 ? 0 : 250; 
  const total = totalPrice + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneInvalid) return alert("Please use the format: 03xx-xxxxxxx");
    if (items.length === 0) return alert("Your bag is empty!");
    
    setLoading(true);
    const lilyOrderId = `LC-${Date.now().toString().slice(-6)}`;

    try {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert({
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          address: `${form.address}, ${form.city}`,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (customerError) throw new Error(`Customer Error: ${customerError.message}`);

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: lilyOrderId, 
          customer_name: form.name,
          customer_email: form.email,
          total_price: total,
          status: 'Ordered',
          items: items.map(item => ({
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0]
          }))
        });

      if (orderError) throw new Error(`Order Error: ${orderError.message}`);

      localStorage.setItem("lilycrafts-user-email", form.email);
      localStorage.setItem("lastOrderId", lilyOrderId);
      localStorage.setItem("lastOrderTotal", total.toString());
      localStorage.setItem("lastOrderName", form.name);
      
      clearCart();
      navigate(`/advance-payment?id=${lilyOrderId}&total=${total}`);
      
    } catch (error: any) {
      console.error("Order Failed Detail:", error);
      alert(error.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-serif overflow-hidden text-black">
      {/* Background Section */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop')", 
            filter: "blur(4px) brightness(1.1) saturate(0.8)" 
          }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <Navbar /><CartDrawer />

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-8">
        <div className="max-w-6xl w-full backdrop-blur-2xl bg-white/30 border border-white/60 rounded-[3.5rem] shadow-[0_40px_100px_rgba(255,182,193,0.3)] p-6 md:p-12 relative">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter drop-shadow-sm">
              Checkout <span className="text-pink-500/60 italic font-light tracking-normal">♡</span>
            </h1>
            <p className="text-slate-600 italic mt-3 text-base sm:text-lg">Your handmade treasures await...</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white/80 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-pink-100 pb-4 italic">Shipping Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500 ml-2">Full Name</label>
                    <input 
                      required 
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/90 border-2 border-pink-200 rounded-2xl py-4 px-6 focus:border-pink-400 focus:bg-white outline-none transition-all text-slate-800 font-medium shadow-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500 ml-2">Email</label>
                    <input 
                      required 
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/90 border-2 border-pink-200 rounded-2xl py-4 px-6 focus:border-pink-400 focus:bg-white outline-none transition-all text-slate-800 font-medium shadow-sm"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-[0.2em] font-bold ml-2 transition-colors ${isPhoneInvalid ? 'text-red-500' : 'text-pink-500'}`}>
                      Phone
                    </label>
                    <input 
                      required 
                      type="tel"
                      pattern="[0-9]{4}-[0-9]{7}"
                      title="Pattern: 03xx-xxxxxxx"
                      placeholder="0300-1234567"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className={`w-full bg-white/90 border-2 rounded-2xl py-4 px-6 focus:bg-white outline-none transition-all text-slate-800 font-medium shadow-sm ${
                        isPhoneInvalid 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-pink-200 focus:border-pink-400'
                      }`}
                    />
                    <p className="text-[9px] text-pink-400/80 font-bold ml-3 italic flex items-center gap-1">
                      <Info size={10} /> Format: 03xx-xxxxxxx
                    </p>
                  </div>

                  {/* City Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500 ml-2">City</label>
                    <input 
                      required 
                      type="text"
                      placeholder="e.g. Lahore"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full bg-white/90 border-2 border-pink-200 rounded-2xl py-4 px-6 focus:border-pink-400 focus:bg-white outline-none transition-all text-slate-800 font-medium shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500 ml-2">Delivery Address</label>
                    <textarea 
                      required 
                      rows={2} 
                      placeholder="House #, Street name, Area..."
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full bg-white/90 border-2 border-pink-200 rounded-2xl py-4 px-6 focus:border-pink-400 focus:bg-white outline-none transition-all resize-none text-slate-800 font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 ml-2">Choose Payment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                      { id: 'easypaisa', label: 'Mobile Wallet', icon: '📱' }
                    ].map((p) => (
                      <label key={p.id} className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${payment === p.id ? 'border-pink-300 bg-white shadow-md' : 'border-transparent bg-white/40 hover:bg-white/60'}`}>
                        <input type="radio" className="hidden" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                        <span className="text-2xl">{p.icon}</span>
                        <span className="text-sm font-bold text-slate-700">{p.label}</span>
                        {payment === p.id && <Heart className="h-4 w-4 fill-pink-400 text-pink-400 ml-auto animate-pulse" />}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#fff9f9]/80 backdrop-blur-md p-6 sm:p-10 rounded-[3rem] border border-white/80 shadow-lg lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 italic">Order Summary</h2>
                
                <div className="space-y-6 mb-8 max-h-[320px] overflow-y-auto pr-3 pt-4 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-5">
                      <div className="relative mt-1">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -top-2 -right-2 z-10 bg-pink-400 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.product.name}</p>
                        <p className="text-xs text-slate-500 font-medium italic">Handmade with love</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-pink-100">
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1 italic"><Truck className="h-3 w-3" /> Delivery</span>
                    <span>{shipping === 0 ? "Complimentary" : `Rs. ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-3xl pt-6 text-slate-900 tracking-tighter">
                    <span>Total</span>
                    <span className="text-pink-500">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 mt-10 bg-[#f48fb1] hover:bg-[#f06292] disabled:bg-slate-300 text-white rounded-full transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(244,143,177,0.4)] group border-none font-black tracking-widest uppercase text-xs"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>Place Your Order <Heart className="h-4 w-4 fill-white group-hover:scale-125 transition-transform" /></>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Secure Checkout Guaranteed</span>
                </div>
              </div>
            </div>
          </form>

          <div className="absolute top-8 right-12 text-pink-200/40 text-6xl select-none">✿</div>
          <div className="absolute bottom-10 left-12 text-pink-200/40 text-4xl select-none">✦</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}