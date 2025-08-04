-- Fix security warnings by updating function search paths

-- Fix update_farmer_analytics function to have secure search_path
CREATE OR REPLACE FUNCTION public.update_farmer_analytics(farmer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  earnings NUMERIC;
  listings_count INTEGER;
  orders_count INTEGER;
BEGIN
  -- Calculate total earnings from completed orders
  SELECT COALESCE(SUM(b.price * b.qty_kg), 0) INTO earnings
  FROM public.bids b
  JOIN public.products p ON b.product_id = p.id
  WHERE p.farmer_id = update_farmer_analytics.farmer_id AND b.status = 'accepted';
  
  -- Count active listings
  SELECT COUNT(*) INTO listings_count
  FROM public.products p
  WHERE p.farmer_id = update_farmer_analytics.farmer_id AND p.status = 'active';
  
  -- Count pending orders
  SELECT COUNT(*) INTO orders_count
  FROM public.orders o
  JOIN public.bids b ON o.bid_id = b.id
  JOIN public.products p ON b.product_id = p.id
  WHERE p.farmer_id = update_farmer_analytics.farmer_id AND o.status IN ('ordered', 'picked-up', 'in-transit');
  
  -- Upsert farmer analytics
  INSERT INTO public.farmer_analytics (farmer_id, total_earnings, active_listings, pending_orders)
  VALUES (update_farmer_analytics.farmer_id, earnings, listings_count, orders_count)
  ON CONFLICT (farmer_id) 
  DO UPDATE SET 
    total_earnings = EXCLUDED.total_earnings,
    active_listings = EXCLUDED.active_listings,
    pending_orders = EXCLUDED.pending_orders,
    updated_at = now();
END;
$$;

-- Fix update_admin_analytics function to have secure search_path
CREATE OR REPLACE FUNCTION public.update_admin_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  revenue NUMERIC;
  users_count INTEGER;
  listings_count INTEGER;
  deliveries_count INTEGER;
BEGIN
  -- Calculate total platform revenue
  SELECT COALESCE(SUM(b.price * b.qty_kg), 0) INTO revenue
  FROM public.bids b
  WHERE b.status = 'accepted';
  
  -- Count active users
  SELECT COUNT(*) INTO users_count
  FROM public.users
  WHERE status = 'active';
  
  -- Count total active listings
  SELECT COUNT(*) INTO listings_count
  FROM public.products
  WHERE status = 'active';
  
  -- Count deliveries in progress
  SELECT COUNT(*) INTO deliveries_count
  FROM public.orders
  WHERE status IN ('picked-up', 'in-transit');
  
  -- Upsert admin analytics (delete existing and insert new)
  DELETE FROM public.admin_analytics;
  INSERT INTO public.admin_analytics (total_revenue, active_users, total_listings, deliveries_in_progress)
  VALUES (revenue, users_count, listings_count, deliveries_count);
END;
$$;