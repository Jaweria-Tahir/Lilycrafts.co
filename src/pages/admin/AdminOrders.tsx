import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { notifyOrderDeleted } from "@/lib/emailService";
import LoadingScreen from "@/components/LoadingScreen";
import { 
  User, MapPin, Phone, Mail, 
  CreditCard, Hash, Wallet, Filter, Search, Trash2,
  Palette, Box, Image as ImageIcon, ClipboardList, Sparkles, Scissors, Layers
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [orderType, setOrderType] = useState<"Standard" | "Custom">("Standard");

  useEffect(() => {
    fetchOrders();
    
    const pendingSearch = localStorage.getItem("lilyAdminOrderSearch");
    if (pendingSearch) {
      setSearchTerm(pendingSearch);
      setTimeout(() => localStorage.removeItem("lilyAdminOrderSearch"), 1000);
    }
  }, [orderType]);

  useEffect(() => {
    let result = [...orders];
    
    if (statusFilter !== "All") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase().trim();
      result = result.filter(order => 
        (order.customer_name || order.name)?.toLowerCase().includes(lowerSearch) || 
        (order.customer_email || order.email)?.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredOrders(result);
  }, [statusFilter, orders, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    setOrders([]); 
    try {
      if (orderType === "Standard") {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData && ordersData.length > 0) {
          const emails = [...new Set(ordersData.map(o => o.customer_email))];
          const { data: customersData } = await supabase
            .from('customers')
            .select('email, phone, address')
            .in('email', emails);

          const combined = ordersData.map(order => ({
            ...order,
            customers: customersData?.find(c => c.email === order.customer_email) || null
          }));
          setOrders(combined);
        }
      } else {
        const { data: customData, error: customError } = await supabase
          .from('customised_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (customError) throw customError;
        setOrders(Array.isArray(customData) ? customData : []);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: any, newStatus: string) => {
    const table = orderType === "Standard" ? 'orders' : 'customised_orders';
    const cleanId = Number(id);

    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', cleanId); 
    
    if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update status");
    } else {
        toast.success(`Order set to ${newStatus}`);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const deleteOrder = async (id: any) => {
    const table = orderType === "Standard" ? 'orders' : 'customised_orders';
    const cleanId = Number(id);

    try {
      const orderToDelete = orders.find(o => o.id === id);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', cleanId);

      if (error) throw error;
      
      // Send deletion notification email silently
      if (orderToDelete) {
        notifyOrderDeleted({
          customerName: orderToDelete.customer_name || orderToDelete.name || 'Customer',
          customerEmail: orderToDelete.customer_email || orderToDelete.email || '',
          orderNumber: orderToDelete.order_number || orderToDelete.id.toString(),
          adminEmail: 'lilycraftco@gmail.com',
        });
      }
      
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success(`${orderType} order deleted`);
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[
          { id: "Standard", label: "Standard" },
          { id: "Custom", label: "Customised" },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setOrderType(id as any); setStatusFilter("All"); }}
            className={`px-8 py-3 rounded-2xl border-4 border-black font-black uppercase tracking-widest transition-all ${
              orderType === id
                ? "bg-rose-500 text-white shadow-none translate-y-1"
                : "bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
            }`}
          >
            {label} Orders
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-grow">
          <div className="flex items-center gap-2 px-4 font-black uppercase text-sm border-r-4 border-black">
            <Filter size={18} />
            <span>Status:</span>
          </div>
          <div className="flex gap-2">
            {["All", "Ordered", "Confirmed", "Delivered"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl border-2 border-black font-black text-[10px] uppercase tracking-widest transition-all ${
                  statusFilter === status 
                  ? "bg-black text-white shadow-none translate-y-1" 
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center px-4 min-w-[300px]">
          <Search size={20} className="text-black" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 outline-none font-bold text-sm bg-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="p-6 border-r border-white/20">Customer & ID</th>
                <th className="p-6 border-r border-white/20">Contact & Shipping</th>
                <th className="p-6 border-r border-white/20">Items & Custom Specs</th>
                <th className="p-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {filteredOrders.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="p-20 text-center font-black uppercase text-slate-400">
                        No {orderType === "Custom" ? "customised" : "standard"} orders found
                      </td>
                  </tr>
              ) : (
                filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="p-6 font-black align-top border-r-4 border-black">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className="text-rose-500" />
                          <p className="text-lg leading-none">{order.customer_name || order.name}</p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Hash size={12} />
                          <p className="text-[10px] uppercase tracking-tighter">
                            {order.order_number || order.id.toString().slice(0, 8)}
                          </p>
                        </div>
                      </td>
    
                      <td className="p-6 align-top border-r-4 border-black">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Mail size={14} className="text-slate-400" />
                            <span className="break-all">{order.customer_email || order.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Phone size={14} className="text-slate-400" />
                            <span>{order.customers?.phone || order.phone}</span>
                          </div>
                          <div className="flex gap-2 text-xs font-medium pt-2 border-t border-black/5">
                            <MapPin size={18} className="text-rose-500 flex-shrink-0" />
                            <p>{order.customers?.address || order.address}</p>
                          </div>
                        </div>
                      </td>
    
                      <td className="p-6 align-top border-r-4 border-black">
                        {orderType === "Standard" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 bg-white border-2 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                  {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                  <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase">{item.name}</p>
                                    <p className="text-[9px] opacity-60">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-black/10 flex items-center gap-2">
                                <CreditCard size={14} className="text-rose-600" />
                                <span className="font-black text-rose-600 text-lg">Rs. {Number(order.total_price).toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 bg-black text-white p-2 rounded-lg text-[10px] font-black uppercase">
                                <Box size={14} /> {order.category} / {order.item_type}
                              </div>
                              <div className="text-[11px] font-bold">
                                ITEM: <span className="text-rose-500 uppercase">{order.specific_item}</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(order.colors) ? order.colors.map((c: string) => (
                                  <span key={c} className="px-2 py-0.5 border-2 border-black rounded-md text-[8px] font-black uppercase bg-white flex items-center gap-1">
                                    <Palette size={8}/> {c}
                                  </span>
                                )) : order.colors && (
                                  <span className="px-2 py-0.5 border-2 border-black rounded-md text-[8px] font-black uppercase bg-white flex items-center gap-1">
                                    <Palette size={8}/> {order.colors}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 border-2 border-black rounded-md text-[8px] font-black uppercase bg-yellow-400">
                                  Size: {order.size}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-1 text-[9px] font-black uppercase text-slate-500">
                                {order.shape && <div className="flex items-center gap-1"><Scissors size={10}/> Shape: {order.shape}</div>}
                                {order.finish && <div className="flex items-center gap-1"><Layers size={10}/> Finish: {order.finish}</div>}
                                {order.glitter && <div className="flex items-center gap-1 text-rose-500"><Sparkles size={10}/> Glitter: {order.glitter}</div>}
                              </div>

                              {order.inspo_image_url && (
                                <a href={order.inspo_image_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black text-blue-600 underline">
                                  <ImageIcon size={14} /> View Inspo Image
                                </a>
                              )}
                              {order.special_instructions && (
                                <div className="p-2 bg-slate-50 border-2 border-dashed border-black rounded-lg">
                                  <p className="text-[9px] font-black uppercase flex items-center gap-1 mb-1">
                                    <ClipboardList size={12} /> Notes:
                                  </p>
                                  <p className="text-[10px] italic leading-tight">{order.special_instructions}</p>
                                </div>
                              )}
                          </div>
                        )}
                      </td>
    
                      <td className="p-6 align-middle space-y-3">
                        <select 
                          value={order.status || 'Ordered'}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="w-full bg-white border-4 border-black p-3 rounded-2xl text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
                        >
                          <option value="Ordered">Ordered</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button 
                              type="button"
                              className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 border-2 border-rose-600 rounded-2xl text-[9px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all"
                            >
                              <Trash2 size={12}/> Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#fff9f9] border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-serif p-6 sm:p-8">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Delete Order?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-600 font-medium text-sm">
                                Are you sure you want to delete this order? This action cannot be undone and will permanently remove it from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
                              <AlertDialogCancel className="rounded-2xl border-2 border-black font-black uppercase tracking-widest text-[10px] px-6 py-5 hover:bg-slate-100 transition-colors text-black bg-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteOrder(order.id)}
                                className="rounded-2xl border-2 border-black font-black uppercase tracking-widest text-[10px] px-6 py-5 hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1"
                                style={{ backgroundColor: '#e11d48', color: '#ffffff' }}
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}