import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './mobile/MobileSidebar';
import { MobileBottomNav } from './mobile/MobileBottomNav';
import DesktopLayout from './desktop/DesktopLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background" style={{ margin: 0, padding: 0 }}>
        <MobileSidebar />
        <main style={{ paddingTop: 0, paddingBottom: '80px', margin: 0, display: 'block' }}>
          {children}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <DesktopLayout>
      {children}
    </DesktopLayout>
  );
};

export default ResponsiveLayout;