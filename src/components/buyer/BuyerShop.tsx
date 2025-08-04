import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProductCard } from './ProductCard';
import { BidModal } from './BidModal';
import { Skeleton } from '@/components/common/SkeletonLoader';
import { cn } from '@/lib/utils';
import { useBuyerProducts } from '@/hooks/useBuyerProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Product } from '@/types';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Grains', 'Herbs'];

export const BuyerShop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: products = [], isLoading, error } = useBuyerProducts();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBid = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleSubmitBid = async (productId: string, bidPrice: number, quantity: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('bid-submit', {
        body: {
          product_id: productId,
          price: bidPrice,
          qty_kg: quantity
        }
      });

      if (error) throw error;
      
      toast.success('Bid submitted successfully!');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid. Please try again.');
    }
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
            <span className="text-sm text-muted-foreground">{filteredProducts.length} items</span>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-4">
                  <Skeleton className="w-full h-32" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-destructive">Failed to load products</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onBid={handleBid}
                />
              ))}
            </div>
          )}
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