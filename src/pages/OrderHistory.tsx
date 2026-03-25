import { useState } from "react";
import { Trash2, AlertCircle, Search, ArrowRight, User, Mail, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Standard' | 'Custom'>('Standard');
  
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  
  const [sessionUser, setSessionUser] = useState<{name: string, email: string} | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{id: any, type: string} | null>(null);

  const fetchUserOrders = async (name: string, email: string) => {
    setLoading(true);
    setOrders([]);

    try {
      const emailTrimmed = email.trim().toLowerCase();
      const nameTrimmed = name.trim();

      const { data: standardData, error: standardError } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_name", nameTrimmed)
        .eq("customer_email", emailTrimmed);

      const { data: customData, error: customError } = await supabase
        .from("customised_orders")
        .select("*")
        .eq("name", nameTrimmed)
        .eq("email", emailTrimmed);

      if (standardError) throw standardError;
      if (customError) throw customError;

      const standardOrders = (standardData || []).map((o) => ({
        ...o,
        tableType: "Standard",
      }));

      const customOrders = (customData || []).map((o) => ({
        ...o,
        tableType: "Custom",
      }));

      const combinedOrders = [...standardOrders, ...customOrders].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

      if (combinedOrders.length > 0) {
        setOrders(combinedOrders);
        setSessionUser({ name: nameTrimmed, email: emailTrimmed });

        if (standardOrders.length === 0 && customOrders.length > 0) {
          setActiveTab("Custom");
        } else {
          setActiveTab("Standard");
        }
      } else {
        toast.error("No orders found. Both Name and Email must match our records.");
        setSessionUser(null);
      }
    } catch (err) {
      console.error("Database Error:", err);
      toast.error("Error connecting to database.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) {
      toast.error("Please enter both Name and Email");
      return;
    }
    fetchUserOrders(nameInput, emailInput);
  };

  const handleReset = () => {
    setSessionUser(null);
    setOrders([]);
    setNameInput("");
    setEmailInput("");
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const table = orderToDelete.type === 'Custom' ? 'customised_orders' : 'orders';
      const { error } = await supabase.from(table).delete().eq('id', orderToDelete.id);
      
      if (error) throw error;
      
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      setIsModalOpen(false);
      setOrderToDelete(null);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel order.");
    }
  };

  const filteredOrders = orders.filter(o => o.tableType === activeTab);

  return (
    <div className="relative min-h-screen w-full bg-pink-home-faded text-black font-serif">
      {/* --- BACKGROUND BLOBS (Matched to Shop/Reviews) --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border-4 border-black p-8 max-w-sm w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="font-black uppercase text-lg">Cancel Order?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-8 font-sans">This will permanently delete your order record from our system.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border-2 border-black font-bold text-xs uppercase font-sans">No</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase hover:bg-rose-500 border-2 border-black font-sans">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Navbar />
        <CartDrawer />
        
        
        <main className="max-w-4xl mx-auto px-6 py-16 md:py-20 relative">
          {/* --- PRETTY HEADING SECTION (Matches Shop.tsx) --- */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-[hsl(344,60%,45%)] via-[hsl(340,70%,70%)] to-[hsl(340,60%,90%)] bg-clip-text text-transparent italic animate-gradient-x"
                style={{ backgroundSize: '200% auto', fontFamily: "'Cormorant Garamond', serif", paddingBottom: '10px' }}>
              Order History
            </h1>
            <p className="text-lg md:text-xl text-slate-600 italic font-medium">
              Relive the magic of your <span className="text-rose-500 underline decoration-rose-200">past treasures 🌸</span>
            </p>

            {sessionUser && (
              <div className="flex flex-col items-center gap-4 mt-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <p className="text-rose font-medium italic">Found {orders.length} treasures for {sessionUser.name} ✨</p>
                <div className="flex gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-white/50 shadow-sm">
                  <button 
                    onClick={() => setActiveTab('Standard')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest font-sans ${activeTab === 'Standard' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black'}`}
                  >
                    Store Orders
                  </button>
                  <button 
                    onClick={() => setActiveTab('Custom')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest font-sans ${activeTab === 'Custom' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black'}`}
                  >
                    Customised
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mb-4">
             {sessionUser && (
                <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose border-b border-transparent hover:border-rose transition-all pb-1 font-sans">
                  Search Different Details
                </button>
              )}
          </div>

          {!sessionUser && !loading && (
            <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-8 md:p-16 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="text-rose" size={32} />
                </div>
                <h2 className="font-serif text-3xl mb-2 text-slate-900">Locate Your Orders</h2>
                <p className="text-slate-500 mb-8 italic text-sm">Please verify your details to view your history.</p>
                <form onSubmit={handleSearch} className="space-y-4">
                  <input 
                    type="text" placeholder="Full Name" value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border-2 border-rose-50 outline-none font-serif italic text-lg bg-white/80 focus:border-rose-200 transition-all" required
                  />
                  <input 
                    type="email" placeholder="Email Address" value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border-2 border-rose-50 outline-none font-serif italic text-lg bg-white/80 focus:border-rose-200 transition-all" required
                  />
                  <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl hover:bg-rose-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 font-sans">
                    View History <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {loading && <div className="text-center py-20 font-serif italic text-rose/60 animate-pulse text-xl">Accessing archives...</div>}

          {sessionUser && !loading && (
            <div className="grid gap-8 animate-in slide-in-from-bottom-5 duration-500">
              {filteredOrders.length === 0 ? (
                <div className="bg-white/30 rounded-3xl p-12 text-center border border-dashed border-rose-200">
                  <p className="text-slate-500 font-serif italic text-lg">No {activeTab.toLowerCase()} orders found.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="group bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose/50 font-sans">Order Reference</span>
                        <h2 className="font-serif text-3xl italic text-slate-900">
                          #{activeTab === 'Standard' ? (order.order_number || order.id) : (order.order_id || order.id)}
                        </h2>
                      </div>
                      <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest font-sans">
                        {order.status || "Ordered"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-rose-100/50">
                      <div>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 font-sans">Placed On</p>
                        <p className="font-serif text-lg text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2 font-sans">Order Details</p>
                        {activeTab === 'Custom' ? (
                          <div className="font-serif text-base text-slate-700 space-y-2 bg-rose-50/50 p-4 rounded-2xl">
                            <p><strong className="text-slate-900 uppercase text-xs tracking-wider font-sans">{order.category}</strong>: {order.specific_item}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p><span className="text-slate-400 font-sans text-[10px] uppercase font-bold">Colors:</span> {order.colors || 'N/A'}</p>
                              <p><span className="text-slate-400 font-sans text-[10px] uppercase font-bold">Size:</span> {order.size || 'N/A'}</p>
                            </div>
                            {order.glitter && <p className="text-sm"><span className="text-slate-400 font-sans text-[10px] uppercase font-bold">Glitter:</span> {order.glitter}</p>}
                            {order.special_instructions && (
                              <p className="mt-3 text-rose italic border-l-2 border-rose-200 pl-3 py-1">"{order.special_instructions}"</p>
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-5 bg-white/50 p-3 rounded-2xl border border-rose-50">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                <div className="leading-tight">
                                  <p className="text-lg font-serif italic text-slate-900">{item.name}</p>
                                  <p className="text-xs font-black uppercase text-rose/60 mt-1 font-sans">Quantity: {item.quantity || 1}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      {activeTab === 'Standard' && (
                        <p className="font-serif text-xl font-bold text-slate-900">
                          Total: <span className="text-rose">Rs. {Number(order.total_price || 0).toLocaleString()}</span>
                        </p>
                      )}
                      <button 
                        onClick={() => { setOrderToDelete({id: order.id, type: activeTab}); setIsModalOpen(true); }}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose transition-colors ml-auto group font-sans"
                      >
                        <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Cancel Order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient-x {
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
}