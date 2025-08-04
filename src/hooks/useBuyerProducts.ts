import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types';

export function useBuyerProducts() {
  return useQuery({
    queryKey: ['buyer-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          photo_url,
          min_price,
          qty_kg,
          unit,
          location,
          freshness,
          organic,
          price_change,
          category,
          harvest_date,
          status,
          created_at,
          farmer_id,
          users!farmer_id (
            full_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((product: any) => ({
        id: product.id,
        name: product.title,
        image: product.photo_url,
        price: product.min_price,
        unit: product.unit || 'kg',
        quantity: product.qty_kg,
        location: product.location,
        farmer: product.users?.full_name || 'Unknown Farmer',
        farmerId: product.farmer_id,
        freshness: product.freshness || 'fresh',
        organic: product.organic || false,
        harvestDate: product.harvest_date,
        priceChange: product.price_change || 0,
        description: product.description,
        category: product.category
      })) as Product[];
    },
    staleTime: 5 * 60 * 1000,
  });
}