import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Menu, X, Plus, FileText, Bell, Shield, Building, Plane, Hotel, BookOpen, Car, Heart, UtensilsCrossed, Utensils, HelpingHand, Leaf, Train, ChevronRight, ChevronDown, Clock, Calendar, Info, Mail, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/hooks/useNotifications';
import Logo from '@/components/ui/Logo';
import { toast } from 'sonner';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bonsPlansOpen, setBonsPlansOpen] = useState(false);
  const [comparatifsOpen, setComparatifsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { unreadCount } = useNotifications();
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
      {/* Mobile Header - Only for phones - Position fixed pour éviter l'espace */}
      <header className="md:hidden !fixed !top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md px-4 py-2.5" style={{ position: 'fixed', top: 0, borderBottom: '0', boxShadow: 'none', margin: 0, padding: '10px 16px' }}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="p-2"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
            <Logo size={96} className="text-primary object-contain" />
          </div>

          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Notification Bell */}
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="sm" className="p-2" aria-label="Voir les notifications">
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
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-full max-w-sm bg-background border-r border-border z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 pb-0 flex-shrink-0">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-2"
              aria-label="Fermer le menu"
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

          </div>
          
          {/* Scrollable Menu Items */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-2 pb-4">
            
            {/* Accueil Button */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-4"
            >
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Comparateur Omra</span>
            </Link>

            {/* Bons Plans Section - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setBonsPlansOpen(!bonsPlansOpen)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={bonsPlansOpen ? "Fermer les bons plans" : "Ouvrir les bons plans"}
                aria-expanded={bonsPlansOpen}
              >
                <h3 className="text-sm font-semibold text-muted-foreground">Bons Plans</h3>
                {bonsPlansOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {bonsPlansOpen && (
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


            {/* Comparatifs Section - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setComparatifsOpen(!comparatifsOpen)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={comparatifsOpen ? "Fermer les comparatifs" : "Ouvrir les comparatifs"}
                aria-expanded={comparatifsOpen}
              >
                <h3 className="text-sm font-semibold text-muted-foreground">Comparatifs</h3>
                {comparatifsOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {comparatifsOpen && (
                <div className="space-y-1 mt-2">
                  <Link
                    to="/comparatif-agences"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Comparatif Agences</span>
                    </div>
                  </Link>

                  <Link
                    to="/comparatif-visuel"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Comparatif Visuel</span>
                    </div>
                  </Link>

                  <Link
                    to="/agences-liste"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Liste des Agences</span>
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
                aria-label={servicesOpen ? "Fermer les services" : "Ouvrir les services"}
                aria-expanded={servicesOpen}
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
                  <Link
                    to="/discussions"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Discussions</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      console.log('📱 Mobile blog button clicked, navigating to /blog');
                      navigate('/blog');
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors w-full ml-3"
                    aria-label="Aller au blog"
                  >
                    <div className="flex items-center space-x-3">
                      <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Blog</span>
                    </div>
                  </button>

                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Info className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">À propos</span>
                    </div>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Contact</span>
                    </div>
                  </Link>

                  <Link
                    to="/prayer-times"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Horaires de prière</span>
                    </div>
                  </Link>

                  <Link
                    to="/islamic-calendar"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ml-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Calendrier islamique</span>
                    </div>
                  </Link>

                  <Link to="/blog/general" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Blog Général</span>
                    </div>
                  </Link>

                  <Link to="/blog/restaurants" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <Utensils className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Restaurants Halal</span>
                    </div>
                  </Link>

                  <Link to="/blog/associations" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <HelpingHand className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Association</span>
                    </div>
                  </Link>

                  <Link to="/blog/vendeurs" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Produit naturel</span>
                    </div>
                  </Link>

                  <a 
                    href="https://sar.hhr.sa/timetable#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ml-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Train className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Billets de train</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* User Section - Only for authenticated users */}
            <div className="border-t border-border pt-4 mb-4"></div>

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
          </div>

          {/* Bottom Buttons */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-border">
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-center text-destructive border-destructive hover:bg-destructive/10"
              >
                Se déconnecter
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full">
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
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
            <span>Publier une annonce</span>
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