import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LoadingScreen from "@/components/LoadingScreen"; // Imported Loader
import { 
  Search, Edit, Trash2, X, Save, 
  Layers, Info, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const categoryList = ["Mobile Charms", "Jhumki", "Trays", "Key Chains", "Quilling Art", "Crochet items", "Jewelry", "Home Decor"];

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setIsLoading(true); // Start loading
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) toast.error("Failed to load products");
    else setProducts(data || []);
    setIsLoading(false); // End loading
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) {
      toast.error("Could not delete product");
    } else {
      setProducts(products.filter(p => p.id !== deleteId));
      toast.success("Product permanently removed");
    }
    setDeleteId(null);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        price: Number(editingProduct.price),
        description: editingProduct.description,
        categories: editingProduct.categories,
        in_stock: editingProduct.in_stock,
        is_new: editingProduct.is_new,
        is_best_seller: editingProduct.is_best_seller
      })
      .eq('id', editingProduct.id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    }
    setIsSaving(false);
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // 1. Return Loader if fetching data
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative">
      
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-300 h-6 w-6" />
        <input 
          type="text" 
          placeholder="Search through Lilycrafts inventory..." 
          className="w-full pl-16 pr-6 py-5 bg-white rounded-full border-2 border-rose-50 outline-none focus:border-rose-400 shadow-sm font-bold text-slate-700 text-lg transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="group bg-white rounded-[2rem] border-2 border-rose-50 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                 {p.is_new && <span className="bg-rose-500 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter">New Arrival</span>}
                 {p.is_best_seller && <span className="bg-amber-400 text-black text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter">Bestseller</span>}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-serif text-lg font-bold text-slate-900 truncate">{p.name}</h4>
              <p className="text-rose-500 font-black text-base mb-4">Rs. {p.price}</p>
              
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => setEditingProduct(p)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all active:scale-95"
                >
                  <Edit size={12} /> Edit
                </button>
                <button 
                  onClick={() => setDeleteId(p.id)}
                  className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- UNIFORM COLOR DELETE MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center border-4 border-rose-50">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-rose-500" size={40} />
            </div>
            <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm font-bold mb-8">This will permanently remove the item. This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete} 
                className="w-full py-4 bg-slate-900 rounded-2xl font-black text-white uppercase tracking-widest text-xs hover:bg-rose-600 transition-all active:scale-95"
              >
                Yes, Delete Product
              </button>
              <button 
                onClick={() => setDeleteId(null)} 
                className="w-full py-4 bg-slate-900 rounded-2xl font-black text-white uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95"
              >
                No, Keep Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL EDIT DRAWER --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-serif font-bold text-slate-900">Edit Product</h3>
                <p className="text-rose-400 text-xs font-black uppercase tracking-widest">Update item details</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-3 hover:bg-rose-50 rounded-full text-slate-400 transition-colors"><X /></button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8 pb-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Info size={14}/> Basic Info</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-rose-300 outline-none font-bold"
                  placeholder="Product Name"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
                <div className="flex items-center gap-0">
                  <div className="bg-slate-900 text-white px-5 py-4 rounded-l-2xl font-bold text-sm">Rs.</div>
                  <input 
                    type="number"
                    className="flex-1 p-4 bg-slate-50 rounded-r-2xl border-2 border-transparent focus:border-rose-300 outline-none font-bold"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                  />
                </div>
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-rose-300 outline-none font-bold h-32 resize-none"
                  placeholder="Product Description"
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Layers size={14}/> Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryList.map(cat => (
                    <button
                      key={cat} type="button"
                      onClick={() => setEditingProduct({...editingProduct, categories: [cat]})}
                      className={`text-left p-3 rounded-xl text-xs font-bold border-2 transition-all ${editingProduct.categories?.includes(cat) ? 'bg-rose-100 border-rose-300 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-slate-50">
                <StatusToggle label="In Stock" checked={editingProduct.in_stock} onChange={(v: any) => setEditingProduct({...editingProduct, in_stock: v})} color="bg-emerald-500" />
                <StatusToggle label="New Arrival" checked={editingProduct.is_new} onChange={(v: any) => setEditingProduct({...editingProduct, is_new: v})} color="bg-rose-500" />
                <StatusToggle label="Best Seller" checked={editingProduct.is_best_seller} onChange={(v: any) => setEditingProduct({...editingProduct, is_best_seller: v})} color="bg-amber-400" />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl disabled:opacity-50"
              >
                {isSaving ? "Saving Changes..." : <><Save size={18} /> Update Live Store</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusToggle({ label, checked, onChange, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
      <span className="font-bold text-xs text-slate-700 uppercase tracking-tighter">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-all border border-black/5 ${checked ? color : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}