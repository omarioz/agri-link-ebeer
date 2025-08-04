import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className,
  withNav = true 
}) => {
  return (
    <div className={cn(
      "mobile-container relative",
      withNav && "pb-20", // Space for bottom navigation
      className
    )}>
      {children}
    </div>
  );
};