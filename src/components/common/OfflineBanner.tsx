import React from 'react';
import { useOffline } from '@/hooks/useOffline';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline } = useOffline();
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-warning text-warning-foreground px-4 py-2 z-50 flex items-center space-x-2">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">{t('offline.banner')}</span>
    </div>
  );
};