import React from 'react';
import { ShoppingBag, Home, User, Plus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'buyer' | 'farmer' | 'admin';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  userRole
}) => {
  const getBuyerTabs = () => [
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'orders', icon: Home, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const getFarmerTabs = () => [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'listings', icon: ShoppingBag, label: 'Listings' },
    { id: 'add', icon: Plus, label: 'Add' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const getAdminTabs = () => [
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'users', icon: User, label: 'Users' },
    { id: 'logistics', icon: Home, label: 'Logistics' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const tabs = userRole === 'buyer' ? getBuyerTabs() : 
               userRole === 'farmer' ? getFarmerTabs() : 
               getAdminTabs();

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};