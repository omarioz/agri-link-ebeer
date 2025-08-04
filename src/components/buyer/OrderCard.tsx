import React from 'react';
import { MapPin, Phone, FileText } from 'lucide-react';
import { StatusChip } from '@/components/common/StatusChip';
import { useTranslation } from 'react-i18next';

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
}

interface OrderCardProps {
  order: Order;
  onTrack: () => void;
  onViewInvoice: () => void;
}

const StatusTimeline: React.FC<{ status: string }> = ({ status }) => {
  const steps = ['ordered', 'picked-up', 'in-transit', 'delivered'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center space-x-2 mt-2">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`w-3 h-3 rounded-full ${
              index <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index < currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onTrack,
  onViewInvoice
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
      <div className="flex space-x-3">
        {/* Product Image */}
        <img
          src={order.thumbnail}
          alt={order.produceName}
          className="w-16 h-16 rounded-lg object-cover"
        />

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">
            {order.produceName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {order.quantity}kg × ${order.pricePerKg.toFixed(2)} = ${order.total.toFixed(2)}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>{order.farmer} • {order.region}</span>
          </div>

          {/* Status Timeline for Active Orders */}
          {order.type === 'active' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{t('orders.progress')}</span>
                {order.eta && <span>ETA: {order.eta}</span>}
              </div>
              <StatusTimeline status={order.status} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end space-y-2">
          <StatusChip status={order.status} />
          
          {order.type === 'active' ? (
            <button
              onClick={onTrack}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>{t('orders.track')}</span>
            </button>
          ) : (
            <button
              onClick={onViewInvoice}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{t('orders.invoice')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};