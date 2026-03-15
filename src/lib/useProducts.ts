// src/lib/useProducts.ts
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useProducts() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        
        // 1. Fetch data from Supabase
        const { data: products, error: supabaseError } = await supabase
          .from('products') // Ensure this matches your Table Name exactly
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        // 2. DATA NORMALIZATION (Critical Step)
        // This maps Database column names to the names your UI uses
        const normalizedProducts = (products || []).map(item => ({
          ...item,
          // Ensure price is a number even if stored as a string/decimal in DB
          price: Number(item.price) || 0,
          
          // Map 'in_stock' (DB) to 'inStock' (UI) if needed, 
          // or just ensure it's a boolean
          in_stock: item.in_stock ?? true,
          
          // Ensure categories is always an array to prevent .map() errors
          categories: Array.isArray(item.categories) 
            ? item.categories 
            : (item.category ? [item.category] : []),
            
          // Ensure images is handled (if DB uses 'image' string)
          images: Array.isArray(item.images) 
            ? item.images 
            : (item.image ? [item.image] : (item.image_url ? [item.image_url] : []))
        }));

        setData(normalizedProducts);
      } catch (err: any) {
        console.error("Supabase Fetch Error:", err.message);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { data, isLoading, error };
}