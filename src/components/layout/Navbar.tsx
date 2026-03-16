import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { useProducts } from "@/lib/useProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: productsFromDb } = useProducts();
  const PRODUCTS = (productsFromDb && productsFromDb.length > 0) ? productsFromDb : STATIC_PRODUCTS;

  const { totalItems, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
    { name: "Reviews", path: "/reviews" },
    { name: "Categories", path: "/categories" },
    { name: "Custom Orders", path: "/customized-order" },
  ];

  const orderLinks = [
    { name: "Track Order", path: "/track-order" },
    { name: "Order History", path: "/order-history" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-white py-2.5 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-2">

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 -ml-2 hover:bg-rose/5 rounded-full"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>

          {/* LOGO */}
          <Link
            to="/"
            className="justify-self-center lg:justify-self-start flex items-center gap-1.5 sm:gap-2 group max-w-[44vw] sm:max-w-none"
          >
            <img
              src="/lilycrafts_bg_pattern.png"
              alt="Logo"
              className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full object-cover border border-rose/20 shadow-sm shrink-0"
            />
            <span className="font-serif text-[clamp(0.85rem,4.6vw,1.45rem)] sm:text-xl md:text-2xl font-bold text-slate-950 tracking-tight whitespace-nowrap truncate">
              Lilycrafts<span className="text-rose">.co</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                  currentPath === link.path
                    ? "text-rose"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* ORDERS DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-950 outline-none">
                Orders
                <ChevronDown className="h-3 w-3 opacity-60" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="p-2 rounded-xl shadow-xl border border-rose/10">
                {orderLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link
                      to={link.path}
                      className="text-xs font-bold uppercase tracking-wider py-2 cursor-pointer hover:text-rose"
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1 sm:gap-3">

            <button
              onClick={() => setSearchOpen(true)}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 hover:bg-rose/5 rounded-full"
            >
              <Search className="h-5 w-5 text-slate-700" />
            </button>

            <Link
              to="/wishlist"
              className="relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 hover:bg-rose/5 rounded-full"
            >
              <Heart className="h-5 w-5 text-slate-700" />

              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 hover:bg-rose/5 rounded-full"
            >
              <ShoppingBag className="h-5 w-5 text-slate-700" />

              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-rose text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>

        {searchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-3">
            <form onSubmit={handleSearch} className="w-full rounded-full border border-rose/20 bg-white/90 backdrop-blur-sm shadow-sm px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500 shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
              {hasSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-rose/5"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
              <button type="submit" className="px-4 py-2 rounded-full bg-rose text-white text-xs font-bold uppercase tracking-wider hover:bg-rose/90">
                Go
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-rose/5"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[100] ${mobileMenuOpen ? "visible" : "invisible"}`}>
        
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[86vw] max-w-[320px] bg-white shadow-2xl transition-transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">

            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <span className="font-serif text-xl font-bold">Menu</span>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-rose/5 rounded-full"
              >
                <X className="h-5 w-5 text-rose" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-6 py-4 text-sm font-medium ${
                    currentPath === link.path
                      ? "text-rose bg-rose/5"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}

              <div className="mt-4 border-t border-slate-100 pt-4">
                {orderLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-medium text-slate-600 hover:text-rose"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

            </div>

            <div className="p-6 bg-slate-50">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-rose text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-rose/20"
              >
                Shop Collection
              </Link>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}