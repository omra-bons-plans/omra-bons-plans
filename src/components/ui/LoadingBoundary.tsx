import React, { Suspense } from 'react';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const DefaultFallback = ({ minHeight = "200px" }: { minHeight?: string }) => (
  <div 
    className="flex items-center justify-center bg-background/50 rounded-lg"
    style={{ minHeight }}
  >
    <div className="flex flex-col items-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  fallback,
  minHeight = "200px"
}) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
};

export default LoadingBoundary;