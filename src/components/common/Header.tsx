import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  className?: string;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = true,
  className,
  transparent = true
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 56);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full max-w-sm mx-auto",
      transparent ? "bg-background/80 backdrop-blur-sm" : "bg-background",
      "px-4 py-3 flex items-center justify-center",
      "header-fade",
      isScrolled && "scrolled",
      className
    )}>
      {showLogo && (
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/14b60e7c-1be7-4332-8a67-5c8180f91f59.png" 
            alt="e-Beer" 
            className="h-8 w-auto"
          />
        </div>
      )}
      {title && !showLogo && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
    </header>
  );
};