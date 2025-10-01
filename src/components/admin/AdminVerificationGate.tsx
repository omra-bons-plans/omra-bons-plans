import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminVerificationGateProps {
  children: React.ReactNode;
}

const AdminVerificationGate = ({ children }: AdminVerificationGateProps) => {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    checkAdminSession();
  }, [user]);

  // Timer pour afficher le temps restant
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        toast.error('Code expiré. Demandez un nouveau code.');
        setCodeSent(false);
        setExpiresAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const checkAdminSession = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Vérifier si l'utilisateur a une session admin valide
      const sessionToken = localStorage.getItem('admin_session_token');
      const sessionExpiry = localStorage.getItem('admin_session_expiry');

      if (sessionToken && sessionExpiry) {
        const now = new Date().getTime();
        const expiry = new Date(sessionExpiry).getTime();

        if (now < expiry) {
          setIsVerified(true);
          setLoading(false);
          return;
        } else {
          // Session expirée
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_session_expiry');
        }
      }

      setIsVerified(false);
      setLoading(false);
    } catch (error) {
      console.error('Erreur vérification session:', error);
      setIsVerified(false);
      setLoading(false);
    }
  };

  const requestCode = async () => {
    if (!user) return;

    setRequesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('request-admin-code', {
        body: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('📧 Code envoyé par email ! Vérifiez votre boîte de réception.');
        setCodeSent(true);
        setExpiresAt(data.expiresAt);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error: any) {
      console.error('Erreur demande code:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setRequesting(false);
    }
  };

  const verifyCode = async () => {
    if (!user || !code || code.length !== 6) {
      toast.error('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-code', {
        body: {
          userId: user.id,
          code: code,
        },
      });

      if (error) throw error;

      if (data.success) {
        // Stocker le token de session
        localStorage.setItem('admin_session_token', data.sessionToken);
        localStorage.setItem('admin_session_expiry', data.sessionExpiresAt);
        
        toast.success('✅ Code vérifié ! Accès admin autorisé.');
        setIsVerified(true);
      } else {
        toast.error(data.error || 'Code invalide');
      }
    } catch (error: any) {
      console.error('Erreur vérification code:', error);
      toast.error(error.message || 'Erreur lors de la vérification du code');
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Vérification Administrateur</CardTitle>
            <CardDescription>
              Pour accéder à l'interface d'administration, un code de vérification à 6 chiffres sera envoyé à votre adresse email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!codeSent ? (
              <div className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Un code vous sera envoyé à <strong>{user?.email}</strong>
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={requestCode} 
                  disabled={requesting}
                  className="w-full"
                  size="lg"
                >
                  {requesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Recevoir le code par email
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Code valide pendant encore <strong>{formatTime(timeLeft)}</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setCode(value);
                    }}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={verifyCode} 
                    disabled={verifying || code.length !== 6}
                    className="w-full"
                    size="lg"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      'Vérifier le code'
                    )}
                  </Button>

                  <Button 
                    onClick={requestCode} 
                    disabled={requesting}
                    variant="outline"
                    className="w-full"
                  >
                    {requesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Demander un nouveau code'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminVerificationGate;
