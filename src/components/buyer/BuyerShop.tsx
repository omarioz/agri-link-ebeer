import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProductCard } from './ProductCard';
import { BidModal } from './BidModal';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { api } from '@/services/api';

const mapProduceToProduct = (item: any): Product => ({
  id: item.id,
  name: item.name,
  image: item.image_url,
  price: Number(item.price_per_kg),
  unit: 'kg',
  location: item.location,
  farmer: item.farmer_name,
  farmerId: item.farmer,
  freshness: 'fresh',
  quantity: Number(item.quantity),
  priceChange: 0,
  organic: false,
  harvestDate: item.harvest_date,
  category: 'General'
});

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Grains', 'Herbs'];

export const BuyerShop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.get('/produce/');
        setProducts(data.map((item: any) => mapProduceToProduct(item)));
      } catch (error) {
        console.error('Failed to load products', error);
      }
    };
    loadProducts();
  }, []);

  const handleBid = (productId: string) => {
    const product = products.find(p => p.id === productId);
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
            <span className="text-sm text-muted-foreground">{products.length} items</span>
          </div>
          
          <div className="grid gap-4">
            {products.map((product) => (
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