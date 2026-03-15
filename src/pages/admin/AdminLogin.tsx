import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User, Key, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_access')
        .select('*')
        .eq('username', creds.user)
        .eq('password', creds.pass)
        .single();

      if (error || !data) {
        toast.error("Invalid details! Please check your credentials.");
      } else {
        // CHANGED: Use sessionStorage so it dies when the tab is closed
        sessionStorage.setItem("isLilyAdmin", "true");
        
        toast.success("Welcome back, Lily!");
        onLogin();
      }
    } catch (err) {
      // Updated to English
      toast.error("Connection error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-pink flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Sparkles */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-md w-full bg-white border-[3px] border-black rounded-[2.5rem] p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-10">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="bg-white p-4 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(255,105,180,1)] mb-4 transition-transform group-hover:scale-105 duration-500">
               <img 
                 src="/logo.png" 
                 alt="Lilycrafts Logo" 
                 className="h-16 w-auto object-contain"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.parentElement!.innerHTML = '<div class="p-2 text-rose-500"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>';
                 }}
               />
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black m-0">LilyAdmin</h1>
          <div className="h-1 w-10 bg-rose-400 mt-1 rounded-full" />
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em] mt-3 text-center">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="text-left">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-black mb-2 ml-1">
              <User size={14} className="text-rose-500" /> Username
            </label>
            <input 
              required
              className="w-full p-5 bg-white border-[3px] border-black rounded-2xl font-bold text-black outline-none focus:bg-[#FFF0F3] transition-all placeholder:text-slate-300"
              placeholder="Admin username"
              onChange={(e) => setCreds({...creds, user: e.target.value})}
            />
          </div>

          {/* Password with Show/Hide Toggle */}
          <div className="text-left">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-black mb-2 ml-1">
              <Key size={14} className="text-rose-500" /> Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                className="w-full p-5 bg-white border-[3px] border-black rounded-2xl font-bold text-black outline-none focus:bg-[#FFF0F3] transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                onChange={(e) => setCreds({...creds, pass: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'black',
              color: 'white',
              width: '100%',
              padding: '22px',
              borderRadius: '18px',
              border: '3px solid black',
              fontSize: '18px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '8px 8px 0px 0px rgba(255, 105, 180, 0.6)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '10px 10px 0px 0px rgba(255, 105, 180, 0.8)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '8px 8px 0px 0px rgba(255, 105, 180, 0.6)';
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Authenticating...
              </span>
            ) : (
              <>
                Open Dashboard <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] text-center">
          Handmade with Love by Lilycrafts
        </p>
      </div>
    </div>
  );
}