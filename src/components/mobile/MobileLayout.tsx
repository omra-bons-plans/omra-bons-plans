import { ReactNode } from 'react';
import MobileSidebar from './MobileSidebar';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <MobileSidebar />
      <main className="pt-1 pb-24 lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;