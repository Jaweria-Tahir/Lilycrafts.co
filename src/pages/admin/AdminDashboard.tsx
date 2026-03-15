import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Banknote, Package, Users, BarChart3, RefreshCcw, Hammer, Info } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalSales: 0, 
    orderCount: 0, 
    productCount: 0, 
    memberCount: 0,
    customCount: 0 
  });
  const [loading, setLoading] = useState(true);

  const getBusinessData = async () => {
    try {
      // 1. Fetch Orders and Sales
      const { data: salesData } = await supabase.from('orders').select('total_price');
      
      // 2. Fetch Product Count
      const { count: items } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // 3. Fetch Customer Count
      const { count: members } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      
      // 4. Fetch Customised Orders Count
      const { count: customs, error: customError } = await supabase
        .from('customised_orders')
        .select('*', { count: 'exact', head: true });

      if (customError) console.error("Custom Order Fetch Error:", customError);

      const totalMoney = salesData?.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0) || 0;
      
      setStats({
        totalSales: totalMoney,
        orderCount: salesData?.length || 0,
        productCount: items || 0,
        memberCount: members || 0,
        customCount: customs || 0 
      });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBusinessData();

    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => getBusinessData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customised_orders' }, () => getBusinessData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin h-12 w-12 border-t-4 border-black rounded-full mb-4"></div>
      <p className="font-black uppercase text-xs tracking-widest text-slate-500">Recalculating Wealth...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Real-time Overview</h2>
        <button 
          onClick={getBusinessData} 
          className="p-2 hover:rotate-180 transition-transform duration-500 text-slate-400 hover:text-black"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatBox 
          label="Total Money" 
          amount={`Rs. ${stats.totalSales.toLocaleString()}`} 
          icon={<Banknote size={24} />} 
          color="bg-emerald-100 text-emerald-700" 
          note="Excludes Customized Orders" // The Professional Disclaimer
        />
        <StatBox 
          label="Orders Made"
          amount={stats.orderCount}
          icon={<ShoppingCart size={24} />}
          color="bg-rose-100 text-rose-600" note={undefined}        />
        <StatBox 
          label="Customised"
          amount={stats.customCount}
          icon={<Hammer size={24} />}
          color="bg-amber-100 text-amber-600" note={undefined}        />
        <StatBox 
          label="Items for Sale"
          amount={stats.productCount}
          icon={<Package size={24} />}
          color="bg-blue-100 text-blue-600" note={undefined}        />
        <StatBox 
          label="Our Community"
          amount={stats.memberCount}
          icon={<Users size={24} />}
          color="bg-purple-100 text-purple-600" note={undefined}        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-rose-500" size={28} />
            <h3 className="text-2xl font-black uppercase tracking-tight">Business Health</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-black">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Avg. Sale Value</p>
              <p className="text-3xl font-black">
                Rs. {stats.orderCount > 0 ? Math.round(stats.totalSales / stats.orderCount).toLocaleString() : 0}
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-black">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</p>
              <p className="text-xl font-black text-emerald-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Sync Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, amount, icon, color, note }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform flex flex-col justify-between">
      <div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${color}`}>
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tight">{amount}</p>
      </div>

      {note && (
        <div className="mt-4 pt-3 border-t-2 border-black/5 flex items-center gap-1.5">
          <Info size={12} className="text-rose-400" />
          <p className="text-[9px] font-bold text-slate-400 leading-none uppercase italic">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}