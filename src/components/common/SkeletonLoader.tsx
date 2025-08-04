import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn("skeleton", className)}>
      {children}
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card-elevated">
      <Skeleton className="w-full h-32 rounded-xl mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const ListingSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 p-3 border-b border-border">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
};