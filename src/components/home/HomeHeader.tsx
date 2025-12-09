import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import UserMenu from '@/components/ui/UserMenu';

/**
 * ⚡ OPTIMIZED HOME HEADER - Lightweight component
 */

interface HomeHeaderProps {
  user: any;
}

export const HomeHeader = memo(({ user }: HomeHeaderProps) => {
  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 glass-strong z-50 border-b border-border/20 mb-0">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-12 md:h-16 flex items-center">
              <Logo size={120} className="text-primary object-contain md:w-[140px]" style={{ maxHeight: '64px' }} />
            </div>
          </div>
          
          {/* Right buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-all duration-300">
                  Se connecter
                </Button>
              </Link>
            )}
            <Link to="/publish">
              <Button className="btn-modern text-primary-foreground px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base">
                Publier une annonce
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});

HomeHeader.displayName = 'HomeHeader';
