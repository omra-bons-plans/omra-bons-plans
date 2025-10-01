import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '@/components/ui/UserMenu';
import TopicRequestsManager from '@/components/ui/TopicRequestsManager';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOHead } from '@/components/SEO/SEOHead';
import { useEffect } from 'react';
import AdminVerificationGate from '@/components/admin/AdminVerificationGate';

const AdminTopicRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading) {
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

  return (
    <AdminVerificationGate>
      <ResponsiveLayout>
      <SEOHead 
        title="Gestion des demandes de sujets - Administration"
        description="Gérez les demandes de nouveaux sujets de discussion de la communauté."
        canonical="/admin/topic-requests"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
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
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="space-y-6 md:space-y-8">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Demandes de sujets
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  Gérez les demandes de nouveaux sujets de discussion
                </p>
              </div>
            </div>

            {/* Topic Requests Manager */}
            <TopicRequestsManager />
          </div>
        </div>
      </div>
      </ResponsiveLayout>
    </AdminVerificationGate>
  );
};

export default AdminTopicRequests;