import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Menu, X, Plus, FileText, Bell, Shield, Building, Plane, Hotel, BookOpen, Car, Heart, UtensilsCrossed, HelpingHand, Leaf, Activity, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/hooks/useNotifications';
import Logo from '@/components/ui/Logo';
import { toast } from 'sonner';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Debug logs pour vérifier l'état d'authentification
  console.log('📱 MobileSidebar - User:', user?.email, 'isAdmin:', isAdmin);

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
          
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
            <Logo size={48} className="text-primary object-contain" />
          </div>

          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Notification Bell */}
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {getInitials(user.email || 'U')}
                  </span>
                </div>
              </>
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
            {/* Categories Section - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-sm font-semibold text-muted-foreground">Catégories</h3>
                {categoriesOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {categoriesOpen && (
                <div className="space-y-1 mt-2">
                  <Link
                    to="/category/sejours"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Séjours</span>
                    </div>
                  </Link>

                  <Link
                    to="/category/vols"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Plane className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Vols</span>
                    </div>
                  </Link>

                  <Link
                    to="/category/hebergements"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Hotel className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Hébergements</span>
                    </div>
                  </Link>

                  <Link
                    to="/category/guides"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Guides</span>
                    </div>
                  </Link>

                  <Link
                    to="/category/chauffeurs"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Chauffeurs</span>
                    </div>
                  </Link>

                  <Link
                    to="/category/babysitting"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Baby-sitting</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Services Section - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-sm font-semibold text-muted-foreground">Services</h3>
                {servicesOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {servicesOpen && (
                <div className="space-y-1 mt-2">
                  <button
                    onClick={() => {
                      console.log('📱 Mobile blog button clicked, navigating to /blog');
                      navigate('/blog');
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors w-full ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Blog</span>
                    </div>
                  </button>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3">
                    <div className="flex items-center space-x-3">
                      <HelpingHand className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Association</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3">
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Produit naturel</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Activité</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Section - Only for authenticated users */}
            <div className="border-t border-border pt-4 mb-4"></div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-3">
              TOUJOURS VISIBLE - User: {user?.email || 'Non connecté'} | Admin: {isAdmin ? 'Oui' : 'Non'}
            </h3>
            
            {user && (
              <div className="bg-green-100 p-2 rounded mb-2">
                <p className="text-xs text-green-800">✅ Section utilisateur connecté visible</p>
              </div>
            )}
            
            {!user && (
              <div className="bg-red-100 p-2 rounded mb-2">
                <p className="text-xs text-red-800">❌ Utilisateur non connecté</p>
              </div>
            )}

            {user && (
              <>
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Link>

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

                {/* Admin Section - Only visible for admins */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Administration</span>
                  </Link>
                )}
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