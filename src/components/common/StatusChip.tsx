import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type StatusType = 
  | 'active' 
  | 'pending' 
  | 'completed' 
  | 'ordered' 
  | 'picked-up' 
  | 'in-transit' 
  | 'delivered'
  | 'fresh'
  | 'good'
  | 'fair'
  | 'sold'
  | 'paused';

interface StatusChipProps {
  status: StatusType;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className }) => {
  const { t } = useTranslation();

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'active':
      case 'fresh':
        return 'status-success';
      case 'pending':
      case 'good':
        return 'status-warning';
      case 'completed':
      case 'delivered':
      case 'fair':
        return 'status-pending';
      case 'ordered':
      case 'picked-up':
      case 'in-transit':
        return 'text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-medium';
      case 'sold':
        return 'text-success bg-success/10 px-2 py-1 rounded-full text-xs font-medium';
      case 'paused':
        return 'text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'status-pending';
    }
  };

  return (
    <span className={cn(getStatusStyles(status), className)}>
      {t(`status.${status.replace('-', '')}`)}
    </span>
  );
};