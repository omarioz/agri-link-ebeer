import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  cta?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  title,
  description,
  cta,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {illustration && (
        <div className="mb-6 text-muted-foreground">
          {illustration}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      )}
      {cta && onAction && (
        <Button onClick={onAction} className="btn-primary">
          {cta}
        </Button>
      )}
    </div>
  );
};