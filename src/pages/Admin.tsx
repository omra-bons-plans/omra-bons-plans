import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Users from 'lucide-react/dist/esm/icons/users';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import UserX from 'lucide-react/dist/esm/icons/user-x';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Building from 'lucide-react/dist/esm/icons/building';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Shield from 'lucide-react/dist/esm/icons/shield';
import MousePointer from 'lucide-react/dist/esm/icons/mouse-pointer';
import Activity from 'lucide-react/dist/esm/icons/activity';
import Menu from 'lucide-react/dist/esm/icons/menu';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Settings from 'lucide-react/dist/esm/icons/settings';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Lock from 'lucide-react/dist/esm/icons/lock';
import PlaneTakeoff from 'lucide-react/dist/esm/icons/plane-takeoff';
import Landmark from 'lucide-react/dist/esm/icons/landmark';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '@/components/ui/UserMenu';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  phone: string;
  whatsapp: string;
  company_name: string;
  is_professional: boolean;
  created_at: string;
  role: 'admin' | 'user';
  ads_count: number;
  ad_views: number;
  contact_views: number;
  slug?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [clickStats, setClickStats] = useState({
    totalAdViews: 0,
    totalContactViews: 0,
    totalClicks: 0
  });
  
  // États pour l'authentification par code
  const [showCodeAuth, setShowCodeAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Vérifier la session admin au chargement
  useEffect(() => {
    const checkAdminSession = () => {
      const sessionToken = localStorage.getItem('admin_session_token');
      const sessionExpiry = localStorage.getItem('admin_session_expiry');
      
      if (sessionToken && sessionExpiry) {
        const expiryDate = new Date(sessionExpiry);
        if (expiryDate > new Date()) {
          setShowCodeAuth(false);
          return true;
        } else {
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_session_expiry');
        }
      }
      return false;
    };

    if (adminLoading) return;
    
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }

    const hasValidSession = checkAdminSession();
    if (!hasValidSession) {
      setShowCodeAuth(true);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [isAdmin, adminLoading, user]);

  // Timer pour le compte à rebours
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSendCode = async () => {
    if (!adminEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email admin",
        variant: "destructive"
      });
      return;
    }

    setSendingCode(true);
    try {
      const { error } = await supabase.functions.invoke('send-admin-code', {
        body: {
          email: adminEmail,
          ipAddress: null,
          userAgent: navigator.userAgent
        }
      });

      if (error) throw error;

      setCodeSent(true);
      setTimeLeft(300); // 5 minutes
      toast({
        title: "Code envoyé",
        description: "Un code à 6 chiffres a été envoyé à votre email. Il est valable 5 minutes.",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive"
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    setVerifyingCode(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-code', {
        body: {
          email: adminEmail,
          code,
          ipAddress: null,
          userAgent: navigator.userAgent,
          deviceFingerprint: null
        }
      });

      if (error) throw error;

      if (data.success) {
        // Stocker le token de session
        localStorage.setItem('admin_session_token', data.sessionToken);
        localStorage.setItem('admin_session_expiry', data.expiresAt);
        
        setShowCodeAuth(false);
        toast({
          title: "Accès accordé",
          description: "Bienvenue dans l'interface d'administration",
        });
        
        // Charger les données
        fetchUsers();
      } else {
        throw new Error(data.error || 'Code invalide');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Code invalide ou expiré",
        variant: "destructive"
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les profils avec les rôles et le nombre d'annonces
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          first_name,
          phone,
          whatsapp,
          company_name,
          is_professional,
          created_at,
          slug
        `);

      if (profilesError) throw profilesError;

      // Récupérer les rôles pour chaque utilisateur
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Récupérer le nombre d'annonces pour chaque utilisateur
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('user_id');

      if (adsError) throw adsError;

      // Récupérer les statistiques de clics pour chaque utilisateur
      const { data: clickStatsData, error: clickStatsError } = await supabase
        .from('click_stats')
        .select(`
          click_type,
          ads!inner(user_id)
        `);

      if (clickStatsError) throw clickStatsError;

      // Calculer les statistiques globales
      const totalAdViews = clickStatsData?.filter(stat => stat.click_type === 'ad_view').length || 0;
      const totalContactViews = clickStatsData?.filter(stat => stat.click_type === 'contact_view').length || 0;
      setClickStats({
        totalAdViews,
        totalContactViews,
        totalClicks: totalAdViews + totalContactViews
      });

      // Combiner les données
      const usersWithRoles = profilesData.map(profile => {
        const userRole = rolesData.find(role => role.user_id === profile.id);
        const userAdsCount = adsData.filter(ad => ad.user_id === profile.id).length;
        
        // Calculer les statistiques pour cet utilisateur
        const userAdViews = clickStatsData?.filter(stat => 
          stat.click_type === 'ad_view' && stat.ads?.user_id === profile.id
        ).length || 0;
        
        const userContactViews = clickStatsData?.filter(stat => 
          stat.click_type === 'contact_view' && stat.ads?.user_id === profile.id
        ).length || 0;
        
        return {
          ...profile,
          role: userRole?.role || 'user',
          ads_count: userAdsCount,
          ad_views: userAdViews,
          contact_views: userContactViews
        } as UserProfile;
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // Utiliser la fonction sécurisée avec audit
      const { data, error } = await supabase.rpc('secure_role_change', {
        target_user_id: userId,
        new_role: newRole,
        admin_ip: null, // Optionnel: pourrait être récupéré côté client
        admin_user_agent: navigator.userAgent
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string; old_role?: string; new_role?: string; admin_email?: string; target_email?: string };

      if (!result.success) {
        throw new Error(result.error || 'Échec du changement de rôle');
      }

      toast({
        title: "✅ Sécurité renforcée",
        description: `Rôle mis à jour: ${result.old_role} → ${result.new_role}. Action auditée.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "🛡️ Accès refusé",
        description: error.message || "Action non autorisée par les protections de sécurité",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Appeler l'Edge Function sécurisée pour supprimer l'utilisateur
      const { data, error: fnError } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      });
      
      if (fnError) {
        console.error('Erreur lors de la suppression du compte:', fnError);
        throw fnError;
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }

      // Les suppressions en cascade devraient gérer le reste (profils, annonces, etc.)
      // grâce aux contraintes de clés étrangères avec ON DELETE CASCADE

      toast({
        title: "Succès",
        description: "Compte utilisateur supprimé définitivement avec toutes ses données",
      });

      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte utilisateur. Vérifiez vos permissions d'administrateur.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesAccountType = accountTypeFilter === 'all' || 
                              (accountTypeFilter === 'professional' && user.is_professional) ||
                              (accountTypeFilter === 'individual' && !user.is_professional);

    return matchesSearch && matchesRole && matchesAccountType;
  });

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const professionalUsers = users.filter(u => u.is_professional).length;
  const totalAds = users.reduce((sum, user) => sum + user.ads_count, 0);

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Administration</SheetTitle>
          <SheetDescription>
            Gérer les différentes sections
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/ads from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/ads');
            }}
            className="justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gérer les annonces
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/blog from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/blog');
            }}
            className="justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Gérer le blog
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/topic-requests from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/topic-requests');
            }}
            className="justify-start"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Demandes de sujets
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/scrapers from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/scrapers');
            }}
            className="justify-start"
          >
            <Activity className="w-4 h-4 mr-2" />
            Scrapers Omra
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/omra-offers from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/omra-offers');
            }}
            className="justify-start"
          >
            <PlaneTakeoff className="w-4 h-4 mr-2" />
            Ajouter offre Omra
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/omra-management from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/omra-management');
            }}
            className="justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Gestion Offres Omra
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/hajj-management from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/hajj-management');
            }}
            className="justify-start"
          >
            <Landmark className="w-4 h-4 mr-2" />
            Gestion Offres Hajj
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log('📱 Navigating to /admin/agencies from mobile menu');
              setMobileSheetOpen(false);
              navigate('/admin/agencies');
            }}
            className="justify-start"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Gestion Agences
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Formulaire d'authentification par code */}
      {showCodeAuth ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Accès Administrateur</CardTitle>
              <CardDescription className="text-center">
                {!codeSent 
                  ? "Entrez votre email pour recevoir un code d'accès"
                  : "Entrez le code à 6 chiffres reçu par email"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!codeSent ? (
                <>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email admin"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={sendingCode}
                      className="text-center"
                    />
                  </div>
                  <Button 
                    onClick={handleSendCode}
                    disabled={sendingCode || !adminEmail}
                    className="w-full"
                  >
                    {sendingCode ? "Envoi en cours..." : "Recevoir le code"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Code à 6 chiffres"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={verifyingCode}
                      className="text-center text-2xl font-mono tracking-widest"
                      maxLength={6}
                    />
                    {timeLeft > 0 && (
                      <p className="text-sm text-center text-muted-foreground">
                        Code valide pendant : <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={handleVerifyCode}
                    disabled={verifyingCode || code.length !== 6}
                    className="w-full"
                  >
                    {verifyingCode ? "Vérification..." : "Valider le code"}
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setCodeSent(false);
                      setCode('');
                      setTimeLeft(0);
                    }}
                    className="w-full"
                  >
                    Renvoyer un nouveau code
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <span 
                className="text-lg md:text-2xl font-normal text-foreground tracking-tight cursor-pointer" 
                onClick={() => navigate('/')}
              >
                {isMobile ? 'OBP.fr' : 'OmraBonsPlans.fr'}
              </span>
              <Badge variant="outline" className="text-xs md:text-sm">
                <Shield className="w-3 h-3 mr-1" />
                {isMobile ? 'Admin' : 'Administration'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {isMobile ? (
                <MobileNavigation />
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/ads');
                      navigate('/admin/ads');
                    }}
                    className="text-sm"
                  >
                    Gérer les annonces
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/blog');
                      navigate('/admin/blog');
                    }}
                    className="text-sm"
                  >
                    Gérer le blog
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/topic-requests');
                      navigate('/admin/topic-requests');
                    }}
                    className="text-sm"
                  >
                    Demandes de sujets
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/scrapers');
                      navigate('/admin/scrapers');
                    }}
                    className="text-sm"
                  >
                    Scrapers Omra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/omra-offers');
                      navigate('/admin/omra-offers');
                    }}
                    className="text-sm bg-gradient-to-r from-primary/10 to-accent/10"
                  >
                    <PlaneTakeoff className="w-4 h-4 mr-2" />
                    Ajouter offre Omra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/omra-management');
                      navigate('/admin/omra-management');
                    }}
                    className="text-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gestion Offres Omra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/hajj-management');
                      navigate('/admin/hajj-management');
                    }}
                    className="text-sm bg-gradient-to-r from-amber-500/10 to-yellow-500/10"
                  >
                    <Landmark className="w-4 h-4 mr-2" />
                    Gestion Offres Hajj
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/security-audit');
                      navigate('/admin/security-audit');
                    }}
                    className="text-sm"
                  >
                    🛡️ Audit Sécurité
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🖥️ Desktop: Navigating to /admin/agencies');
                      navigate('/admin/agencies');
                    }}
                    className="text-sm"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Gestion Agences
                  </Button>
                </>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isMobile ? 'Gestion clients' : 'Gestion des comptes clients'}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {isMobile ? 'Gérez les utilisateurs et leurs annonces' : 'Gérez les utilisateurs, leurs rôles et leurs annonces'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Utilisateurs' : 'Total Utilisateurs'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Admins' : 'Administrateurs'}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{adminUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Pro' : 'Comptes Pro'}
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{professionalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Annonces' : 'Total Annonces'}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{totalAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Vues' : 'Vues Annonces'}
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{clickStats.totalAdViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {isMobile ? 'Clics' : 'Clics Contact'}
                </CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{clickStats.totalContactViews}</div>
              </CardContent>
            </Card>
          </div>

          {/* System Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Maintenance Système
              </CardTitle>
              <CardDescription>
                Mise à jour manuelle des données externes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={async () => {
                    try {
                      toast({
                        title: "Mise à jour en cours...",
                        description: "Récupération des données météo"
                      });
                      
                      const { data, error } = await supabase.functions.invoke('update-weather-data');
                      
                      if (error) throw error;
                      
                      toast({
                        title: "✅ Météo mise à jour",
                        description: `Makkah: ${data.weather[0]?.temperature}°C, Médine: ${data.weather[1]?.temperature}°C`
                      });
                    } catch (error: any) {
                      toast({
                        title: "Erreur",
                        description: error.message,
                        variant: "destructive"
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Actualiser Météo
                </Button>
                
                <Button
                  onClick={async () => {
                    try {
                      toast({
                        title: "Mise à jour en cours...",
                        description: "Récupération du taux de change"
                      });
                      
                      const { data, error } = await supabase.functions.invoke('update-exchange-rates');
                      
                      if (error) throw error;
                      
                      toast({
                        title: "✅ Taux de change mis à jour",
                        description: `1€ = ${data.rate} SAR`
                      });
                    } catch (error: any) {
                      toast({
                        title: "Erreur",
                        description: error.message,
                        variant: "destructive"
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Actualiser Taux de Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <Input
                    placeholder={isMobile ? "Rechercher..." : "Rechercher par nom, email ou entreprise..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isMobile ? "Rôle" : "Filtrer par rôle"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="user">Utilisateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isMobile ? "Type" : "Type de compte"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les comptes</SelectItem>
                      <SelectItem value="professional">Professionnels</SelectItem>
                      <SelectItem value="individual">Particuliers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                // Mobile Card Layout
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {user.full_name || user.first_name || 'Sans nom'}
                            </div>
                            <div className="text-xs text-muted-foreground break-all">
                              {user.email}
                            </div>
                            {user.company_name && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                                {user.company_name}
                              </div>
                            )}
                          </div>
                          <Badge variant={user.is_professional ? "default" : "secondary"} className="text-xs">
                            {user.is_professional ? "Pro" : "Part."}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Rôle:</span>
                            <Select
                              value={user.role}
                              onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                            >
                              <SelectTrigger className="w-full h-8 text-xs mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Annonces:</span>
                            <div className="font-medium mt-1">{user.ads_count}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Vues:</span>
                            <div className="font-medium">{user.ad_views}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Contacts:</span>
                            <div className="font-medium">{user.contact_views}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.slug && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/profile/${user.slug}`)}
                                className="h-8 px-2 text-xs"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 px-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                // Desktop Table Layout
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Annonces</TableHead>
                      <TableHead>Statistiques</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name || user.first_name || 'Sans nom'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.company_name && (
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                {user.company_name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.phone && (
                              <div className="text-sm flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                            {user.whatsapp && (
                              <div className="text-sm text-green-600">
                                WhatsApp: {user.whatsapp}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_professional ? "default" : "secondary"}>
                            {user.is_professional ? "Professionnel" : "Particulier"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                            disabled={false} // Tous les admins peuvent changer les rôles
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.ads_count} annonce{user.ads_count > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-xs flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {user.ad_views} vues
                            </div>
                            <div className="text-xs flex items-center text-green-600">
                              <MousePointer className="w-3 h-3 mr-1" />
                              {user.contact_views} contacts
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/profile/${user.slug || user.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.id !== user?.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également toutes ses annonces.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Admin;