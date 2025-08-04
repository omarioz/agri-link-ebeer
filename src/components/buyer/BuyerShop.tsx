import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProductCard } from './ProductCard';
import { BidModal } from './BidModal';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=300&fit=crop',
    price: 2.50,
    unit: 'kg',
    location: 'Hargeisa Farm',
    farmer: 'Ahmed Hassan',
    farmerId: 'farmer1',
    freshness: 'fresh' as const,
    quantity: 25,
    priceChange: 5.2,
    organic: false,
    harvestDate: '2024-08-04',
    category: 'Vegetables'
  },
  {
    id: '2',
    name: 'Organic Bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    price: 1.80,
    unit: 'bunch',
    location: 'Berbera Valley',
    farmer: 'Fatima Ali',
    farmerId: 'farmer2',
    freshness: 'good' as const,
    quantity: 40,
    priceChange: -2.1,
    organic: true,
    harvestDate: '2024-08-03',
    category: 'Fruits'
  },
  {
    id: '3',
    name: 'Sweet Mangoes',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
    price: 3.20,
    unit: 'kg',
    location: 'Borama Hills',
    farmer: 'Omar Yusuf',
    farmerId: 'farmer3',
    freshness: 'fresh' as const,
    quantity: 15,
    priceChange: 8.5,
    organic: false,
    harvestDate: '2024-08-04',
    category: 'Fruits'
  }
];

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Grains', 'Herbs'];

export const BuyerShop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBid = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleSubmitBid = (productId: string, bidPrice: number, quantity: number) => {
    console.log('Bid submitted:', { productId, bidPrice, quantity });
    // TODO: Submit bid to API
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search fresh produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Market Insights */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Market Insights</h3>
            <span className="text-xs text-muted-foreground">Live prices</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Tomatoes</p>
              <p className="text-sm font-semibold text-success">↑ $2.40</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Bananas</p>
              <p className="text-sm font-semibold text-destructive">↓ $1.75</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Mangoes</p>
              <p className="text-sm font-semibold text-success">↑ $3.15</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Fresh Today</h2>
            <span className="text-sm text-muted-foreground">{MOCK_PRODUCTS.length} items</span>
          </div>
          
          <div className="grid gap-4">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onBid={handleBid}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onSubmitBid={handleSubmitBid}
      />
    </div>
  );
};