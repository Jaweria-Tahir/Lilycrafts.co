import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Instagram, Mail, Youtube, Heart, ArrowRight, MapPin, Phone, Facebook, X, Linkedin, Code2 } from "lucide-react";

// --- DEVELOPER MODAL COMPONENT ---
function DeveloperModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const devs = [
    {
      name: "Jaweria Tahir",
      email: "jaweriatahir368@gmail.com",
      linkedin: "https://www.linkedin.com/in/jaweria-tahir-9327a137a",
      img: "/dev_jaweria.jpg"
    },
    {
      name: "Sumiya Anjum",
      email: "sumiyaanjum121@gmail.com",
      linkedin: "https://www.linkedin.com/in/sumiya-anjum-25a7682b1",
      img: "/dev_sumiya.jpg"
    }
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#FFF0F3] w-full max-w-3xl rounded-[4rem] shadow-2xl border-[6px] border-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white rounded-full text-rose hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-lg z-20">
          <X size={24} />
        </button>
        <div className="p-12 md:p-16 text-center relative">
          <Heart className="absolute -top-10 -left-10 text-rose/5 rotate-12" size={200} />
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose/10 text-rose text-xs font-black uppercase tracking-[0.2em] mb-6 relative z-10">
            <Code2 size={16} /> The Minds Behind the Magic
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-12 relative z-10">
            Meet the <em className="text-rose italic">Developers</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10">
            {devs.map((dev) => (
              <div key={dev.name} className="group relative bg-white/30 backdrop-blur-sm p-8 rounded-[3rem] border border-white/50 hover:bg-white/50 transition-all duration-500 shadow-xl hover:-translate-y-2">
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
                  <div className="absolute inset-0 bg-rose/20 rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                  <img src={dev.img} alt={dev.name} className="relative w-full h-full object-cover rounded-[3rem] border-4 border-white shadow-xl grayscale-[50%] group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <h4 className="font-serif text-2xl text-slate-950 mb-3">{dev.name}</h4>
                <div className="flex flex-col gap-2">
                  <a href={`mailto:${dev.email}`} className="text-xs md:text-sm font-bold text-slate-500 hover:text-rose transition-colors flex items-center justify-center gap-2">
                    <Mail size={14} className="text-rose/60" /> {dev.email}
                  </a>
                  <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-2 bg-rose text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-md">
                    <Linkedin size={12} fill="currentColor" /> View LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/60 p-6 text-center border-t border-rose/10">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 italic">Handcrafted with Love for Lilycrafts.co</p>
        </div>
      </div>
    </div>
  );
}

// Updated Categories: Removed Jhumkis and Crochet Items
const MY_CATEGORIES = ["Mobile Charms", "Trays", "Key Chains", "Quilling Art", "Jewelry", "Home Decor"];

function FooterLogo() {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex-shrink-0"> 
          <div className="absolute inset-0 bg-rose/20 rounded-full animate-ping scale-75 group-hover:scale-100 transition-transform" />
          <img src="/lilycrafts_bg_pattern.png" alt="Lilycrafts Logo" className="relative w-full h-full object-cover rounded-full border-2 border-white shadow-md transition-transform duration-500 group-hover:rotate-[10deg]" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-2xl font-bold text-slate-900 tracking-tighter leading-tight">Lilycrafts<span className="text-rose">.co</span></span>
          <span className="text-[8px] tracking-[0.3em] uppercase font-black text-rose/80 -mt-0.5 ml-0.5">Handmade Luxury</span>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const { data } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
        if (data) setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
    fetchFooterSettings();
  }, []);

  const instagramLink = "https://www.instagram.com/lilycrafts.co";
  const whatsappLink = settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : "#";

  return (
    <footer className="w-full relative">
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />
      
      {/* Wave Transition */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 transform -translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Instagram Section */}
      <div className="relative py-12 overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-rose to-purple-400 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-all duration-700" />
              <div className="relative bg-white/80 backdrop-blur-xl p-5 rounded-full shadow-lg border border-rose/5 transform transition duration-700 group-hover:scale-110 group-hover:rotate-12">
                <Instagram className="h-8 w-8 text-rose" strokeWidth={1.5} />
              </div>
            </a>
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-light mb-3 text-slate-950 tracking-tight">
            Let's create <em className="italic font-semibold text-rose shimmer-heading">magic</em> together
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-8 italic">
            "Your support for handmade turns small dreams into beautiful realities."
          </p>
          <a href={instagramLink} target="_blank" rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-10 py-3.5 bg-slate-950 text-white rounded-full font-bold overflow-hidden shadow-xl transition-all hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-3 tracking-widest uppercase text-[10px]">
              Join our family <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#FFD6DD] relative pt-14 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-4 gap-10 lg:gap-8">

            <div className="space-y-6">
              <FooterLogo />
              <div className="bg-white/40 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/40 shadow-sm">
                <p className="text-xs text-slate-900 font-bold leading-relaxed italic">
                  "Every stitch and every bead is crafted with a part of my heart, just for you."
                </p>
              </div>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={18} />, href: instagramLink },
                  { icon: <Facebook size={18} />, href: settings?.facebook_url },
                  { icon: <Youtube size={18} />, href: settings?.youtube_url },
                  { icon: <Mail size={18} />, href: `mailto:${settings?.contact_email}` },
                ].map((item, i) => (
                  <a key={i} href={item.href || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-all duration-500 shadow-md">
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:pl-6">
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-rose mb-6 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-rose/30"></span> Explore
              </h4>
              <ul className="space-y-3.5">
                {[["Home", "/"], ["The Shop", "/shop"], ["Get in Touch", "/contact"], ["Order History", "/track-order"]].map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-xs text-slate-800 hover:text-rose transition-all font-bold flex items-center gap-2 group">
                      <Heart className="h-0 w-0 group-hover:h-3 group-hover:w-3 text-rose transition-all fill-rose" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLLECTIONS SECTION */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-rose mb-6 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-rose/30"></span> Collections
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {MY_CATEGORIES.map(cat => (
                  <li key={cat}>
                    <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="text-[11px] text-slate-800 hover:text-rose transition-all font-bold uppercase tracking-wider block px-3 py-1 rounded-lg hover:bg-white/30">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-rose mb-6 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-rose/30"></span> Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/30 border border-white/20">
                  <MapPin className="text-rose h-4 w-4 shrink-0 mt-1" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-rose/60 tracking-widest block">Based in</span>
                    <span className="text-xs font-bold text-slate-900 italic">Lahore, Pakistan</span>
                  </div>
                </div>
                <div className="space-y-3 px-1">
                  <a href={`mailto:${settings?.contact_email}`} className="flex items-center gap-3 text-xs text-slate-900 font-bold hover:text-rose transition-colors">
                    <Mail size={14} className="text-rose" /> {settings?.contact_email || "Email us"}
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-900 font-bold hover:text-rose transition-colors">
                    <Phone size={14} className="text-rose" /> {settings?.whatsapp || "WhatsApp"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-rose/10 pt-8 pb-4 bg-[#FFB8C4]"> 
          <div className="max-w-7xl mx-auto px-6 flex flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-slate-900 tracking-[0.2em] uppercase font-black flex items-center gap-2">
              © {new Date().getFullYear()} Lilycrafts — Handmade with <Heart size={10} className="fill-rose text-rose animate-pulse" />
            </p>
            <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] font-black">
              <button onClick={() => setIsDevModalOpen(true)} className="text-slate-950 hover:text-white transition-all flex items-center gap-1.5 group cursor-pointer">
                <Code2 size={10} className="group-hover:rotate-12 transition-transform" />
                Developers
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}