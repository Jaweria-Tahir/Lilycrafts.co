import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Calendar, Search, Users, 
  ArrowRight, MessageCircle, Clock, Mail 
} from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("id, full_name, email, phone, address, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const formatChatNumber = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  // HANDLES THE REDIRECT TO ORDERS
  const handleViewHistory = (email: string) => {
    // 1. Store the email in localStorage
    localStorage.setItem("lilyAdminOrderSearch", email);
    
    // 2. Dispatch event to switch tab in the Admin Layout
    const event = new CustomEvent("switchAdminTab", { 
      detail: "orders",
      bubbles: true 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-10 px-4 font-sans">
      <div className="mb-10 p-10 bg-[#FFF0F3] rounded-[2rem] border-4 border-black flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-serif font-black text-black mb-2 tracking-tighter">Lilycrafts Inner Circle</h1>
          <p className="text-rose-600 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
            <Users size={14} /> Total Community Members: {customers.length}
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
          <input 
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-12 pr-6 py-4 bg-white border-4 border-black rounded-2xl outline-none focus:bg-rose-50 font-bold placeholder:text-slate-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(255,182,193,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white uppercase text-[10px] tracking-[0.25em] font-black">
                <th className="px-8 py-6 border-r border-white/20">Customer Detail</th>
                <th className="px-8 py-6 border-r border-white/20">Contact & Social</th>
                <th className="px-8 py-6 border-r border-white/20">Last Activity</th>
                <th className="px-8 py-6">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center italic font-bold text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center font-black text-slate-400 uppercase tracking-widest">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-rose-50/30 transition-colors group">
                    <td className="px-8 py-6 border-r-4 border-black">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-rose-100 text-black rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          {customer.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-black text-black text-xl leading-none mb-2">{customer.full_name}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Calendar size={12} className="text-rose-400" /> Joined {new Date(customer.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 border-r-4 border-black">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-black px-3 py-2 bg-slate-50 border-2 border-black rounded-xl">
                          <Mail className="h-3 w-3 text-rose-500" /> {customer.email}
                        </div>
                        {customer.phone && (
                          <a 
                            href={`https://wa.me/${formatChatNumber(customer.phone)}`}
                            target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-xs font-black text-green-700 px-3 py-2 bg-green-50 border-2 border-green-600 rounded-xl"
                          >
                            <MessageCircle className="h-3 w-3 fill-green-600" /> {customer.phone}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-8 py-6 border-r-4 border-black max-w-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-black text-black">
                          <Clock className="h-4 w-4 text-rose-500" />
                          {new Date(customer.updated_at).toLocaleDateString()}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic truncate">
                          {customer.address || "No address provided"}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleViewHistory(customer.email)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                      >
                        View History <ArrowRight size={14} />
                      </button>
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