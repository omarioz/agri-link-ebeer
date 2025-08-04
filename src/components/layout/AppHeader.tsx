import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  transparent?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showLogo = false,
  showBack = false,
  onBack,
  className,
  transparent = true
}) => {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/50",
      transparent ? "bg-background/80 backdrop-blur-sm" : "bg-background",
      "px-4 py-3 flex items-center justify-between",
      className
    )}>
      {/* Left section */}
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center section */}
      <div className="flex-1 flex justify-center">
        {showLogo ? (
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4f3ee9c0-d956-4ed8-9dce-80c15d1ec734.png" 
              alt="e-Beer" 
              className="h-8 w-auto"
            />
          </div>
        ) : title ? (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        ) : null}
      </div>

      {/* Right section */}
      <div className="flex items-center">
        {/* Placeholder for actions */}
      </div>
    </header>
  );
};