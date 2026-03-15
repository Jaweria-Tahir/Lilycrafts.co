import { useId, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { 
  X, Upload, Layers, Info, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

type FormData = {
  name: string;
  price: number;
  description: string;
  images: string[];
  categories: string[];
  in_stock: boolean;
  is_new: boolean;
  is_best_seller: boolean;
};

type StatusToggleProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  color: string;
};

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputId = useId();

  const categoryList = [
    "Mobile Charms",
    "Jhumki",
    "Trays",
    "Key Chains",
    "Quilling Art",
    "Crochet items",
    "Jewelry",
    "Home Decor"
  ];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    description: "", 
    images: [] as string[],
    categories: [] as string[], 
    in_stock: true,
    is_new: true,
    is_best_seller: false
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }

      // Basic safety limit (helps avoid slow uploads/timeouts)
      const MAX_MB = 8;
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`Image too large. Max ${MAX_MB}MB.`);
        return;
      }

      const imageUrl = await uploadToCloudinary(file);

      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
      toast.success("Image uploaded successfully!");

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleCategorySelect = (cat: string) => {
    // Note: Your DB uses TEXT[], so multiple categories are possible, 
    // but here we toggle one at a time as per your original logic.
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat) 
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) return toast.error("Please upload at least one image");
    if (formData.categories.length === 0) return toast.error("Please select at least one category");
    if (formData.price <= 0) return toast.error("Price must be greater than 0");

    setLoading(true);
    
    try {
      const productToSave = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        images: formData.images,
        categories: formData.categories,
        in_stock: formData.in_stock,
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        rating: 0,
        review_count: 0
      };

      const { error } = await supabase
        .from("products")
        .insert([productToSave]);

      if (error) throw error;

      toast.success("Success! Product is now live on Lilycrafts.");
      
      // IMPROVEMENT: Scroll to top so user sees the success state
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setFormData({ 
        name: "", 
        price: 0, 
        description: "", 
        images: [], 
        categories: [], 
        in_stock: true, 
        is_new: true, 
        is_best_seller: false 
      });

    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto pb-20 pt-10 px-4">
      
      {/* HEADER */}
      <div className="mb-10 p-10 bg-[#FFF0F3] rounded-[2rem] border border-rose-100">
        <h1 className="text-4xl font-serif font-black text-black mb-2">Add New Product</h1>
        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Handmade with Love by Lily</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-10">
          
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <Info size={20} className="text-rose-500" />
              <h3 className="font-bold text-black uppercase tracking-tighter text-lg">Product Details</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label-style">Product Title</label>
                <input 
                  required className="input-style" 
                  placeholder="e.g. Pink Floral Jhumki"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="label-style">Price (PKR)</label>
                <div className="flex items-center gap-0">
                  <div className="bg-black text-white px-6 py-4 rounded-l-2xl font-bold">Rs.</div>
                  <input 
                    type="number" required className="input-style rounded-l-none flex-1 border-l-0"
                    placeholder="00"
                    value={formData.price || ""}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="label-style">Description</label>
                <textarea 
                  required className="input-style h-40 resize-none"
                  placeholder="Describe your handmade creation..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <ImageIcon size={20} className="text-rose-500" />
              <h3 className="font-bold text-black uppercase tracking-tighter text-lg">Product Photos</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-black shadow-sm group">
                  <img src={img} className="object-cover w-full h-full" alt="Product" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14}/>
                  </button>
                </div>
              ))}
              
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-black rounded-2xl bg-white hover:bg-rose-50 cursor-pointer transition-all">
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
                ) : (
                  <>
                    <Upload className="text-black mb-1" size={24} />
                    <span className="text-[10px] font-black text-black uppercase">Add Photo</span>
                  </>
                )}
                <input
                  id={fileInputId}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || loading}
                />
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-8">
          
          <section className="bg-white p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-black uppercase text-sm mb-6 flex items-center gap-2">
              <Layers size={18}/> Category
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left px-5 py-4 rounded-xl font-bold border-2 transition-all ${
                    formData.categories.includes(cat) 
                      ? 'bg-rose-100 border-black text-black shadow-inner' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border-2 border-black space-y-4 shadow-[8px_8px_0px_0px_rgba(255,182,193,0.4)]">
             <StatusToggle label="In Stock" checked={formData.in_stock} onChange={(v) => setFormData({...formData, in_stock: v})} color="bg-emerald-500" />
             <StatusToggle label="New Arrival" checked={formData.is_new} onChange={(v) => setFormData({...formData, is_new: v})} color="bg-[#FF69B4]" />
             <StatusToggle label="Best Seller" checked={formData.is_best_seller} onChange={(v) => setFormData({...formData, is_best_seller: v})} color="bg-amber-500" />
          </section>

          <button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full py-6 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] disabled:opacity-50"
          >
            {loading ? "Adding to Shop..." : "Launch Product"}
          </button>
        </div>
      </form>

      <style>{`
        .input-style {
          width: 100%;
          padding: 1.2rem;
          background-color: white;
          border: 2px solid black;
          border-radius: 1rem;
          font-weight: 700;
          color: black;
          outline: none;
        }
        .input-style:focus {
          background-color: #FFF0F3;
          border-color: #FF69B4;
        }
        .label-style {
          display: block;
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          color: black;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

function StatusToggle({ label, checked, onChange, color }: StatusToggleProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <span className="font-black text-black text-sm uppercase tracking-tight">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors border border-black ${checked ? color : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white border border-black rounded-full transition-all ${checked ? 'left-7' : 'left-0.5'}`} />
      </button>
    </div>
  );
}