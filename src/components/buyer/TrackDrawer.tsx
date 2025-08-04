import React, { useEffect, useState } from 'react';
import { X, Phone, MessageCircle, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Order {
  id: string;
  produceName: string;
  farmer: string;
  eta?: string;
  courierName?: string;
  courierPhone?: string;
  trackingData?: {
    farmLocation: [number, number];
    buyerLocation: [number, number];
    courierLocation: [number, number];
  };
}

interface TrackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const TrackDrawer: React.FC<TrackDrawerProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (order.eta) {
      const interval = setInterval(() => {
        // Simple countdown simulation
        const now = new Date();
        const eta = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
        const diff = eta.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${hours}h ${minutes}m`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order.eta]);

  if (!isOpen) return null;

  const farmIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const courierIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const buyerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-xl"
        style={{ height: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t('orders.trackOrder')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.id} • {order.produceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ETA Banner */}
        {order.eta && (
          <div className="bg-primary/10 border-b border-border p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {t('orders.estimatedArrival')}: {countdown || order.eta}
              </span>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          {order.trackingData ? (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🗺️</span>
                </div>
                <p className="text-muted-foreground">Interactive map coming soon</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-background p-2 rounded">
                    <span>🟢 {order.farmer}'s Farm</span>
                    <span className="text-xs text-muted-foreground">Origin</span>
                  </div>
                  <div className="flex items-center justify-between bg-background p-2 rounded">
                    <span>🔵 {order.courierName}</span>
                    <span className="text-xs text-muted-foreground">En route</span>
                  </div>
                  <div className="flex items-center justify-between bg-background p-2 rounded">
                    <span>🔴 Your Location</span>
                    <span className="text-xs text-muted-foreground">Destination</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('orders.mapUnavailable')}</p>
            </div>
          )}
        </div>

        {/* Courier Info */}
        {order.courierName && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{order.courierName}</h3>
                <p className="text-sm text-muted-foreground">{t('orders.courier')}</p>
              </div>
              <div className="flex space-x-2">
                {order.courierPhone && (
                  <a
                    href={`tel:${order.courierPhone}`}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                <button className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};