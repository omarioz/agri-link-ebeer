import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useOrders(status: 'active' | 'completed') {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      const orderStatuses = status === 'active' 
        ? ['ordered', 'picked-up', 'in-transit']
        : ['delivered'];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          delivered_at,
          courier_name,
          courier_phone,
          bids!bid_id (
            id,
            price,
            qty_kg,
            buyer_id,
            products!product_id (
              id,
              title,
              photo_url,
              farmer_id,
              users!farmer_id (
                full_name,
                region
              )
            )
          )
        `)
        .in('status', orderStatuses)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((order: any) => {
        const bid = order.bids;
        const product = bid?.products;
        const farmer = product?.users;
        
        return {
          id: order.id,
          produceName: product?.title || 'Unknown Product',
          thumbnail: product?.photo_url || '',
          quantity: bid?.qty_kg || 0,
          pricePerKg: bid?.price || 0,
          total: (bid?.price || 0) * (bid?.qty_kg || 0),
          farmer: farmer?.full_name || 'Unknown Farmer',
          region: farmer?.region || 'Unknown Region',
          status: order.status,
          type: status,
          courierName: order.courier_name,
          courierPhone: order.courier_phone,
          eta: order.status === 'in-transit' ? '2 hours' : undefined, // Mock ETA for now
          trackingData: order.status === 'in-transit' ? {
            farmLocation: [2.0469, 45.3182] as [number, number],
            buyerLocation: [2.0371, 45.3438] as [number, number],
            courierLocation: [2.0420, 45.3310] as [number, number]
          } : undefined
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}