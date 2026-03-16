import { Youtube, Instagram, Facebook, Mail, MessageCircle, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer.tsx";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchContactSettings() {
      const { data } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
    }
    fetchContactSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    setSent(true); 
    setTimeout(() => setSent(false), 4000); 
  };

  const formatExternalLink = (url: string) => {
    if (!url) return "#";
    const cleanUrl = url.trim();
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  };

  const contactMethods = [
    { 
      icon: <Youtube className="h-6 w-6" />, 
      title: "YouTube", 
      val: settings?.youtube_url || "https://www.youtube.com/@SAeeda/featured", 
      href: formatExternalLink(settings?.youtube_url || "https://www.youtube.com/@SAeeda/featured") 
    },
    { 
      icon: <Instagram className="h-6 w-6" />, 
      title: "Instagram", 
      val: settings?.instagram_handle || "@lilycrafts.co", 
      href: formatExternalLink(settings?.instagram_url || "http://www.instagram.com/lilycrafts.co") 
    },
    { 
      icon: <Facebook className="h-6 w-6" />, 
      title: "Facebook", 
      val: settings?.facebook_url || "https://www.facebook.com/saeeda.uzair/", 
      href: formatExternalLink(settings?.facebook_url || "https://www.facebook.com/saeeda.uzair/") 
    },
    { 
      icon: <MessageCircle className="h-6 w-6" />, 
      title: "WhatsApp", 
      val: settings?.whatsapp || "Contact us", 
      href: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : "#" 
    },
    { 
      icon: <Mail className="h-6 w-6" />, 
      title: "Gmail", 
      val: settings?.contact_email || "saeeda.iuzair@gmail.com", 
      href: `mailto:${settings?.contact_email}` 
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col font-serif">
     
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: "url('/artisanal_story.png')",
            filter: "blur(8px) brightness(1.05)" 
          }}
        />
        <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[1px]" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 md:px-8">
        <div className="max-w-2xl w-full backdrop-blur-md bg-white/40 border border-white/60 rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_80px_rgba(200,150,160,0.2)] p-5 sm:p-8 md:p-12 relative overflow-hidden">
          
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[clamp(2rem,8vw,3rem)] md:text-5xl font-medium text-slate-800 tracking-tight">
              Get in Touch <span className="text-rose-400/80 italic font-light">♡</span>
            </h1>
            <p className="text-slate-500 italic mt-2 text-sm sm:text-lg">We'd love to hear from you!</p>
          </div>

          <div className="flex justify-center">
            <div className="space-y-3 sm:space-y-4 bg-rose-100/40 p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/40 shadow-sm w-full max-w-md">
              {contactMethods.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 min-h-[44px] rounded-[1rem] sm:rounded-[1.5rem] bg-white/70 border border-white/60 transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-rose-50/50 text-rose-400 border border-rose-100/50 shadow-sm group-hover:bg-rose-400 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">{item.title}</span>
                    <span className="text-slate-700 font-medium group-hover:text-rose-500 transition-colors truncate text-sm md:text-base">
                      {item.val}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 right-8 text-rose-200 opacity-60">✦</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}