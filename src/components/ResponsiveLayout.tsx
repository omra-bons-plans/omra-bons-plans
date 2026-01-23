import { ReactNode, lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

// ⚡ PERFORMANCE: Lazy load mobile components - they're not needed for initial render
const MobileSidebar = lazy(() => import('./mobile/MobileSidebar'));
const MobileBottomNav = lazy(() => import('./mobile/MobileBottomNav').then(m => ({ default: m.MobileBottomNav })));
const Footer = lazy(() => import('./ui/Footer'));
const DesktopLayout = lazy(() => import('./desktop/DesktopLayout'));

interface ResponsiveLayoutProps {
  children: ReactNode;
}

// ⚡ Minimal skeleton for mobile nav - doesn't block paint
const MobileNavSkeleton = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/95 h-16 border-t border-border/20" />
);

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Hide mobile nav on admin pages to avoid hiding FAB buttons
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {!isAdminRoute && (
          <Suspense fallback={null}>
            <MobileSidebar />
          </Suspense>
        )}
        <main className={`flex-1 ${isAdminRoute ? 'pb-4' : 'pb-20'}`}>
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        {!isAdminRoute && (
          <Suspense fallback={<MobileNavSkeleton />}>
            <MobileBottomNav />
          </Suspense>
        )}
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DesktopLayout>
        <div className="flex flex-col min-h-full">
          <div className="flex-1">
            {children}
          </div>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </DesktopLayout>
    </Suspense>
  );
};

export default ResponsiveLayout;