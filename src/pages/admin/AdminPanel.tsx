import { useState, useEffect, useLayoutEffect } from "react";
import { 
  LayoutDashboard, ShoppingBag, Package, PlusCircle, 
  Users, Menu, X, LogOut, Settings 
} from "lucide-react";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen"; 

// Views
import Dashboard from "./AdminDashboard";
import Orders from "./AdminOrders";
import Inventory from "./AdminProduct";
import AddProduct from "./AdminNewProduct";
import Customers from "./AdminCustomer";
import AdminSettings from "./AdminSettings";
import AdminLogin from "./AdminLogin"; 

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lilyAdminTab") || "dash";
    }
    return "dash";
  });

  const [isOpen, setIsOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // --- SECURE SESSION GUARD ---
  // Runs before the browser paints to ensure no "peeking" at the dashboard
  useLayoutEffect(() => {
    const checkAuth = () => {
      // Changed to sessionStorage: This clears automatically when the tab is closed
      const auth = sessionStorage.getItem("isLilyAdmin") === "true";
      setIsAuthenticated(auth);
      setIsVerifying(false);
    };
    
    checkAuth();
  }, []);

  // Listen for storage changes (e.g., manual deletion in dev tools)
  useEffect(() => {
    const handleStorageChange = () => {
      const auth = sessionStorage.getItem("isLilyAdmin") === "true";
      if (!auth) setIsAuthenticated(false);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleSwitch = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener("switchAdminTab", handleSwitch);
    return () => window.removeEventListener("switchAdminTab", handleSwitch);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("lilyAdminTab", activeTab);
      
      const isHistorySearch = localStorage.getItem("lilyAdminOrderSearch");
      if (!isHistorySearch) {
          setIsLoading(true);
          const timer = setTimeout(() => setIsLoading(false), 400);
          return () => clearTimeout(timer);
      }
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
    // Clear the secure session
    sessionStorage.removeItem("isLilyAdmin");
    localStorage.removeItem("lilyAdminTab");
    localStorage.removeItem("lilyAdminOrderSearch");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  // 1. Verification Gate: Prevents flicker while checking session
  if (isVerifying) return null;

  // 2. Auth Gate: If no session, show ONLY the login page
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const menu = [
    { id: "dash", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "inv", label: "Products", icon: Package },
    { id: "add", label: "Add New", icon: PlusCircle },
    { id: "users", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch(activeTab) {
      case "dash": return <Dashboard />;
      case "orders": return <Orders />;
      case "inv": return <Inventory />;
      case "add": return <AddProduct />;
      case "users": return <Customers />;
      case "settings": return <AdminSettings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fffafa]" style={{ textAlign: 'left' }}>
      {isLoading && <LoadingScreen />}

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "bg-white border-r border-rose-100 transition-all duration-300 flex flex-col h-screen z-50",
          "flex lg:sticky lg:top-0",
          isOpen ? "lg:w-64" : "lg:w-20",
          "fixed top-0 left-0 w-72 max-w-[85vw] lg:relative lg:max-w-none",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        <div className="p-6 flex items-center justify-between">
          {isOpen && <h1 className="font-serif text-xl font-bold text-rose-500">LilyAdmin</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:inline-flex p-2 hover:bg-rose-50 rounded-xl text-slate-400"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all border-2 ${
                  isActive 
                    ? '!bg-black !text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
                    : 'text-slate-500 border-transparent hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <item.icon size={20} color={isActive ? "white" : "currentColor"} />
                {isOpen && <span className="font-black text-sm uppercase tracking-tighter">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* SECURE BLACK NEOBRUTALIST LOGOUT (No Rose Hover) */}
        <div className="p-4 border-t-4 border-black">
          <button 
            onClick={handleLogout} 
            className={`flex items-center gap-4 px-4 py-3 w-full transition-all group rounded-2xl border-2 border-black bg-white hover:bg-black hover:text-white hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${!isOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="text-black group-hover:text-white" />
            {isOpen && <span className="text-sm font-black uppercase tracking-tight">Logout Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto !text-left !max-w-none bg-[#fffafa]">
        <header className="mb-6 sm:mb-10 text-left flex items-start justify-between gap-4">
            <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-1">Lilycrafts Management</p>
            <h2 className="text-4xl font-serif text-slate-900 capitalize m-0">
                {menu.find(m => m.id === activeTab)?.label}
            </h2>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-rose-100 shadow-sm text-slate-500 hover:text-rose-500"
            >
              <Menu size={18} />
            </button>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderView()}
        </div>
      </main>
    </div>
  );
}