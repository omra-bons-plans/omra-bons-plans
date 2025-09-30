import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_SESSION_TOKEN_KEY = 'admin_session_token';
const ADMIN_SESSION_EXPIRES_KEY = 'admin_session_expires_at';
const ADMIN_SESSION_IP_KEY = 'admin_session_ip';
const SESSION_CHECK_INTERVAL = 60000; // Vérifier toutes les minutes

export const useAdminVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkVerification();
    
    // Démarrer la vérification périodique
    intervalRef.current = setInterval(() => {
      validateSession();
    }, SESSION_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkVerification = async () => {
    const sessionToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
    const expiresAt = sessionStorage.getItem(ADMIN_SESSION_EXPIRES_KEY);
    
    if (sessionToken && expiresAt) {
      const expiry = new Date(expiresAt);
      const now = new Date();
      
      if (now < expiry) {
        // Valider la session côté serveur
        const isValid = await validateSession();
        if (isValid) {
          setIsVerified(true);
          setIsLoading(false);
          return;
        }
      }
      
      // Session expirée ou invalide
      clearSession();
    }
    
    setIsVerified(false);
    setIsLoading(false);
  };

  const clearSession = () => {
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_EXPIRES_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_IP_KEY);
    setIsVerified(false);
  };

  const validateSession = useCallback(async (): Promise<boolean> => {
    const sessionToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
    
    if (!sessionToken) {
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('validate-admin-session', {
        body: { sessionToken }
      });

      if (error) {
        console.error('Session validation error:', error);
        clearSession();
        return false;
      }

      if (!data?.valid) {
        if (data?.expired) {
          toast({
            title: "⏱️ Session expirée",
            description: "Votre session admin a expiré. Reconnexion requise.",
            variant: "destructive"
          });
        }
        clearSession();
        return false;
      }

      // Alerte en cas de changement d'IP
      if (data.warning) {
        console.warn('🚨 Security alert:', data.warning);
        toast({
          title: "⚠️ Alerte de sécurité",
          description: data.warning,
          variant: "destructive"
        });
      }

      // Mettre à jour l'expiration de la session
      if (data.sessionExpiresAt) {
        sessionStorage.setItem(ADMIN_SESSION_EXPIRES_KEY, data.sessionExpiresAt);
      }

      return true;
    } catch (error: any) {
      console.error('Session validation failed:', error);
      clearSession();
      return false;
    }
  }, [toast]);

  const requestCode = async () => {
    setIsSendingCode(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté",
          variant: "destructive"
        });
        return false;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Erreur",
          description: "Session invalide",
          variant: "destructive"
        });
        return false;
      }

      // 🔒 Générer le device fingerprint
      const { generateDeviceFingerprint } = await import('@/utils/deviceFingerprint');
      const deviceFingerprint = generateDeviceFingerprint();

      const { data, error } = await supabase.functions.invoke('send-admin-code', {
        body: { 
          email: user.email,
          device_fingerprint: deviceFingerprint
        }
      });

      if (error) {
        console.error('Error requesting code:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'envoyer le code",
          variant: "destructive"
        });
        return false;
      }

      // 🚨 Vérifier si le device est bloqué
      if (data?.blocked) {
        toast({
          title: "🚨 Accès bloqué",
          description: data.error || "Nouvel appareil détecté. Vérifiez votre email.",
          variant: "destructive",
          duration: 10000
        });
        return false;
      }

      toast({
        title: "✅ Code envoyé",
        description: `Un code de vérification a été envoyé à ${user.email}. Valide pendant 5 minutes.`,
      });

      return true;
    } catch (error: any) {
      console.error('Request code error:', error);
      
      // Gérer l'erreur 429 (trop de tentatives)
      if (error.message?.includes('429')) {
        toast({
          title: "⏱️ Trop de tentatives",
          description: "Vous avez atteint la limite de demandes. Réessayez plus tard.",
          variant: "destructive",
          duration: 10000
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive"
        });
      }
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async (code: string) => {
    setIsVerifyingCode(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Erreur",
          description: "Session invalide",
          variant: "destructive"
        });
        return false;
      }

      const { data, error } = await supabase.functions.invoke('verify-admin-code', {
        body: { code }
      });

      if (error) {
        console.error('Error verifying code:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de vérifier le code",
          variant: "destructive"
        });
        return false;
      }

      if (!data?.valid) {
        toast({
          title: "Code invalide",
          description: data?.error || "Le code est incorrect ou expiré",
          variant: "destructive"
        });
        return false;
      }

      // Stocker la session sécurisée
      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, data.sessionToken);
      sessionStorage.setItem(ADMIN_SESSION_EXPIRES_KEY, data.sessionExpiresAt);
      if (data.sessionIp) {
        sessionStorage.setItem(ADMIN_SESSION_IP_KEY, data.sessionIp);
      }
      
      setIsVerified(true);
      
      toast({
        title: "🔒 Accès sécurisé autorisé",
        description: "Session admin active (30 min d'inactivité max)",
      });

      // Démarrer la surveillance de session
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        validateSession();
      }, SESSION_CHECK_INTERVAL);

      return true;
    } catch (error: any) {
      console.error('Verify code error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const logout = () => {
    clearSession();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast({
      title: "Déconnexion",
      description: "Session admin terminée",
    });
  };

  return {
    isVerified,
    isLoading,
    isSendingCode,
    isVerifyingCode,
    requestCode,
    verifyCode,
    logout
  };
};
