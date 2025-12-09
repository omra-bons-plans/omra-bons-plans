import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './mobile/MobileSidebar';
import { MobileBottomNav } from './mobile/MobileBottomNav';
import DesktopLayout from './desktop/DesktopLayout';
import Footer from './ui/Footer';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

  // ⚡ RENDU IMMÉDIAT: Pas de condition bloquante
  console.log('📱 ResponsiveLayout render:', { isMobile });

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MobileSidebar />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <DesktopLayout>
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </DesktopLayout>
  );
};

export default ResponsiveLayout;