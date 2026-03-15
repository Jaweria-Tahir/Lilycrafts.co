import { motion, AnimatePresence } from "framer-motion";
import { X, History, MapPin, Edit3, Heart } from "lucide-react";
import { Link } from "react-router-dom";

// 1. THIS INTERFACE FIXES THE ERROR
interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { name: "Order History", path: "/order-history", icon: History },
  { name: "Track Order", path: "/track-order", icon: MapPin },
  { name: "Customized Order", path: "/customized-order", icon: Edit3 },
];

// 2. APPLY THE INTERFACE HERE
export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[300px] bg-white/90 backdrop-blur-xl shadow-2xl z-[101] p-8 flex flex-col border-r border-rose-50"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif italic text-2xl text-slate-900 font-medium">Lilycrafts</span>
              <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <nav className="space-y-6 flex-1">
              {MENU_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-11 w-11 rounded-2xl bg-rose-50 flex items-center justify-center group-hover:bg-rose group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-serif text-lg text-slate-700 group-hover:text-rose transition-colors">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8 border-t border-rose-100/50">
              <div className="flex items-center gap-2 text-rose/40 text-[10px] uppercase tracking-widest font-bold">
                <Heart className="h-3 w-3 fill-current" /> Handmade with Love
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}