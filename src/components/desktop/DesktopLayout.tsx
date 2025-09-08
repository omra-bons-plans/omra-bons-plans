import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DesktopSidebar } from './DesktopSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DesktopLayoutProps {
  children: ReactNode;
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DesktopSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b bg-background px-4">
            <SidebarTrigger className="lg:flex hidden" />
            
            {/* Right side header content */}
            <div className="flex items-center space-x-4 ml-auto">
              {user && (
                <Link to="/notifications" className="relative">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DesktopLayout;