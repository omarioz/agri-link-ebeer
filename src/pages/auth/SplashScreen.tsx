import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated && role) {
          navigate(`/${role}`);
        } else {
          navigate('/auth');
        }
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, role, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <img 
          src="/lovable-uploads/14b60e7c-1be7-4332-8a67-5c8180f91f59.png" 
          alt="e-Beer" 
          className="h-16 w-auto mx-auto mb-4"
        />
        <div className="w-8 h-8 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};