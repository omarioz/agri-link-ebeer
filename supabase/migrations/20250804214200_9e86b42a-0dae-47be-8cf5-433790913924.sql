-- Create users table extending auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('buyer','farmer','admin')),
  full_name TEXT,
  region TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create farms table (1-to-1 with farmer user)
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users ON DELETE CASCADE,
  name TEXT,
  size_ha NUMERIC,
  primary_crops TEXT[],
  CONSTRAINT unique_farmer UNIQUE (user_id)
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- Create products table (listings)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.users ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  category TEXT,
  qty_kg NUMERIC,
  min_price NUMERIC,
  photo_url TEXT,
  harvest_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','sold')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create bids table
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.users ON DELETE CASCADE,
  price NUMERIC,
  qty_kg NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES public.bids ON DELETE CASCADE,
  status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered','picked_up','in_transit','delivered','cancelled')),
  courier_name TEXT,
  courier_phone TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.users ON DELETE CASCADE,
  amount NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users ON DELETE CASCADE,
  type TEXT,
  payload JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create delivery_routes table
CREATE TABLE public.delivery_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders ON DELETE CASCADE,
  path TEXT, -- Using TEXT instead of geometry for simplicity
  status TEXT DEFAULT 'in_transit' CHECK (status IN ('in_transit','delayed','delivered')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for farms table
CREATE POLICY "Anyone can view farms" ON public.farms
  FOR SELECT USING (TRUE);

CREATE POLICY "Farmers can manage own farm" ON public.farms
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for products table
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (TRUE);

CREATE POLICY "Farmers can manage own products" ON public.products
  FOR ALL USING (auth.uid() = farmer_id);

-- RLS Policies for bids table
CREATE POLICY "Farmers can view bids on their products" ON public.bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = bids.product_id 
      AND products.farmer_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view own bids" ON public.bids
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can create bids" ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Farmers can update bid status" ON public.bids
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = bids.product_id 
      AND products.farmer_id = auth.uid()
    )
  );

-- RLS Policies for orders table
CREATE POLICY "Users can view related orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bids b
      JOIN public.products p ON b.product_id = p.id
      WHERE b.id = orders.bid_id 
      AND (b.buyer_id = auth.uid() OR p.farmer_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "System can create orders" ON public.orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- RLS Policies for payouts table
CREATE POLICY "Farmers can view own payouts" ON public.payouts
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can create payout requests" ON public.payouts
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Admins can view all payouts" ON public.payouts
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update payouts" ON public.payouts
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for delivery_routes table
CREATE POLICY "Admins can manage delivery routes" ON public.delivery_routes
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Create trigger function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_products_farmer_id ON public.products(farmer_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_bids_product_id ON public.bids(product_id);
CREATE INDEX idx_bids_buyer_id ON public.bids(buyer_id);
CREATE INDEX idx_bids_status ON public.bids(status);
CREATE INDEX idx_orders_bid_id ON public.orders(bid_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);