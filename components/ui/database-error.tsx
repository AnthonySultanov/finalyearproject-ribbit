"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DatabaseErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const DatabaseError = ({ 
  message = "We're having trouble connecting to our database. This is usually temporary.",
  onRetry
}: DatabaseErrorProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    if (onRetry) {
      onRetry();
    } else {
      //this will reload the page
      window.location.reload();
    }
  };

  useEffect(() => {
    if (isRetrying) {
      const timer = setTimeout(() => {
        setIsRetrying(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isRetrying]);

  return (
    <div className="w-full p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center justify-center space-y-4">
      <AlertTriangle className="h-10 w-10 text-amber-500" />
      <h3 className="text-xl font-semibold">Database Connection Issue</h3>
      <p className="text-center text-muted-foreground">{message}</p>
      <Button 
        onClick={handleRetry} 
        disabled={isRetrying}
        variant="default"
      >
        {isRetrying ? "Retrying..." : retryCount > 0 ? "Retry Again" : "Retry Connection"}
      </Button>
      <p className="text-xs text-muted-foreground">
        If this persists, please try again later.
      </p>
    </div>
  );
};