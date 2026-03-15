import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";


export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // Free shipping threshold (example: 5000)
  const shippingThreshold = 5000;
  const progress = Math.min((totalPrice / shippingThreshold) * 100, 100);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop with heavy blur */}
      <div 
        className="absolute inset-0 bg-rose-900/10 backdrop-blur-md transition-opacity duration-500" 
        onClick={closeCart} 
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-[400px] bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col animate-slide-in-right border-l border-white/40">
        
        {/* Header - Elegant & Clean */}
        <div className="p-6 border-b border-rose-50 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-slate-900">Your Bag</h2>
            <p className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mt-1">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} selected
            </p>
          </div>
          <button 
            onClick={closeCart} 
            className="p-2.5 hover:bg-rose-50 rounded-full transition-all duration-300 text-slate-400 hover:text-rose-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>


        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <ShoppingBag className="h-16 w-16 text-rose-100" />
                <Heart className="h-6 w-6 text-rose-300 absolute -bottom-1 -right-1 fill-rose-300 animate-pulse" />
              </div>
              <p className="font-serif text-xl text-slate-800">Your bag is lonely</p>
              <p className="text-sm text-slate-500 mt-2 mb-8">Fill it with some handmade magic!</p>
              <button 
                onClick={() => { navigate("/shop"); closeCart(); }} 
                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-rose transition-all duration-300 shadow-lg"
              >
                Go to Shop
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="group relative flex gap-4 transition-all duration-300">
                {/* Image Container */}
                <div className="w-24 h-28 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-slate-900 leading-tight line-clamp-2 text-sm uppercase tracking-wide">
                        {item.product.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 italic">{item.product.category}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Pretty Quantity Selector */}
                    <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-serif font-bold text-rose">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Solid & Powerful */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-rose-50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-sm">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 border-t border-rose-50 pt-3">
                <span className="font-serif text-lg font-bold">Total Amount</span>
                <span className="font-serif text-xl font-bold text-rose">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { navigate("/checkout"); closeCart(); }}
                className="w-full bg-rose text-white py-4 rounded-2xl font-bold shadow-rose-200 shadow-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={closeCart} 
                className="w-full text-slate-400 py-2 text-xs font-bold uppercase tracking-widest hover:text-rose transition-colors"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}