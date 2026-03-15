import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AnalyticsTracker from "./components/layout/AnalyticsTracker";




// Public Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category"; 
import LilyProductDetail from "./pages/LilyProductDetail";
import LilyCheckout from "./pages/LilyCheckout";
import TrackOrder from "./pages/TrackOrder";
import OrderHistory from "./pages/OrderHistory";
import CustomizedOrder from "./pages/CustomizedOrder";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import AdminPanel from './pages/admin/AdminPanel';
import AdvancePayment from "./pages/AdvancePayment";
import Success from "./pages/Success";
import AdminProduct from "./pages/admin/AdminProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <AnalyticsTracker />
            <ScrollToTop />
          
              {/* --- Public Routes ONLY --- */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/category/:category" element={<Category />} />
              <Route path="/product/:id" element={<LilyProductDetail />} />
              <Route path="/checkout" element={<LilyCheckout />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/customized-order" element={<CustomizedOrder />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/advance-payment" element={<AdvancePayment />} />
              <Route path="/success" element={<Success />} />
              <Route path="/admin/AdminProduct/:id" element={<AdminProduct/>} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;