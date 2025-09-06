import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, ArrowRight } from 'lucide-react';

interface RequiredProfileGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const RequiredProfileGuard = ({ children, redirectPath = '/profile' }: RequiredProfileGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isComplete, loading, missingFields } = useProfileCompletion();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Complétez votre profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Vous devez compléter votre profil avant de pouvoir :
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Publier des annonces</li>
                <li>• Participer au chat</li>
                <li>• Accéder à toutes les fonctionnalités</li>
              </ul>
            </div>
            
            {missingFields.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Champs obligatoires manquants :
                </p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  {missingFields.map(field => (
                    <li key={field}>
                      • {field === 'first_name' ? 'Prénom' : 
                         field === 'gender' ? 'Sexe' : 
                         field === 'phone' ? 'Numéro de téléphone' : field}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={() => navigate(redirectPath)}
              className="w-full"
            >
              Compléter mon profil
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequiredProfileGuard;