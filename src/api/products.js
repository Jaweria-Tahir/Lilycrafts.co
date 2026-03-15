import { supabase } from '../lib/supabase';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error("Error fetching:", error);
    return [];
  }
  return data;
};