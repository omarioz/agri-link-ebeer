export type UserRole = 'buyer' | 'farmer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region: string;
  language: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
  location: string;
  farmer: string;
  farmerId: string;
  freshness: 'fresh' | 'good' | 'fair';
  organic: boolean;
  harvestDate: string;
  priceChange: number;
  description?: string;
  category: string;
}

export interface Bid {
  id: string;
  productId: string;
  buyerId: string;
  price: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  quantity: number;
  totalPrice: number;
  status: 'ordered' | 'picked-up' | 'in-transit' | 'delivered';
  createdAt: string;
  deliveredAt?: string;
}

export interface Listing {
  id: string;
  farmerId: string;
  name: string;
  image: string;
  quantity: number;
  minPrice: number;
  harvestDate: string;
  organic: boolean;
  status: 'active' | 'paused' | 'sold';
  category: string;
  description?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bid' | 'order' | 'payment' | 'weather';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  rainfall: number;
  advice?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  format?: 'currency' | 'number' | 'percentage';
}