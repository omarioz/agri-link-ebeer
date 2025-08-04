import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Mic, Truck, Receipt } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/SkeletonLoader';
import { OrderCard } from '@/components/buyer/OrderCard';
import { TrackDrawer } from '@/components/buyer/TrackDrawer';
import { InvoiceModal } from '@/components/buyer/InvoiceModal';
import { useTranslation } from 'react-i18next';
import { useOffline } from '@/hooks/useOffline';
import { useOrders } from '@/hooks/useOrders';

interface Order {
  id: string;
  produceName: string;
  thumbnail: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  farmer: string;
  region: string;
  status: 'ordered' | 'picked-up' | 'in-transit' | 'delivered';
  type: 'active' | 'completed';
  eta?: string;
  courierName?: string;
  courierPhone?: string;
  trackingData?: {
    farmLocation: [number, number];
    buyerLocation: [number, number];
    courierLocation: [number, number];
  };
}

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTrackDrawer, setShowTrackDrawer] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { isOffline } = useOffline();
  
  const activeTab = (searchParams.get('status') || 'active') as 'active' | 'completed';

  const { data: orders = [], isLoading, error } = useOrders(activeTab);

  const filteredOrders = orders?.filter(order =>
    order.produceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleTabChange = (status: string) => {
    setSearchParams({ status });
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      
      recognition.start();
    }
  };

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowTrackDrawer(true);
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        {/* Segmented Control */}
        <div className="flex bg-muted rounded-lg p-1 mb-4">
          <button
            onClick={() => handleTabChange('active')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            {t('orders.active')}
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            {t('orders.completed')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('orders.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            onClick={handleVoiceSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <Mic className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
                <Skeleton className="w-full h-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">{t('orders.loadError')}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-destructive hover:underline"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            illustration={activeTab === 'active' ? <Truck className="w-16 h-16" /> : <Receipt className="w-16 h-16" />}
            title={activeTab === 'active' ? t('orders.emptyActive') : t('orders.emptyCompleted')}
            description={activeTab === 'active' ? t('orders.emptyActiveDesc') : t('orders.emptyCompletedDesc')}
          />
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={() => handleTrackOrder(order)}
                onViewInvoice={() => handleViewInvoice(order)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track Drawer */}
      {selectedOrder && (
        <TrackDrawer
          isOpen={showTrackDrawer}
          onClose={() => setShowTrackDrawer(false)}
          order={selectedOrder}
        />
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};