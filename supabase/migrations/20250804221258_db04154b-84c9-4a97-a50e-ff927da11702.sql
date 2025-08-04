-- Add missing columns to existing tables and create new tables for complete CRUD functionality

-- Enhance products table to match mock data structure
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'kg',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS freshness TEXT CHECK (freshness IN ('fresh', 'good', 'fair')) DEFAULT 'fresh',
ADD COLUMN IF NOT EXISTS organic BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price_change NUMERIC DEFAULT 0;

-- Enhance users table to match mock data structure  
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'paused', 'pending')) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;

-- Create analytics table for farmer dashboard stats
CREATE TABLE IF NOT EXISTS public.farmer_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  total_earnings NUMERIC DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  pending_orders INTEGER DEFAULT 0,
  monthly_growth NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin analytics table
CREATE TABLE IF NOT EXISTS public.admin_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_revenue NUMERIC DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  deliveries_in_progress INTEGER DEFAULT 0,
  market_growth NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create routes table for logistics (referenced in LogisticsPage)
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name TEXT,
  vehicle TEXT,
  current_load INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 100,
  location TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.farmer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farmer_analytics
CREATE POLICY "Farmers can view own analytics" 
ON public.farmer_analytics 
FOR SELECT 
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update own analytics" 
ON public.farmer_analytics 
FOR ALL
USING (auth.uid() = farmer_id);

-- Create RLS policies for admin_analytics
CREATE POLICY "Admins can manage analytics" 
ON public.admin_analytics 
FOR ALL
USING (get_current_user_role() = 'admin');

-- Create RLS policies for routes
CREATE POLICY "Admins can manage routes" 
ON public.routes 
FOR ALL
USING (get_current_user_role() = 'admin');

-- Create function to update farmer analytics
CREATE OR REPLACE FUNCTION public.update_farmer_analytics(farmer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  earnings NUMERIC;
  listings_count INTEGER;
  orders_count INTEGER;
BEGIN
  -- Calculate total earnings from completed orders
  SELECT COALESCE(SUM(b.price * b.qty_kg), 0) INTO earnings
  FROM bids b
  JOIN products p ON b.product_id = p.id
  WHERE p.farmer_id = farmer_id AND b.status = 'accepted';
  
  -- Count active listings
  SELECT COUNT(*) INTO listings_count
  FROM products p
  WHERE p.farmer_id = farmer_id AND p.status = 'active';
  
  -- Count pending orders
  SELECT COUNT(*) INTO orders_count
  FROM orders o
  JOIN bids b ON o.bid_id = b.id
  JOIN products p ON b.product_id = p.id
  WHERE p.farmer_id = farmer_id AND o.status IN ('ordered', 'picked-up', 'in-transit');
  
  -- Upsert farmer analytics
  INSERT INTO public.farmer_analytics (farmer_id, total_earnings, active_listings, pending_orders)
  VALUES (farmer_id, earnings, listings_count, orders_count)
  ON CONFLICT (farmer_id) 
  DO UPDATE SET 
    total_earnings = EXCLUDED.total_earnings,
    active_listings = EXCLUDED.active_listings,
    pending_orders = EXCLUDED.pending_orders,
    updated_at = now();
END;
$$;

-- Create function to update admin analytics
CREATE OR REPLACE FUNCTION public.update_admin_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  revenue NUMERIC;
  users_count INTEGER;
  listings_count INTEGER;
  deliveries_count INTEGER;
BEGIN
  -- Calculate total platform revenue
  SELECT COALESCE(SUM(b.price * b.qty_kg), 0) INTO revenue
  FROM bids b
  WHERE b.status = 'accepted';
  
  -- Count active users
  SELECT COUNT(*) INTO users_count
  FROM users
  WHERE status = 'active';
  
  -- Count total active listings
  SELECT COUNT(*) INTO listings_count
  FROM products
  WHERE status = 'active';
  
  -- Count deliveries in progress
  SELECT COUNT(*) INTO deliveries_count
  FROM orders
  WHERE status IN ('picked-up', 'in-transit');
  
  -- Upsert admin analytics
  INSERT INTO public.admin_analytics (id, total_revenue, active_users, total_listings, deliveries_in_progress)
  VALUES (gen_random_uuid(), revenue, users_count, listings_count, deliveries_count)
  ON CONFLICT (id) 
  DO UPDATE SET 
    total_revenue = EXCLUDED.total_revenue,
    active_users = EXCLUDED.active_users,
    total_listings = EXCLUDED.total_listings,
    deliveries_in_progress = EXCLUDED.deliveries_in_progress,
    updated_at = now();
END;
$$;