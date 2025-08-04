import React from 'react';
import { TrendingUp, Package, DollarSign, Bell } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { cn } from '@/lib/utils';

const MOCK_STATS = {
  totalEarnings: 1250.40,
  activeListing: 8,
  pendingOrders: 3,
  monthlyGrowth: 15.2
};

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'bid', message: 'New bid of $3.20/kg on Mangoes', time: '5 min ago' },
  { id: '2', type: 'order', message: 'Order #1234 ready for pickup', time: '1 hour ago' },
  { id: '3', type: 'price', message: 'Tomato prices up 12% this week', time: '3 hours ago' }
];

export const FarmerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="card-elevated bg-gradient-to-r from-primary/10 to-primary-light/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Good morning, Ahmed!</h2>
              <p className="text-muted-foreground">Your farm is performing well today</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">${MOCK_STATS.totalEarnings}</p>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-xs text-success">+{MOCK_STATS.monthlyGrowth}% this month</p>
          </div>
          
          <div className="card-elevated text-center">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{MOCK_STATS.activeListing}</p>
            <p className="text-xs text-muted-foreground">Active Listings</p>
            <p className="text-xs text-warning">{MOCK_STATS.pendingOrders} pending orders</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary text-left p-4 h-auto">
              <div className="space-y-1">
                <p className="font-medium">Add New Listing</p>
                <p className="text-xs opacity-80">Upload fresh produce</p>
              </div>
            </button>
            <button className="btn-secondary text-left p-4 h-auto">
              <div className="space-y-1">
                <p className="font-medium">View Orders</p>
                <p className="text-xs opacity-60">Manage deliveries</p>
              </div>
            </button>
          </div>
        </div>

        {/* Live Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Live Updates</h3>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <div key={notification.id} className="card-elevated">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    notification.type === 'bid' ? "bg-success" :
                    notification.type === 'order' ? "bg-warning" : "bg-primary"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Trends */}
        <div className="card-elevated">
          <h3 className="font-semibold text-foreground mb-3">Your Price Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mangoes</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">$3.20/kg</span>
                <span className="text-xs text-success">+8.5%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tomatoes</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">$2.50/kg</span>
                <span className="text-xs text-success">+5.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bananas</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">$1.80/bunch</span>
                <span className="text-xs text-destructive">-2.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};