import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_VERIFICATION_KEY = 'admin_verification_expires_at';

export const useAdminVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = () => {
    const expiresAt = sessionStorage.getItem(ADMIN_VERIFICATION_KEY);
    
    if (expiresAt) {
      const expiry = new Date(expiresAt);
      const now = new Date();
      
      if (now < expiry) {
        setIsVerified(true);
        setIsLoading(false);
        return;
      } else {
        sessionStorage.removeItem(ADMIN_VERIFICATION_KEY);
      }
    }
    
    setIsVerified(false);
    setIsLoading(false);
  };

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

      const { data, error } = await supabase.functions.invoke('send-admin-code', {
        body: { email: user.email }
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

      toast({
        title: "✅ Code envoyé",
        description: `Un code de vérification a été envoyé à ${user.email}. Valide pendant 5 minutes.`,
      });

      return true;
    } catch (error: any) {
      console.error('Request code error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
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

      // Stocker l'expiration dans sessionStorage
      const expiresAt = data.expiresAt || new Date(Date.now() + 5 * 60 * 1000).toISOString();
      sessionStorage.setItem(ADMIN_VERIFICATION_KEY, expiresAt);
      
      setIsVerified(true);
      
      toast({
        title: "✅ Accès autorisé",
        description: "Code valide, accès admin accordé",
      });

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
    sessionStorage.removeItem(ADMIN_VERIFICATION_KEY);
    setIsVerified(false);
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
