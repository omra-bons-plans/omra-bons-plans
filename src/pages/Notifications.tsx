import { useEffect } from 'react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Bell from 'lucide-react/dist/esm/icons/bell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import UserMenu from '@/components/ui/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';

const Notifications = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <DynamicSEO
        title="Mes Notifications | Centre de Notifications - Omra Bons Plans"
        description="Consultez toutes vos notifications et restez informé de vos activités sur Omra Bons Plans. Messages, alertes et mises à jour importantes."
        keywords={['notifications', 'alertes', 'messages', 'activités']}
        path="/notifications"
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Mes Notifications
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Restez au courant de toutes vos activités
                  </p>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Centre de Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <NotificationCenter className="border-0 shadow-none" />
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">À propos des notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Vues de profil :</strong> Vous recevez une notification quand quelqu'un consulte votre profil public
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Demandes de contact :</strong> Notification quand quelqu'un souhaite vous contacter pour une annonce
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Statut d'annonce :</strong> Mises à jour sur l'état de vos annonces (validation, rejet, etc.)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Expiration :</strong> Rappel quand vos annonces arrivent à expiration
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Système :</strong> Messages importants de l'équipe OmraBus
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Notifications;