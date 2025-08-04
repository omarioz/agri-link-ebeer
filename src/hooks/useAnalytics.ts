import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFarmerAnalytics() {
  return useQuery({
    queryKey: ['farmer-analytics'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Update analytics first
      const { error: updateError } = await supabase.rpc('update_farmer_analytics', {
        farmer_id: user.user.id
      });
      
      if (updateError) console.warn('Failed to update analytics:', updateError);

      const { data, error } = await supabase
        .from('farmer_analytics')
        .select('*')
        .eq('farmer_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        totalEarnings: data?.total_earnings || 0,
        activeListing: data?.active_listings || 0,
        pendingOrders: data?.pending_orders || 0,
        monthlyGrowth: data?.monthly_growth || 0
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Update analytics first
      const { error: updateError } = await supabase.rpc('update_admin_analytics');
      
      if (updateError) console.warn('Failed to update analytics:', updateError);

      const { data, error } = await supabase
        .from('admin_analytics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        totalRevenue: data?.total_revenue || 0,
        activeUsers: data?.active_users || 0,
        totalListings: data?.total_listings || 0,
        deliveriesInProgress: data?.deliveries_in_progress || 0,
        marketGrowth: data?.market_growth || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}