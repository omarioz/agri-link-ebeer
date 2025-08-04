import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, TrendingUp, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmitBid: (productId: string, bidPrice: number, quantity: number) => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmitBid
}) => {
  const [bidPrice, setBidPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'fresh': return 'text-success bg-success/10';
      case 'good': return 'text-warning bg-warning/10';
      case 'fair': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleSubmit = () => {
    const price = parseFloat(bidPrice);
    if (price > 0 && quantity > 0) {
      onSubmitBid(product.id, price, quantity);
      setBidPrice('');
      setQuantity(1);
      onClose();
    }
  };

  const totalBid = parseFloat(bidPrice) * quantity || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[90vh]">
        <SheetHeader className="text-left">
          <SheetTitle>Place Your Bid</SheetTitle>
          <SheetDescription>
            Submit your offer for this fresh produce
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Product Info */}
          <div className="flex space-x-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1">
                <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-medium capitalize", getFreshnessColor(product.freshness))}>
                  {product.freshness}
                </span>
              </div>
            </div>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>by {product.farmer}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">
                  Current: ${product.price}/{product.unit}
                </p>
                <div className={cn(
                  "flex items-center space-x-1 text-xs",
                  product.priceChange > 0 ? "text-success" : product.priceChange < 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{product.priceChange > 0 ? '+' : ''}{product.priceChange}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {product.quantity}kg available
              </p>
            </div>
          </div>

          {/* Bid Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bidPrice">Your bid price (per {product.unit})</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="bidPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={product.price.toString()}
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({product.unit})</Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum available: {product.quantity}{product.unit}
              </p>
            </div>

            {/* Total */}
            {totalBid > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total bid amount:</span>
                  <span className="text-lg font-bold text-primary">
                    ${totalBid.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!bidPrice || parseFloat(bidPrice) <= 0 || quantity <= 0}
              className="flex-1"
            >
              Place Bid
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};