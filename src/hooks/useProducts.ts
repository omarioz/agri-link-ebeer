import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
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
        // Remove status filter to get all products
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
        category: product.category,
        status: product.status
      })) as (Product & { status: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: {
      title: string;
      description?: string;
      qty_kg: number;
      min_price: number;
      unit?: string;
      location?: string;
      category: string;
      harvest_date: string;
      organic: boolean;
      photo_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          farmer_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}