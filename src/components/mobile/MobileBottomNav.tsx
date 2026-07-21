// ⚡ PERFORMANCE: Individual icon imports to reduce bundle size
import Home from 'lucide-react/dist/esm/icons/home';
import Package from 'lucide-react/dist/esm/icons/package';
import Star from 'lucide-react/dist/esm/icons/star';
import Hotel from 'lucide-react/dist/esm/icons/hotel';
import User from 'lucide-react/dist/esm/icons/user';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

/**
 * Bottom Navigation Mobile-First - Option 2: Focus Services
 * - 5 actions principales (pas de menu "Plus")
 * - Favoris pour comparaisons rapides
 * - Connexion / Profil utilisateur
 */
export const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  
  // Compteur de favoris (localStorage)
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem('omra_favorites') || '[]');
      setFavoritesCount(favorites.length);
    };
    
    updateFavoritesCount();
    
    // Écouter les changements de favoris
    window.addEventListener('storage', updateFavoritesCount);
    window.addEventListener('favorites-updated', updateFavoritesCount);
    
    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favorites-updated', updateFavoritesCount);
    };
  }, []);

  const navItems = [
    { 
      icon: Home, 
      label: 'Accueil', 
      path: '/', 
      active: currentPath === '/' 
    },
    { 
      icon: Package, 
      label: 'Bons Plans', 
      path: '/bons-plans', 
      active: currentPath === '/bons-plans',
      badge: null
    },
    { 
      icon: Star, 
      label: 'Favoris', 
      path: '/favoris', 
      active: currentPath === '/favoris',
      badge: favoritesCount > 0 ? favoritesCount : null
    },
    {
      icon: Hotel,
      label: 'Hôtels',
      path: '/les-hotels',
      active: currentPath === '/les-hotels' || currentPath.startsWith('/hotel/'),
      badge: null
    },
    { 
      icon: User, 
      label: user ? 'Profil' : 'Connexion', 
      path: user ? '/profile' : '/auth', 
      active: currentPath === '/profile' || currentPath === '/auth',
      badge: null
    },
  ];

  return (
    <nav className="md:hidden !fixed !bottom-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-t border-border/20 px-2 py-2 shadow-lg" style={{ position: 'fixed', bottom: 0 }}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isExternal = 'external' in item && item.external;
          
          if (isExternal) {
            return (
              <button
                key={item.path}
                onClick={() => window.location.href = item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <item.icon className={cn("h-5 w-5 mb-1", item.active && "animate-pulse")} />
                  {item.badge !== null && item.badge !== undefined && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-2xs font-medium text-center leading-tight">{item.label}</span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5 mb-1", item.active && "animate-pulse")} />
                {item.badge !== null && item.badge !== undefined && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-2xs font-medium text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
