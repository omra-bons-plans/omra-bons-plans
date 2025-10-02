import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './mobile/MobileSidebar';
import DesktopLayout from './desktop/DesktopLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileSidebar />
        <main className="pt-16 pb-24 lg:pt-0 lg:pb-0">
          {children}
        </main>
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