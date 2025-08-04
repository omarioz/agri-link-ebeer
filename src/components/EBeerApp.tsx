import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BottomNav } from '@/components/navigation/BottomNav';
import { BuyerShop } from '@/components/buyer/BuyerShop';
import { FarmerDashboard } from '@/components/farmer/FarmerDashboard';
import { AddListing } from '@/components/farmer/AddListing';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

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
        case 'orders': return <div className="p-4">Orders coming soon...</div>;
        case 'profile': return <div className="p-4">Profile coming soon...</div>;
        default: return <BuyerShop />;
      }
    }
    
    if (userRole === 'farmer') {
      switch (activeTab) {
        case 'dashboard': return <FarmerDashboard />;
        case 'listings': return <div className="p-4">Listings coming soon...</div>;
        case 'add': return <AddListing />;
        case 'profile': return <div className="p-4">Profile coming soon...</div>;
        default: return <FarmerDashboard />;
      }
    }

    // Admin role
    switch (activeTab) {
      case 'analytics': return <AdminAnalytics />;
      case 'users': return <div className="p-4">User Management coming soon...</div>;
      case 'logistics': return <div className="p-4">Logistics coming soon...</div>;
      case 'profile': return <div className="p-4">Profile coming soon...</div>;
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