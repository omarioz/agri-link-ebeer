import React from 'react';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  location: string;
  farmer: string;
  freshness: 'fresh' | 'good' | 'fair';
  quantity: number;
  priceChange: number; // percentage change
  onBid: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  unit,
  location,
  farmer,
  freshness,
  quantity,
  priceChange,
  onBid
}) => {
  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'fresh': return 'text-success bg-success/10';
      case 'good': return 'text-warning bg-warning/10';
      case 'fair': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="card-elevated hover:scale-[1.02] cursor-pointer" onClick={() => onBid(id)}>
      {/* Product Image */}
      <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", getFreshnessColor(freshness))}>
            {freshness}
          </span>
        </div>
        <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          {quantity}kg available
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground text-base">{name}</h3>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">${price}</p>
            <p className="text-xs text-muted-foreground">per {unit}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>by {farmer}</span>
          </div>
          
          <div className={cn(
            "flex items-center space-x-1 text-xs",
            priceChange > 0 ? "text-success" : priceChange < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            <TrendingUp className="w-3 h-3" />
            <span>{priceChange > 0 ? '+' : ''}{priceChange}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};