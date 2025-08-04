import React from 'react';
import { TrendingUp, Users, Package, DollarSign, Truck, Thermometer } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { cn } from '@/lib/utils';

const MOCK_ANALYTICS = {
  totalRevenue: 125430.50,
  activeUsers: 1247,
  totalListings: 3891,
  deliveriesInProgress: 23,
  averagePrice: 2.75,
  marketGrowth: 23.5
};

const PRICE_TRENDS = [
  { product: 'Tomatoes', current: 2.50, change: 12.3, volume: 245 },
  { product: 'Bananas', current: 1.80, change: -5.2, volume: 189 },
  { product: 'Mangoes', current: 3.20, change: 18.7, volume: 156 },
  { product: 'Onions', current: 1.95, change: 8.1, volume: 203 }
];

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Market Analytics</h1>
          <p className="text-muted-foreground">Real-time insights & AI predictions</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <p className="text-lg font-bold text-foreground">${MOCK_ANALYTICS.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-xs text-success">+{MOCK_ANALYTICS.marketGrowth}% growth</p>
          </div>
          
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{MOCK_ANALYTICS.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
            <p className="text-xs text-primary">847 farmers, 400 buyers</p>
          </div>
          
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <p className="text-lg font-bold text-foreground">{MOCK_ANALYTICS.totalListings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Live Listings</p>
            <p className="text-xs text-success">234 new today</p>
          </div>
          
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-lg font-bold text-foreground">{MOCK_ANALYTICS.deliveriesInProgress}</p>
            <p className="text-xs text-muted-foreground">In Transit</p>
            <p className="text-xs text-warning">5 delayed</p>
          </div>
        </div>

        {/* AI Price Intelligence */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">AI Price Intelligence</h3>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {PRICE_TRENDS.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.product}</p>
                  <p className="text-xs text-muted-foreground">{item.volume}kg traded today</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${item.current}</p>
                  <p className={cn(
                    "text-xs font-medium",
                    item.change > 0 ? "text-success" : "text-destructive"
                  )}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Impact */}
        <div className="card-elevated">
          <div className="flex items-center space-x-2 mb-4">
            <Thermometer className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Weather Impact Forecast</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Drought Warning</p>
                  <p className="text-xs text-muted-foreground">Hargeisa region - Next 7 days</p>
                </div>
                <span className="text-xs text-warning font-medium">Medium Risk</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Recommend increasing tomato, onion inventory
              </p>
            </div>
            
            <div className="bg-success/10 border border-success/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Favorable Conditions</p>
                  <p className="text-xs text-muted-foreground">Berbera valley - Next 14 days</p>
                </div>
                <span className="text-xs text-success font-medium">Optimal</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Expect 20% increase in citrus production
              </p>
            </div>
          </div>
        </div>

        {/* Cold Storage Monitor */}
        <div className="card-elevated">
          <h3 className="font-semibold text-foreground mb-4">Cold Storage Capacity</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hargeisa Hub</span>
                <span className="text-foreground">78% capacity</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Berbera Hub</span>
                <span className="text-foreground">45% capacity</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Borama Hub</span>
                <span className="text-foreground">92% capacity</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-destructive h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive font-medium">Action Required</p>
            <p className="text-xs text-muted-foreground">Borama hub near capacity - coordinate with logistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};