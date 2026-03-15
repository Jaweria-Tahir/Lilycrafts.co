import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Instagram, MessageCircle, Youtube, Globe, Facebook, Mail, Pencil, X, Check, Lock, User
} from "lucide-react"; 

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [socials, setSocials] = useState({
    youtube_url: "",
    instagram_url: "",
    instagram_handle: "",
    facebook_url: "",
    whatsapp: "",
    contact_email: "",
    admin_username: "",
    admin_password: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
    if (data) setSocials(data);
    if (error) console.error("Error fetching:", error);
  }

  const handleQuickSave = async (field: string, value: string) => {
    setLoading(true);
    const { error } = await supabase.from('shop_settings').update({ [field]: value }).eq('id', 1);
    
    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success("Updated successfully!");
      setEditingField(null);
      fetchSettings();
    }
    setLoading(false);
  };

  const SocialRow = ({ icon: Icon, label, value, field, isPassword = false }: any) => {
    const isEditing = editingField === field;
    const [tempValue, setTempValue] = useState(value);

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border-[3px] border-black rounded-2xl gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-rose-500">
            <Icon size={20} />
          </div>
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
            {isEditing ? (
              <input 
                autoFocus
                type={isPassword ? "text" : "text"} // Keeping it text so you can see what you're typing, or "password" for safety
                className="font-bold text-black bg-white border-b-2 border-rose-400 outline-none w-full"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            ) : (
              <span className="font-bold text-black truncate italic">
                {isPassword ? "••••••••" : (value || "Not Set")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          {isEditing ? (
            <>
              <button onClick={() => setEditingField(null)} className="p-2 bg-slate-200 rounded-lg border-2 border-black"><X size={16} /></button>
              <button disabled={loading} onClick={() => handleQuickSave(field, tempValue)} className="p-2 bg-green-400 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Check size={16} color="white" strokeWidth={3} />
              </button>
            </>
          ) : (
            <button onClick={() => { setEditingField(field); setTempValue(value); }} className="px-4 py-2 bg-white rounded-xl border-2 border-black font-black text-[10px] uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-10 px-4">
      
      {/* 1. ADMIN ACCESS CARD */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 border-b-[3px] border-black pb-6 mb-8 text-left">
          <div className="bg-black p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tighter text-2xl text-black leading-none">Admin Login</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Credentials for this dashboard</p>
          </div>
        </div>
        <div className="space-y-4">
          <SocialRow icon={User} label="Admin Username" value={socials.admin_username} field="admin_username" />
          <SocialRow icon={Lock} label="Admin Password" value={socials.admin_password} field="admin_password" isPassword={true} />
        </div>
      </div>

      {/* 2. GLOBAL LINKS CARD */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 border-b-[3px] border-black pb-6 mb-8 text-left">
          <div className="bg-rose-500 p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tighter text-2xl text-black leading-none">Global Links</h3>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Updates everywhere on site</p>
          </div>
        </div>
        <div className="space-y-4">
          <SocialRow icon={Youtube} label="YouTube URL" value={socials.youtube_url} field="youtube_url" />
          <SocialRow icon={Instagram} label="Instagram URL" value={socials.instagram_url} field="instagram_url" />
          <SocialRow icon={Instagram} label="Instagram Handle" value={socials.instagram_handle} field="instagram_handle" />
          <SocialRow icon={Facebook} label="Facebook URL" value={socials.facebook_url} field="facebook_url" />
          <SocialRow icon={MessageCircle} label="WhatsApp Number" value={socials.whatsapp} field="whatsapp" />
          <SocialRow icon={Mail} label="Gmail Address" value={socials.contact_email} field="contact_email" />
        </div>
      </div>
      
    </div>
  );
}