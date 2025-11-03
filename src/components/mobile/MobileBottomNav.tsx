import { Home, Search, MessageCircle, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import DynamicIcon from '@/components/ui/DynamicIcon';

/**
 * Bottom Navigation Mobile-First
 * - Position fixe en bas de l'écran
 * - 5 actions principales
 * - Active state avec indicateur visuel
 */
export const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/', active: currentPath === '/' },
    { icon: Search, label: 'Comparateur', path: '/comparateur-omra', active: currentPath === '/comparateur-omra' },
    { icon: MessageCircle, label: 'Discussions', path: '/discussions', active: currentPath === '/discussions' },
    { icon: User, label: user ? 'Profil' : 'Connexion', path: user ? '/profile' : '/auth', active: currentPath === '/profile' || currentPath === '/auth' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/20 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className={cn("h-5 w-5 mb-1", item.active && "animate-pulse")} />
            <span className="text-2xs font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Menu supplémentaire */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 min-w-[60px]">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-2xs font-medium">Plus</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl">
            <div className="py-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Menu</h3>
              <div className="grid grid-cols-3 gap-4">
                <Link to="/publish" className="flex flex-col items-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
                  <DynamicIcon name="plus" className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs text-center font-medium">Publier</span>
                </Link>
                <Link to="/blog" className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <DynamicIcon name="book-open" className="h-6 w-6 mb-2" />
                  <span className="text-xs text-center font-medium">Blog</span>
                </Link>
                <Link to="/contact" className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <DynamicIcon name="mail" className="h-6 w-6 mb-2" />
                  <span className="text-xs text-center font-medium">Contact</span>
                </Link>
                <Link to="/my-ads" className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <DynamicIcon name="list" className="h-6 w-6 mb-2" />
                  <span className="text-xs text-center font-medium">Mes annonces</span>
                </Link>
                <Link to="/settings" className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <DynamicIcon name="settings" className="h-6 w-6 mb-2" />
                  <span className="text-xs text-center font-medium">Paramètres</span>
                </Link>
                <Link to="/about" className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <DynamicIcon name="info" className="h-6 w-6 mb-2" />
                  <span className="text-xs text-center font-medium">À propos</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
