import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Menu, X, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      setIsOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <div className="text-lg font-bold text-foreground">
              <span className="text-primary">OMRA</span>
              <span className="text-muted-foreground text-sm ml-1">BONS PLANS</span>
            </div>
          </div>

          <div className="w-8 h-8 flex items-center justify-center">
            {user && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {getInitials(user.email || 'U')}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-border">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {getInitials(user.email || 'U')}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {user.email?.split('@')[0] || 'Utilisateur'}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-2">
            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Profile</span>
                </Link>

                <Link
                  to="/my-ads"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Mes annonces</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Paramètres</span>
                </Link>
              </>
            )}
          </div>

          {/* Disconnect Button */}
          {user && (
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-center text-destructive border-destructive hover:bg-destructive/10"
              >
                Se déconnecter
              </Button>
            </div>
          )}

          {/* Login Button for non-authenticated users */}
          {!user && (
            <div className="absolute bottom-6 left-6 right-6">
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button className="w-full">
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Publish Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <Link to="/publish">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-base font-semibold"
            onClick={() => setIsOpen(false)}
          >
            <Plus className="w-5 h-5" />
            <span>Créer une annonce</span>
          </Button>
        </Link>
      </div>

      {/* Mobile Content Padding */}
      {/* Bottom padding for fixed button */}
      <div className="lg:hidden h-20" />
    </>
  );
};

export default MobileSidebar;