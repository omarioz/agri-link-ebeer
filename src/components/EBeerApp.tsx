import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BottomNav } from '@/components/navigation/BottomNav';
import { BuyerShop } from '@/components/buyer/BuyerShop';
import { OrdersPage } from '@/pages/buyer/OrdersPage';
import { BuyerProfilePage } from '@/pages/buyer/BuyerProfilePage';
import { FarmerDashboard } from '@/components/farmer/FarmerDashboard';
import { ListingsPage } from '@/pages/farmer/ListingsPage';
import { AddListing } from '@/components/farmer/AddListing';
import { FarmerProfilePage } from '@/pages/farmer/FarmerProfilePage';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { LogisticsPage } from '@/pages/admin/LogisticsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';

type UserRole = 'buyer' | 'farmer' | 'admin';

export const EBeerApp: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [activeTab, setActiveTab] = useState('shop');

  // Demo role switcher
  const switchRole = (role: UserRole) => {
    setUserRole(role);
    // Set default tab for each role
    if (role === 'buyer') setActiveTab('shop');
    else if (role === 'farmer') setActiveTab('dashboard');
    else setActiveTab('analytics');
  };

  const renderContent = () => {
    if (userRole === 'buyer') {
      switch (activeTab) {
        case 'shop': return <BuyerShop />;
        case 'orders': return <OrdersPage />;
        case 'profile': return <BuyerProfilePage />;
        default: return <BuyerShop />;
      }
    }
    
    if (userRole === 'farmer') {
      switch (activeTab) {
        case 'dashboard': return <FarmerDashboard />;
        case 'listings': return <ListingsPage />;
        case 'add': return <AddListing />;
        case 'profile': return <FarmerProfilePage />;
        default: return <FarmerDashboard />;
      }
    }

    // Admin role
    switch (activeTab) {
      case 'analytics': return <AdminAnalytics />;
      case 'users': return <UsersPage />;
      case 'logistics': return <LogisticsPage />;
      case 'profile': return <AdminProfilePage />;
      default: return <AdminAnalytics />;
    }
  };

  return (
    <MobileLayout>
      {/* Demo Role Switcher */}
      <div className="fixed top-4 right-4 z-50 bg-card rounded-lg border border-border shadow-lg">
        <div className="p-2 flex space-x-1">
          {(['buyer', 'farmer', 'admin'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={`px-2 py-1 text-xs rounded ${
                userRole === role 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
      />
    </MobileLayout>
  );
};