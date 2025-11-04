import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  User, Settings, LogOut, Plus, FileText, Bell, Shield, Building, 
  Plane, Hotel, BookOpen, Car, Heart, UtensilsCrossed, HelpingHand, 
  Leaf, Activity, ChevronRight, ChevronDown, Home, Info, Mail, Clock, Calendar, CalendarDays, BarChart3, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/hooks/useNotifications';
import Logo from '@/components/ui/Logo';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function DesktopSidebar() {
  const [bonsPlansOpen, setBonsPlansOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(true);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { unreadCount } = useNotifications();
  const { state } = useSidebar();
  const navigate = useNavigate();

  const collapsed = state === "collapsed";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className={`p-4 border-b ${collapsed ? 'flex justify-center' : ''}`}>
          <div 
            className={`flex items-center cursor-pointer ${collapsed ? 'justify-center' : 'justify-center'}`}
            onClick={() => navigate('/')}
          >
            <Logo size={collapsed ? 64 : 64} className="text-primary" />
            {!collapsed && (
              <span className="ml-2 font-bold text-lg">OmraBonsPlans.fr</span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls}>
                    <Home className="w-4 h-4" />
                    {!collapsed && <span>Bons Plans</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/favoris" className={getNavCls}>
                    <Heart className="w-4 h-4" />
                    {!collapsed && <span>Favoris</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bons Plans Section */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <NavLink 
                to="/bons-plans" 
                className="flex-1 cursor-pointer hover:text-primary transition-colors"
              >
                Bons Plans
              </NavLink>
              <button 
                onClick={() => setBonsPlansOpen(!bonsPlansOpen)}
                className="cursor-pointer hover:text-primary transition-colors"
              >
                {bonsPlansOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </SidebarGroupLabel>
            {bonsPlansOpen && (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/sejours" className={getNavCls}>
                        <Building className="w-4 h-4" />
                        <span>Séjours</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/vols" className={getNavCls}>
                        <Plane className="w-4 h-4" />
                        <span>Vols</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/hebergements" className={getNavCls}>
                        <Hotel className="w-4 h-4" />
                        <span>Hébergements</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/guides" className={getNavCls}>
                        <BookOpen className="w-4 h-4" />
                        <span>Guides</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/chauffeurs" className={getNavCls}>
                        <Car className="w-4 h-4" />
                        <span>Chauffeurs</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/category/babysitting" className={getNavCls}>
                        <Heart className="w-4 h-4" />
                        <span>Baby-sitting</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        {/* Main Icons - Collapsed */}
        {collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/" end className={getNavCls}>
                      <Home className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/favoris" className={getNavCls}>
                      <Heart className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/sejours" className={getNavCls}>
                      <Building className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/vols" className={getNavCls}>
                      <Plane className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/hebergements" className={getNavCls}>
                      <Hotel className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/guides" className={getNavCls}>
                      <BookOpen className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/chauffeurs" className={getNavCls}>
                      <Car className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/category/babysitting" className={getNavCls}>
                      <Heart className="w-4 h-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}


        {/* Services Section */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              Services
              <button onClick={() => setServicesOpen(!servicesOpen)}>
                {servicesOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </SidebarGroupLabel>
            {servicesOpen && (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/discussions" className={getNavCls}>
                        <MessageCircle className="w-4 h-4" />
                        <span>Discussions</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/blog" className={getNavCls}>
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Blog</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/about" className={getNavCls}>
                        <Info className="w-4 h-4" />
                        <span>À propos</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/contact" className={getNavCls}>
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/prayer-times" className={getNavCls}>
                        <Clock className="w-4 h-4" />
                        <span>Horaires de prière</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/islamic-calendar" className={getNavCls}>
                        <Calendar className="w-4 h-4" />
                        <span>Calendrier islamique</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/ramadan-hajj-dates" className={getNavCls}>
                        <CalendarDays className="w-4 h-4" />
                        <span>Dates Ramadan / Hajj</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/agences-liste" className={getNavCls}>
                        <BarChart3 className="w-4 h-4" />
                        <span>Agences Omra</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/comparatif-agences" className={getNavCls}>
                        <BarChart3 className="w-4 h-4" />
                        <span>Comparatif Détaillé</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/comparatif-visuel" className={getNavCls}>
                        <BarChart3 className="w-4 h-4" />
                        <span>Comparatif Visuel</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        {/* User Section */}
        {user && !collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>
              Mon compte
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/notifications" className={getNavCls}>
                      <div className="flex items-center relative">
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 text-xs"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </div>
                      <span>Notifications</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/profile" className={getNavCls}>
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/my-ads" className={getNavCls}>
                      <FileText className="w-4 h-4" />
                      <span>Mes annonces</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/settings" className={getNavCls}>
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin" className={getNavCls}>
                        <Shield className="w-4 h-4" />
                        <span>Administration</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bottom Actions */}
        <div className={`mt-auto p-4 border-t space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {user ? (
            <>
              {/* User Info */}
              {!collapsed && (
                <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {getInitials(user.email || 'U')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              )}
              
              {/* User avatar in collapsed mode */}
              {collapsed && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-white">
                    {getInitials(user.email || 'U')}
                  </span>
                </div>
              )}
              
              {/* Publish Button */}
              <Button 
                onClick={() => navigate('/publish')}
                className={`${collapsed ? 'w-8 h-8 p-0' : 'w-full'} justify-center`}
                size={collapsed ? "icon" : "default"}
              >
                <Plus className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Publier une annonce</span>}
              </Button>
              
              {/* Sign Out Button */}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className={`${collapsed ? 'w-8 h-8 p-0' : 'w-full'} justify-center text-destructive border-destructive hover:bg-destructive/10`}
                size={collapsed ? "icon" : "default"}
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Se déconnecter</span>}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className={`${collapsed ? 'w-8 h-8 p-0' : 'w-full'} justify-center`}
              size={collapsed ? "icon" : "default"}
            >
              <User className="w-4 h-4" />
              {!collapsed && <span className="ml-2">Se connecter</span>}
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}